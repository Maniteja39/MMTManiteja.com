-- Users: single-row admin table for now, but schema supports future growth.
CREATE TABLE users (
    id             BIGSERIAL   PRIMARY KEY,
    username       VARCHAR(64) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    role           VARCHAR(16) NOT NULL DEFAULT 'ADMIN',
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Posts: markdown CMS content.
CREATE TABLE posts (
    id            BIGSERIAL    PRIMARY KEY,
    slug          VARCHAR(200) NOT NULL UNIQUE,
    title         VARCHAR(240) NOT NULL,
    excerpt       VARCHAR(500),
    content_md    TEXT         NOT NULL,
    tags          VARCHAR(300),
    status        VARCHAR(16)  NOT NULL DEFAULT 'DRAFT',
    published_at  TIMESTAMPTZ,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_posts_status_published_at ON posts (status, published_at);

-- Pageviews: one row per pageview beacon. dwell_ms filled in by a later /dwell beacon.
CREATE TABLE pageviews (
    id           BIGSERIAL    PRIMARY KEY,
    session_id   VARCHAR(64)  NOT NULL,
    path         VARCHAR(512) NOT NULL,
    referrer     VARCHAR(512),
    user_agent   VARCHAR(512),
    country      VARCHAR(2),
    dwell_ms     BIGINT,
    occurred_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pageviews_occurred_at  ON pageviews (occurred_at);
CREATE INDEX idx_pageviews_path         ON pageviews (path);
CREATE INDEX idx_pageviews_session_path ON pageviews (session_id, path);
