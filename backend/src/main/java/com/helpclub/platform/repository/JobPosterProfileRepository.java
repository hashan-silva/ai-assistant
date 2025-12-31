package com.helpclub.platform.repository;

import com.helpclub.platform.domain.JobPosterProfile;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobPosterProfileRepository extends JpaRepository<JobPosterProfile, Long> {
    Optional<JobPosterProfile> findByUserId(Long userId);
}
