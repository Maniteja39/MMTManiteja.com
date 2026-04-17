package com.mmtmaniteja.api.analytics;

import java.util.List;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public final class AnalyticsDtos {

    private AnalyticsDtos() {}

    /**
     * Beacon body from the frontend on pageview. Kept intentionally small so
     * we can send as a {@code navigator.sendBeacon} POST on unload.
     */
    /**
     * Matches UUIDs (crypto.randomUUID) and the short fallback "s_<rand>_<ts>" the
     * frontend emits when crypto.randomUUID is unavailable. No spaces, no control
     * chars, no slashes — strict enough to prevent log injection and SQL-ish noise.
     */
    private static final String SESSION_ID_PATTERN = "^[A-Za-z0-9_-]{8,64}$";

    public record PageviewRequest(
        @NotBlank @Size(max = 64) @Pattern(regexp = SESSION_ID_PATTERN, message = "sessionId has invalid characters")
        String sessionId,
        @NotBlank @Size(max = 512) String path,
        @Size(max = 512) String referrer
    ) {}

    /**
     * Sent near unload with final dwell in ms. Matches an existing pageview
     * by {@code sessionId} + {@code path} (newest).
     */
    public record DwellRequest(
        @NotBlank @Size(max = 64) @Pattern(regexp = SESSION_ID_PATTERN, message = "sessionId has invalid characters")
        String sessionId,
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
