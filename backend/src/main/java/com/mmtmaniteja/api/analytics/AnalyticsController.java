package com.mmtmaniteja.api.analytics;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mmtmaniteja.api.analytics.AnalyticsDtos.AnalyticsSummary;
import com.mmtmaniteja.api.analytics.AnalyticsDtos.DwellRequest;
import com.mmtmaniteja.api.analytics.AnalyticsDtos.PageviewRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService service;

    public AnalyticsController(AnalyticsService service) {
        this.service = service;
    }

    /**
     * Public beacon. No auth; frontend fires this on every pageview.
     * Uses {@code CF-IPCountry} when deployed behind Cloudflare; null otherwise.
     */
    @PostMapping("/pageview")
    public ResponseEntity<Void> pageview(
            @Valid @RequestBody PageviewRequest body,
            @RequestHeader(value = "User-Agent", required = false) String userAgent,
            @RequestHeader(value = "CF-IPCountry", required = false) String country) {
        service.recordPageview(body, userAgent, sanitizeCountry(country));
        return ResponseEntity.accepted().build();
    }

    /** Public beacon — completes a pageview with final dwell time. */
    @PostMapping("/dwell")
    public ResponseEntity<Void> dwell(@Valid @RequestBody DwellRequest body) {
        service.recordDwell(body);
        // Always 202 — beacon fire-and-forget, don't let the client retry and double-count.
        return ResponseEntity.accepted().build();
    }

    /** Admin-only summary — gated by SecurityConfig. */
    @GetMapping("/summary")
    public AnalyticsSummary summary(@RequestParam(defaultValue = "30") int days) {
        return service.summary(days);
    }

    private static String sanitizeCountry(String c) {
        if (c == null || c.length() != 2) return null;
        return c.toUpperCase();
    }
}
