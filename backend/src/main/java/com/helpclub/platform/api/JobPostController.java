package com.helpclub.platform.api;

import com.helpclub.platform.api.dto.JobMatchResponse;
import com.helpclub.platform.api.dto.JobPostRequest;
import com.helpclub.platform.api.dto.JobPostResponse;
import com.helpclub.platform.domain.JobPost;
import com.helpclub.platform.domain.UserAccount;
import com.helpclub.platform.service.JobPostService;
import com.helpclub.platform.service.MatchResult;
import com.helpclub.platform.service.MatchingService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/jobs")
public class JobPostController {

    private final JobPostService jobPostService;
    private final MatchingService matchingService;

    public JobPostController(JobPostService jobPostService, MatchingService matchingService) {
        this.jobPostService = jobPostService;
        this.matchingService = matchingService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobPostResponse createJob(@RequestAttribute("authUser") UserAccount user,
                                     @RequestBody JobPostRequest request) {
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new IllegalArgumentException("Job title is required");
        }
        JobPost jobPost = jobPostService.createJobPost(
            user,
            request.getTitle(),
            request.getDescription(),
            request.getLocation(),
            request.getSkills()
        );
        return toResponse(jobPost);
    }

    @GetMapping
    public List<JobPostResponse> listJobs(@RequestAttribute("authUser") UserAccount user) {
        return jobPostService.listByPoster(user).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    @PostMapping("/{jobId}/matches/refresh")
    public List<JobMatchResponse> refreshMatches(@RequestAttribute("authUser") UserAccount user,
                                                 @PathVariable Long jobId) {
        JobPost jobPost = jobPostService.getJobPost(jobId);
        if (!jobPost.getPoster().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Not authorized for this job post");
        }
        return matchingService.computeMatches(jobPost).stream()
            .map(match -> toMatchResponse(jobPost.getId(), match))
            .collect(Collectors.toList());
    }

    @GetMapping("/{jobId}/matches")
    public List<JobMatchResponse> listMatches(@RequestAttribute("authUser") UserAccount user,
                                              @PathVariable Long jobId) {
        JobPost jobPost = jobPostService.getJobPost(jobId);
        if (!jobPost.getPoster().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Not authorized for this job post");
        }
        return matchingService.computeMatches(jobPost).stream()
            .map(match -> toMatchResponse(jobPost.getId(), match))
            .collect(Collectors.toList());
    }

    private JobPostResponse toResponse(JobPost jobPost) {
        JobPostResponse response = new JobPostResponse();
        response.setId(jobPost.getId());
        response.setTitle(jobPost.getTitle());
        response.setDescription(jobPost.getDescription());
        response.setLocation(jobPost.getLocation());
        response.setSkills(jobPost.getSkills());
        response.setStatus(jobPost.getStatus().name());
        response.setCreatedAt(jobPost.getCreatedAt());
        return response;
    }

    private JobMatchResponse toMatchResponse(Long jobPostId, MatchResult match) {
        JobMatchResponse response = new JobMatchResponse();
        response.setJobPostId(jobPostId);
        response.setSeekerId(match.seekerId());
        response.setScore(match.score());
        response.setRationale(match.rationale());
        return response;
    }
}
