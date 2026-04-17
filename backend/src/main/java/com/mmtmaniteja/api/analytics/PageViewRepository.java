package com.mmtmaniteja.api.analytics;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PageViewRepository extends JpaRepository<PageView, Long> {

    /**
     * Pre-filled dwell rows are identified by session + path + null dwell.
     * We always update the newest matching row (the one the user is likely leaving).
     */
    Optional<PageView> findFirstBySessionIdAndPathAndDwellMsIsNullOrderByOccurredAtDesc(
            String sessionId, String path);

    long countByOccurredAtAfter(Instant after);

    @Query("""
        select pv.path as path, count(pv) as views
        from PageView pv
        where pv.occurredAt >= :after
        group by pv.path
        order by count(pv) desc
    """)
    List<PathCount> topPaths(@Param("after") Instant after);

    @Query("""
        select coalesce(pv.referrer, '(direct)') as path, count(pv) as views
        from PageView pv
        where pv.occurredAt >= :after
        group by pv.referrer
        order by count(pv) desc
    """)
    List<PathCount> topReferrers(@Param("after") Instant after);

    @Query("""
        select avg(pv.dwellMs)
        from PageView pv
        where pv.occurredAt >= :after and pv.dwellMs is not null
    """)
    Double averageDwellMs(@Param("after") Instant after);

    @Modifying
    @Query("delete from PageView pv where pv.occurredAt < :before")
    int deleteOlderThan(@Param("before") Instant before);

    interface PathCount {
        String getPath();
        Long getViews();
    }
}
