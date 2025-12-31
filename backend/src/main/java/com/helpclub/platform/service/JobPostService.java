package com.helpclub.platform.service;

import com.helpclub.platform.domain.JobPost;
import com.helpclub.platform.domain.JobPostStatus;
import com.helpclub.platform.domain.UserAccount;
import com.helpclub.platform.domain.UserRole;
import com.helpclub.platform.repository.JobPostRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class JobPostService {

    private final JobPostRepository jobPostRepository;

    public JobPostService(JobPostRepository jobPostRepository) {
        this.jobPostRepository = jobPostRepository;
    }

    public JobPost createJobPost(UserAccount poster, String title, String description,
                                 String location, String skills) {
        if (poster.getRole() != UserRole.JOB_POSTER) {
            throw new IllegalStateException("Only job posters can create job posts");
        }
        JobPost jobPost = new JobPost();
        jobPost.setPoster(poster);
        jobPost.setTitle(title);
        jobPost.setDescription(description);
        jobPost.setLocation(location);
        jobPost.setSkills(skills);
        jobPost.setStatus(JobPostStatus.OPEN);
        jobPost.setCreatedAt(Instant.now());
        return jobPostRepository.save(jobPost);
    }

    public List<JobPost> listByPoster(UserAccount poster) {
        return jobPostRepository.findByPosterIdOrderByCreatedAtDesc(poster.getId());
    }

    public JobPost getJobPost(Long id) {
        return jobPostRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Job post not found"));
    }
}
