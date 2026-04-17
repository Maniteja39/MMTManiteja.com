package com.mmtmaniteja.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.mmtmaniteja.api.auth.JwtAuthFilter;
import com.mmtmaniteja.api.common.RateLimitFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final RateLimitFilter rateLimitFilter;
    private final UrlBasedCorsConfigurationSource corsConfigurationSource;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter,
                          RateLimitFilter rateLimitFilter,
                          UrlBasedCorsConfigurationSource corsConfigurationSource) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.rateLimitFilter = rateLimitFilter;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Defense-in-depth response headers. Most of these matter more when an API
            // is consumed by a browser directly (e.g., an error page rendered by the
            // browser, or someone framing our JSON endpoint). Cheap to set, never hurts.
            .headers(h -> h
                // HSTS — tell browsers to pin HTTPS for a year and include subdomains.
                // Render already forces HTTPS, but the header protects against SSL-strip
                // if the client arrives via a compromised intermediary.
                .httpStrictTransportSecurity(hsts -> hsts
                    .includeSubDomains(true)
                    .maxAgeInSeconds(31_536_000L))
                // Prevent any form of framing — defeats clickjacking of API responses
                // or the admin login page if it were ever served via this host.
                .frameOptions(frame -> frame.deny())
                // X-Content-Type-Options: nosniff — browsers must not second-guess
                // our Content-Type headers. Default in recent Spring, set explicitly.
                .contentTypeOptions(cto -> {})
                // Don't leak full URLs (including query strings) via the Referer header
                // when users navigate from admin pages to third-party sites.
                .referrerPolicy(rp -> rp.policy(
                    ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
                // Content-Security-Policy for API responses — we never expect inline
                // scripts or external resources to load out of a JSON response, so lock
                // it all down. The frontend site has its own CSP separately.
                .contentSecurityPolicy(csp -> csp
                    .policyDirectives("default-src 'none'; frame-ancestors 'none'; base-uri 'none'"))
                // Turn off powerful browser features for anything served from this host.
                .permissionsPolicy(pp -> pp
                    .policy("camera=(), microphone=(), geolocation=(), payment=(), usb=()"))
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(
                    "/actuator/health",
                    "/api/auth/login",
                    "/api/auth/me"
                ).permitAll()
                // Admin-only listing (incl. drafts) — MUST precede the public /api/posts/** rule
                .requestMatchers(HttpMethod.GET, "/api/posts/admin", "/api/posts/admin/**").hasRole("ADMIN")
                // Public reads of published content
                .requestMatchers(HttpMethod.GET, "/api/posts", "/api/posts/**").permitAll()
                // Analytics ingest is public (beacon). Reads are admin-only (below).
                .requestMatchers(HttpMethod.POST, "/api/analytics/pageview", "/api/analytics/dwell").permitAll()
                // Everything else requires authentication
                .requestMatchers("/api/analytics/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/posts/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/posts/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/posts/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            // Rate limiter runs first so abusive traffic is bounced before we spend
            // cycles parsing JWTs or hitting the DB.
            .addFilterBefore(rateLimitFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
    }
}
