package com.mmtmaniteja.api.analytics;

import java.util.List;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AnalyticsDtos {

    private AnalyticsDtos() {}

    /**
     * Beacon body from the frontend on pageview. Kept intentionally small so
     * we can send as a {@code navigator.sendBeacon} POST on unload.
     */
    public record PageviewRequest(
        @NotBlank @Size(max = 64) String sessionId,
        @NotBlank @Size(max = 512) String path,
        @Size(max = 512) String referrer
    ) {}

    /**
     * Sent near unload with final dwell in ms. Matches an existing pageview
     * by {@code sessionId} + {@code path} (newest).
     */
    public record DwellRequest(
        @NotBlank @Size(max = 64) String sessionId,
        @NotBlank @Size(max = 512) String path,
        @Min(0) long dwellMs
    ) {}

    public record PathCount(String path, long views) {}

    /** Admin dashboard summary. {@code rangeDays} window is echoed for clarity. */
    public record AnalyticsSummary(
        int rangeDays,
        long totalViews,
        Double avgDwellMs,
        List<PathCount> topPaths,
        List<PathCount> topReferrers
    ) {}
}
