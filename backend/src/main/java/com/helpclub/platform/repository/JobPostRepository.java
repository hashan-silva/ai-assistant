package com.helpclub.platform.repository;

import com.helpclub.platform.domain.JobPost;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobPostRepository extends JpaRepository<JobPost, Long> {
    List<JobPost> findByPosterIdOrderByCreatedAtDesc(Long posterId);
}
