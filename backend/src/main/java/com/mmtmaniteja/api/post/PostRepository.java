package com.mmtmaniteja.api.post;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findBySlug(String slug);
    Page<Post> findByStatusOrderByPublishedAtDesc(Post.Status status, Pageable pageable);
    boolean existsBySlug(String slug);
}
