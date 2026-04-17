package com.mmtmaniteja.api.analytics;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mmtmaniteja.api.analytics.AnalyticsDtos.AnalyticsSummary;
import com.mmtmaniteja.api.analytics.AnalyticsDtos.DwellRequest;
import com.mmtmaniteja.api.analytics.AnalyticsDtos.PageviewRequest;
import com.mmtmaniteja.api.analytics.AnalyticsDtos.PathCount;

@Service
public class AnalyticsService {

    /**
     * Hard cap on a single recorded dwell. Bots and background tabs can produce
     * absurd numbers; clamp to something human-plausible so the averages stay honest.
     */
    private static final long MAX_DWELL_MS = 30L * 60L * 1000L; // 30 minutes

    private final PageViewRepository repo;

    public AnalyticsService(PageViewRepository repo) {
        this.repo = repo;
    }

    @Transactional
    public void recordPageview(PageviewRequest req, String userAgent, String country) {
        PageView pv = new PageView();
        pv.setSessionId(req.sessionId());
        pv.setPath(truncate(req.path(), 512));
        pv.setReferrer(truncate(req.referrer(), 512));
        pv.setUserAgent(truncate(userAgent, 512));
        pv.setCountry(country);
        repo.save(pv);
    }

    @Transactional
    public boolean recordDwell(DwellRequest req) {
        long clamped = Math.min(Math.max(req.dwellMs(), 0L), MAX_DWELL_MS);
        return repo.findFirstBySessionIdAndPathAndDwellMsIsNullOrderByOccurredAtDesc(
                req.sessionId(), req.path())
            .map(pv -> {
                pv.setDwellMs(clamped);
                // flushed on transaction commit
                return true;
            }).orElse(false);
    }

    @Transactional(readOnly = true)
    public AnalyticsSummary summary(int days) {
        int rangeDays = Math.min(Math.max(days, 1), 365);
        Instant after = Instant.now().minus(rangeDays, ChronoUnit.DAYS);

        long total = repo.countByOccurredAtAfter(after);
        Double avg = repo.averageDwellMs(after);

        List<PathCount> paths = repo.topPaths(after).stream()
                .limit(10)
                .map(pc -> new PathCount(pc.getPath(), pc.getViews()))
                .toList();

        List<PathCount> refs = repo.topReferrers(after).stream()
                .limit(10)
                .map(pc -> new PathCount(pc.getPath(), pc.getViews()))
                .toList();

        return new AnalyticsSummary(rangeDays, total, avg, paths, refs);
    }

    private static String truncate(String s, int max) {
        if (s == null) return null;
        return s.length() <= max ? s : s.substring(0, max);
    }
}
