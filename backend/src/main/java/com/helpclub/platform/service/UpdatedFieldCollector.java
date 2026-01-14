package com.helpclub.platform.service;

import java.util.ArrayList;
import java.util.List;

public final class UpdatedFieldCollector {

    private UpdatedFieldCollector() {
    }

    public static List<String> collect(AiUpdatePayload.Updates updates) {
        List<String> fields = new ArrayList<>();
        if (updates.jobSeekerProfile() != null) {
            fields.add("jobSeekerProfile");
        }
        if (updates.jobPosterProfile() != null) {
            fields.add("jobPosterProfile");
        }
        if (updates.jobPost() != null) {
            fields.add("jobPost");
        }
        if (updates.jobPostInterest() != null) {
            fields.add("jobPostInterest");
        }
        if (updates.jobPostAllocation() != null) {
            fields.add("jobPostAllocation");
        }
        if (updates.jobRating() != null) {
            fields.add("jobRating");
        }
        return fields;
    }
}
