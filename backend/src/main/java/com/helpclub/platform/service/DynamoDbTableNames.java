package com.helpclub.platform.service;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "dynamodb.tables")
public class DynamoDbTableNames {
    private String jobSeekerProfiles;
    private String jobPosterProfiles;
    private String jobPosts;
    private String jobPostInterests;
    private String jobPostAllocations;
    private String jobRatings;

    public String getJobSeekerProfiles() {
        return jobSeekerProfiles;
    }

    public void setJobSeekerProfiles(String jobSeekerProfiles) {
        this.jobSeekerProfiles = jobSeekerProfiles;
    }

    public String getJobPosterProfiles() {
        return jobPosterProfiles;
    }

    public void setJobPosterProfiles(String jobPosterProfiles) {
        this.jobPosterProfiles = jobPosterProfiles;
    }

    public String getJobPosts() {
        return jobPosts;
    }

    public void setJobPosts(String jobPosts) {
        this.jobPosts = jobPosts;
    }

    public String getJobPostInterests() {
        return jobPostInterests;
    }

    public void setJobPostInterests(String jobPostInterests) {
        this.jobPostInterests = jobPostInterests;
    }

    public String getJobPostAllocations() {
        return jobPostAllocations;
    }

    public void setJobPostAllocations(String jobPostAllocations) {
        this.jobPostAllocations = jobPostAllocations;
    }

    public String getJobRatings() {
        return jobRatings;
    }

    public void setJobRatings(String jobRatings) {
        this.jobRatings = jobRatings;
    }
}
