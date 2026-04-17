package com.mmtmaniteja.api.post;

import java.time.Instant;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mmtmaniteja.api.common.NotFoundException;
import com.mmtmaniteja.api.post.PostDtos.PostResponse;
import com.mmtmaniteja.api.post.PostDtos.PostSummary;
import com.mmtmaniteja.api.post.PostDtos.PostWriteRequest;

@Service
public class PostService {

    private final PostRepository repo;

    public PostService(PostRepository repo) {
        this.repo = repo;
    }

    @Transactional(readOnly = true)
    public Page<PostSummary> listPublished(int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 50));
        return repo.findByStatusOrderByPublishedAtDesc(Post.Status.PUBLISHED, pageable)
                .map(PostSummary::from);
    }

    @Transactional(readOnly = true)
    public PostResponse getPublishedBySlug(String slug) {
        Post p = repo.findBySlug(slug)
                .filter(x -> x.getStatus() == Post.Status.PUBLISHED)
                .orElseThrow(() -> new NotFoundException("Post not found: " + slug));
        return PostResponse.from(p);
    }

    /* ----- admin ----- */

    @Transactional(readOnly = true)
    public Page<PostResponse> listAll(int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 100));
        return repo.findAll(pageable).map(PostResponse::from);
    }

    @Transactional
    public PostResponse create(PostWriteRequest req) {
        if (repo.existsBySlug(req.slug())) {
            throw new IllegalArgumentException("Slug already exists: " + req.slug());
        }
        Post p = new Post();
        applyWrite(p, req);
        return PostResponse.from(repo.save(p));
    }

    @Transactional
    public PostResponse update(Long id, PostWriteRequest req) {
        Post p = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Post not found: " + id));
        // Slug uniqueness check only on change
        if (!p.getSlug().equals(req.slug()) && repo.existsBySlug(req.slug())) {
            throw new IllegalArgumentException("Slug already exists: " + req.slug());
        }
        applyWrite(p, req);
        return PostResponse.from(p);
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new NotFoundException("Post not found: " + id);
        }
        repo.deleteById(id);
    }

    private void applyWrite(Post p, PostWriteRequest req) {
        Post.Status newStatus = req.status() == null ? Post.Status.DRAFT : Post.Status.valueOf(req.status());
        // First transition to PUBLISHED stamps publishedAt.
        if (newStatus == Post.Status.PUBLISHED && p.getPublishedAt() == null) {
            p.setPublishedAt(Instant.now());
        }
        p.setSlug(req.slug());
        p.setTitle(req.title());
        p.setExcerpt(req.excerpt());
        p.setContentMd(req.contentMd());
        p.setTags(req.tags());
        p.setStatus(newStatus);
    }
}
