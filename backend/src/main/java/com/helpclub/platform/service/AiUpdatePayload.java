package com.helpclub.platform.service;

import java.util.List;

public record AiUpdatePayload(String reply, Updates updates) {

    public record Updates(JobPost jobPost,
                          JobSeekerProfile jobSeekerProfile,
                          JobPosterProfile jobPosterProfile,
                          JobPostInterest jobPostInterest,
                          JobPostAllocation jobPostAllocation,
                          JobRating jobRating) {
    }

    public record JobPost(String jobPostId,
                          String jobPosterId,
                          String title,
                          String description,
                          String location,
                          String type,
                          List<String> skills,
                          String status) {
    }

    public record JobSeekerProfile(String jobSeekerId,
                                   String name,
                                   String email,
                                   String headline,
                                   List<String> skills,
                                   String location,
                                   Integer experienceYears) {
    }

    public record JobPosterProfile(String jobPosterId,
                                   String company,
                                   String contactName,
                                   String contactEmail,
                                   String location) {
    }

    public record JobPostInterest(String jobPostId,
                                 String jobSeekerId,
                                 String status,
                                 String createdAt) {
    }

    public record JobPostAllocation(String jobPostId,
                                    String jobSeekerId,
                                    String jobPosterId,
                                    String status,
                                    String allocatedAt) {
    }

    public record JobRating(String jobPostId,
                            String jobSeekerId,
                            String jobPosterId,
                            String ratingTarget,
                            Double rating,
                            String comments,
                            String createdAt) {
    }
}
