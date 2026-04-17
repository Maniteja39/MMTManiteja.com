package com.mmtmaniteja.api.common;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import io.github.bucket4j.Refill;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Per-client-IP rate limiting on the two public endpoints that are abuse magnets:
 *
 *   POST /api/auth/login          →  5 / minute   (brute-force defense)
 *   POST /api/analytics/pageview  →  60 / minute  (beacon flood defense)
 *   POST /api/analytics/dwell     →  60 / minute  (shares the same bucket family)
 *
 * Everything else is unaffected. The buckets live in a plain {@link ConcurrentHashMap};
 * this is fine for a single-instance deploy (Render free + starter tier). If we ever
 * scale to multiple replicas we'll need to back this with Hazelcast or Redis so the
 * limits are shared across nodes.
 *
 * Hooked into the Spring Security filter chain before JwtAuthFilter so abusive
 * traffic is rejected before we spend cycles on JWT parsing or DB lookups.
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RateLimitFilter.class);

    private static final int LOGIN_CAPACITY = 5;
    private static final int BEACON_CAPACITY = 60;
    private static final Duration REFILL_WINDOW = Duration.ofMinutes(1);

    private final Map<String, Bucket> loginBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> beaconBuckets = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain) throws ServletException, IOException {

        // Never rate-limit CORS preflight — browsers do these automatically and a 429
        // here would break the whole site from the user's perspective.
        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            chain.doFilter(req, res);
            return;
        }

        Bucket bucket = bucketFor(req);
        if (bucket == null) {
            chain.doFilter(req, res);
            return;
        }

        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        if (probe.isConsumed()) {
            // Useful for debugging abuse without leaking info to the client.
            res.setHeader("X-RateLimit-Remaining", String.valueOf(probe.getRemainingTokens()));
            chain.doFilter(req, res);
            return;
        }

        long retryAfterSec = Math.max(1, probe.getNanosToWaitForRefill() / 1_000_000_000L);
        log.warn("Rate limit hit for {} on {} — retry in {}s", clientIp(req), req.getRequestURI(), retryAfterSec);

        res.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        res.setHeader("Retry-After", String.valueOf(retryAfterSec));
        res.setContentType("application/json");
        res.getWriter().write("{\"message\":\"Too many requests. Please slow down.\"}");
    }

    /** Pick the bucket that applies to this request, or {@code null} for unrestricted. */
    private Bucket bucketFor(HttpServletRequest req) {
        if (!"POST".equalsIgnoreCase(req.getMethod())) return null;
        String uri = req.getRequestURI();

        if ("/api/auth/login".equals(uri)) {
            return loginBuckets.computeIfAbsent(clientIp(req), ip -> newBucket(LOGIN_CAPACITY));
        }
        if ("/api/analytics/pageview".equals(uri) || "/api/analytics/dwell".equals(uri)) {
            return beaconBuckets.computeIfAbsent(clientIp(req), ip -> newBucket(BEACON_CAPACITY));
        }
        return null;
    }

    private static Bucket newBucket(int capacity) {
        // Greedy refill: tokens drip back continuously over the window rather than
        // refilling in one batch at the end. Smoother behavior for legitimate clients.
        return Bucket.builder()
                .addLimit(Bandwidth.classic(capacity, Refill.greedy(capacity, REFILL_WINDOW)))
                .build();
    }

    /**
     * Extract the originating client IP. Render sits in front as a reverse proxy and
     * appends the real IP to {@code X-Forwarded-For}. We trust that header only
     * because the app is never reachable directly — the only hop in front is Render.
     */
    private static String clientIp(HttpServletRequest req) {
        String fwd = req.getHeader("X-Forwarded-For");
        if (fwd != null && !fwd.isBlank()) {
            int comma = fwd.indexOf(',');
            return (comma > 0 ? fwd.substring(0, comma) : fwd).trim();
        }
        String real = req.getHeader("X-Real-IP");
        if (real != null && !real.isBlank()) {
            return real.trim();
        }
        return req.getRemoteAddr();
    }
}
