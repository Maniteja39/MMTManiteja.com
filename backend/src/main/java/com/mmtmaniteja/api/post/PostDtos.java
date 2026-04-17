package com.mmtmaniteja.api.post;

import java.time.Instant;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Simple container for post-related DTOs. Keeps the {@code post} package flat and readable.
 */
public final class PostDtos {

    private PostDtos() {}

    /** Full response — includes markdown body. Used for single-post fetches and admin views. */
    public record PostResponse(
        Long id,
        String slug,
        String title,
        String excerpt,
        String contentMd,
        String tags,
        String status,
        Instant publishedAt,
        Instant createdAt,
        Instant updatedAt
    ) {
        public static PostResponse from(Post p) {
            return new PostResponse(
                p.getId(), p.getSlug(), p.getTitle(), p.getExcerpt(),
                p.getContentMd(), p.getTags(), p.getStatus().name(),
                p.getPublishedAt(), p.getCreatedAt(), p.getUpdatedAt()
            );
        }
    }

    /** Compact response for the list view — no body, no draft content. */
    public record PostSummary(
        Long id,
        String slug,
        String title,
        String excerpt,
        String tags,
        Instant publishedAt
    ) {
        public static PostSummary from(Post p) {
            return new PostSummary(
                p.getId(), p.getSlug(), p.getTitle(), p.getExcerpt(),
                p.getTags(), p.getPublishedAt()
            );
        }
    }

    /** Shared shape for create and update. Slug is mutable on purpose — permalinks before publish. */
    public record PostWriteRequest(
        @NotBlank @Size(max = 200)
        @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$",
                 message = "slug must be kebab-case, lowercase alphanumerics and hyphens")
        String slug,

        @NotBlank @Size(max = 240) String title,
        @Size(max = 500) String excerpt,
        // Cap at ~200KB of markdown — several novels worth of blog post, small
        // enough that a malicious client can't balloon the DB with one POST.
        @NotBlank @Size(max = 200_000) String contentMd,
        @Size(max = 300) String tags,

        @Pattern(regexp = "^(DRAFT|PUBLISHED)$", message = "status must be DRAFT or PUBLISHED")
        String status
    ) {}
}
