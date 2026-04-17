package com.mmtmaniteja.api.post;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mmtmaniteja.api.post.PostDtos.PostResponse;
import com.mmtmaniteja.api.post.PostDtos.PostSummary;
import com.mmtmaniteja.api.post.PostDtos.PostWriteRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService service;

    public PostController(PostService service) {
        this.service = service;
    }

    /**
     * Public list — published only. Pagination defaults tuned for a personal blog.
     * Shape matches {@code Page<PostSummary>} so the frontend can show "load more".
     */
    @GetMapping
    public ListResponse<PostSummary> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<PostSummary> p = service.listPublished(page, size);
        return ListResponse.from(p);
    }

    /** Admin-only — includes drafts. Protected by {@code SecurityConfig}. */
    @GetMapping("/admin")
    public ListResponse<PostResponse> listAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ListResponse.from(service.listAll(page, size));
    }

    @GetMapping("/{slug}")
    public PostResponse getBySlug(@PathVariable String slug) {
        return service.getPublishedBySlug(slug);
    }

    @PostMapping
    public ResponseEntity<PostResponse> create(@Valid @RequestBody PostWriteRequest body) {
        return ResponseEntity.status(201).body(service.create(body));
    }

    @PutMapping("/{id}")
    public PostResponse update(@PathVariable Long id, @Valid @RequestBody PostWriteRequest body) {
        return service.update(id, body);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    /** Framework-agnostic wire shape so we aren't leaking Spring's Page internals to clients. */
    public record ListResponse<T>(
        List<T> items,
        int page,
        int size,
        long totalElements,
        int totalPages
    ) {
        public static <T> ListResponse<T> from(Page<T> p) {
            return new ListResponse<>(
                p.getContent(),
                p.getNumber(),
                p.getSize(),
                p.getTotalElements(),
                p.getTotalPages()
            );
        }
    }
}
