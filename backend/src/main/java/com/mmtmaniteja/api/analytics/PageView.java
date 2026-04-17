package com.mmtmaniteja.api.analytics;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

/**
 * One row per pageview. Dwell time is filled in by a later {@code /dwell} beacon
 * (best-effort) keyed by the same {@code sessionId} + {@code path}.
 */
@Entity
@Table(
    name = "pageviews",
    indexes = {
        @Index(name = "idx_pageviews_occurred_at", columnList = "occurred_at"),
        @Index(name = "idx_pageviews_path", columnList = "path"),
        @Index(name = "idx_pageviews_session_path", columnList = "session_id, path")
    }
)
public class PageView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id", nullable = false, length = 64)
    private String sessionId;

    @Column(nullable = false, length = 512)
    private String path;

    @Column(length = 512)
    private String referrer;

    @Column(name = "user_agent", length = 512)
    private String userAgent;

    /** Two-letter country code, resolved by the platform if available. Nullable. */
    @Column(length = 2)
    private String country;

    /** Milliseconds the user spent on the page. Written later by the dwell beacon. */
    @Column(name = "dwell_ms")
    private Long dwellMs;

    @Column(name = "occurred_at", nullable = false)
    private Instant occurredAt;

    @PrePersist
    void prePersist() {
        if (occurredAt == null) {
            occurredAt = Instant.now();
        }
    }

    // getters / setters
    public Long getId() { return id; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }
    public String getReferrer() { return referrer; }
    public void setReferrer(String referrer) { this.referrer = referrer; }
    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public Long getDwellMs() { return dwellMs; }
    public void setDwellMs(Long dwellMs) { this.dwellMs = dwellMs; }
    public Instant getOccurredAt() { return occurredAt; }
    public void setOccurredAt(Instant occurredAt) { this.occurredAt = occurredAt; }
}
