package com.helpclub.platform.repository;

import com.helpclub.platform.domain.JobSeekerProfile;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobSeekerProfileRepository extends JpaRepository<JobSeekerProfile, Long> {
    Optional<JobSeekerProfile> findByUserId(Long userId);
}
