package com.helpclub.platform.service;

import java.time.Instant;
import java.util.Map;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;

@Service
public class AiPersistenceService {

    private final DynamoDbWriter writer;
    private final DynamoDbTableNames tableNames;

    public AiPersistenceService(DynamoDbWriter writer, DynamoDbTableNames tableNames) {
        this.writer = writer;
        this.tableNames = tableNames;
    }

    public void persist(AiUpdatePayload.Updates updates) {
        if (updates == null) {
            return;
        }
        upsertJobSeeker(updates.jobSeekerProfile());
        upsertJobPoster(updates.jobPosterProfile());
        upsertJobPost(updates.jobPost());
        upsertInterest(updates.jobPostInterest());
        upsertAllocation(updates.jobPostAllocation());
        upsertRating(updates.jobRating());
    }

    private void upsertJobSeeker(AiUpdatePayload.JobSeekerProfile profile) {
        if (profile == null || profile.jobSeekerId() == null || profile.jobSeekerId().isBlank()) {
            return;
        }
        Map<String, AttributeValue> item = writer.newItem();
        item.put("job_seeker_id", writer.stringValue(profile.jobSeekerId()));
        putOptional(item, "name", profile.name());
        putOptional(item, "email", profile.email());
        putOptional(item, "headline", profile.headline());
        putOptional(item, "location", profile.location());
        putOptional(item, "experience_years", profile.experienceYears());
        putOptional(item, "skills", profile.skills());
        item.put("updated_at", writer.stringValue(Instant.now().toString()));
        writer.putItem(tableNames.getJobSeekerProfiles(), item);
    }

    private void upsertJobPoster(AiUpdatePayload.JobPosterProfile profile) {
        if (profile == null || profile.jobPosterId() == null || profile.jobPosterId().isBlank()) {
            return;
        }
        Map<String, AttributeValue> item = writer.newItem();
        item.put("job_poster_id", writer.stringValue(profile.jobPosterId()));
        putOptional(item, "company", profile.company());
        putOptional(item, "contact_name", profile.contactName());
        putOptional(item, "contact_email", profile.contactEmail());
        putOptional(item, "location", profile.location());
        item.put("updated_at", writer.stringValue(Instant.now().toString()));
        writer.putItem(tableNames.getJobPosterProfiles(), item);
    }

    private void upsertJobPost(AiUpdatePayload.JobPost post) {
        if (post == null || post.jobPostId() == null || post.jobPostId().isBlank()) {
            return;
        }
        Map<String, AttributeValue> item = writer.newItem();
        item.put("job_post_id", writer.stringValue(post.jobPostId()));
        putOptional(item, "job_poster_id", post.jobPosterId());
        putOptional(item, "title", post.title());
        putOptional(item, "description", post.description());
        putOptional(item, "location", post.location());
        putOptional(item, "type", post.type());
        putOptional(item, "status", post.status());
        putOptional(item, "skills", post.skills());
        item.put("updated_at", writer.stringValue(Instant.now().toString()));
        writer.putItem(tableNames.getJobPosts(), item);
    }

    private void upsertInterest(AiUpdatePayload.JobPostInterest interest) {
        if (interest == null || isBlank(interest.jobPostId()) || isBlank(interest.jobSeekerId())) {
            return;
        }
        Map<String, AttributeValue> item = writer.newItem();
        item.put("job_post_id", writer.stringValue(interest.jobPostId()));
        item.put("job_seeker_id", writer.stringValue(interest.jobSeekerId()));
        putOptional(item, "status", interest.status());
        item.put("created_at", writer.stringValue(defaultTimestamp(interest.createdAt())));
        writer.putItem(tableNames.getJobPostInterests(), item);
    }

    private void upsertAllocation(AiUpdatePayload.JobPostAllocation allocation) {
        if (allocation == null || isBlank(allocation.jobPostId()) || isBlank(allocation.jobSeekerId())) {
            return;
        }
        Map<String, AttributeValue> item = writer.newItem();
        item.put("job_post_id", writer.stringValue(allocation.jobPostId()));
        item.put("job_seeker_id", writer.stringValue(allocation.jobSeekerId()));
        putOptional(item, "job_poster_id", allocation.jobPosterId());
        putOptional(item, "status", allocation.status());
        item.put("allocated_at", writer.stringValue(defaultTimestamp(allocation.allocatedAt())));
        writer.putItem(tableNames.getJobPostAllocations(), item);
    }

    private void upsertRating(AiUpdatePayload.JobRating rating) {
        if (rating == null || isBlank(rating.jobPostId()) || isBlank(rating.jobSeekerId())) {
            return;
        }
        Map<String, AttributeValue> item = writer.newItem();
        item.put("job_post_id", writer.stringValue(rating.jobPostId()));
        String target = rating.ratingTarget() == null ? "JOB_POST" : rating.ratingTarget();
        item.put("rating_key", writer.stringValue(rating.jobSeekerId() + "#" + target));
        item.put("job_seeker_id", writer.stringValue(rating.jobSeekerId()));
        putOptional(item, "job_poster_id", rating.jobPosterId());
        putOptional(item, "rating_target", target);
        if (rating.rating() != null) {
            item.put("rating", writer.numberValue(rating.rating()));
        }
        putOptional(item, "comments", rating.comments());
        item.put("created_at", writer.stringValue(defaultTimestamp(rating.createdAt())));
        writer.putItem(tableNames.getJobRatings(), item);
    }

    private void putOptional(Map<String, AttributeValue> item, String key, String value) {
        if (value == null || value.isBlank()) {
            return;
        }
        item.put(key, writer.stringValue(value));
    }

    private void putOptional(Map<String, AttributeValue> item, String key, Number value) {
        if (value == null) {
            return;
        }
        item.put(key, writer.numberValue(value));
    }

    private void putOptional(Map<String, AttributeValue> item, String key, java.util.List<String> value) {
        AttributeValue list = writer.listValue(value);
        if (list != null) {
            item.put(key, list);
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private String defaultTimestamp(String value) {
        return isBlank(value) ? Instant.now().toString() : value;
    }
}
