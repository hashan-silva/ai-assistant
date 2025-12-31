package com.helpclub.platform.api.dto;

public class JobMatchResponse {

    private Long jobPostId;
    private Long seekerId;
    private Integer score;
    private String rationale;

    public Long getJobPostId() {
        return jobPostId;
    }

    public void setJobPostId(Long jobPostId) {
        this.jobPostId = jobPostId;
    }

    public Long getSeekerId() {
        return seekerId;
    }

    public void setSeekerId(Long seekerId) {
        this.seekerId = seekerId;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getRationale() {
        return rationale;
    }

    public void setRationale(String rationale) {
        this.rationale = rationale;
    }
}
