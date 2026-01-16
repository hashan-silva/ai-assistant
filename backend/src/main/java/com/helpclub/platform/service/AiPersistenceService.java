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
        item.put(DynamoDbAttributeNames.JOB_SEEKER_ID, writer.stringValue(profile.jobSeekerId()));
        putOptional(item, DynamoDbAttributeNames.NAME, profile.name());
        putOptional(item, DynamoDbAttributeNames.EMAIL, profile.email());
        putOptional(item, DynamoDbAttributeNames.HEADLINE, profile.headline());
        putOptional(item, DynamoDbAttributeNames.LOCATION, profile.location());
        putOptional(item, DynamoDbAttributeNames.EXPERIENCE_YEARS, profile.experienceYears());
        putOptional(item, DynamoDbAttributeNames.SKILLS, profile.skills());
        item.put(DynamoDbAttributeNames.UPDATED_AT, writer.stringValue(Instant.now().toString()));
        writer.putItem(tableNames.getJobSeekerProfiles(), item);
    }

    private void upsertJobPoster(AiUpdatePayload.JobPosterProfile profile) {
        if (profile == null || profile.jobPosterId() == null || profile.jobPosterId().isBlank()) {
            return;
        }
        Map<String, AttributeValue> item = writer.newItem();
        item.put(DynamoDbAttributeNames.JOB_POSTER_ID, writer.stringValue(profile.jobPosterId()));
        putOptional(item, DynamoDbAttributeNames.COMPANY, profile.company());
        putOptional(item, DynamoDbAttributeNames.CONTACT_NAME, profile.contactName());
        putOptional(item, DynamoDbAttributeNames.CONTACT_EMAIL, profile.contactEmail());
        putOptional(item, DynamoDbAttributeNames.LOCATION, profile.location());
        item.put(DynamoDbAttributeNames.UPDATED_AT, writer.stringValue(Instant.now().toString()));
        writer.putItem(tableNames.getJobPosterProfiles(), item);
    }

    private void upsertJobPost(AiUpdatePayload.JobPost post) {
        if (post == null || post.jobPostId() == null || post.jobPostId().isBlank()) {
            return;
        }
        Map<String, AttributeValue> item = writer.newItem();
        item.put(DynamoDbAttributeNames.JOB_POST_ID, writer.stringValue(post.jobPostId()));
        putOptional(item, DynamoDbAttributeNames.JOB_POSTER_ID, post.jobPosterId());
        putOptional(item, DynamoDbAttributeNames.TITLE, post.title());
        putOptional(item, DynamoDbAttributeNames.DESCRIPTION, post.description());
        putOptional(item, DynamoDbAttributeNames.LOCATION, post.location());
        putOptional(item, DynamoDbAttributeNames.TYPE, post.type());
        putOptional(item, DynamoDbAttributeNames.STATUS, post.status());
        putOptional(item, DynamoDbAttributeNames.SKILLS, post.skills());
        item.put(DynamoDbAttributeNames.UPDATED_AT, writer.stringValue(Instant.now().toString()));
        writer.putItem(tableNames.getJobPosts(), item);
    }

    private void upsertInterest(AiUpdatePayload.JobPostInterest interest) {
        if (interest == null || isBlank(interest.jobPostId()) || isBlank(interest.jobSeekerId())) {
            return;
        }
        Map<String, AttributeValue> item = writer.newItem();
        item.put(DynamoDbAttributeNames.JOB_POST_ID, writer.stringValue(interest.jobPostId()));
        item.put(DynamoDbAttributeNames.JOB_SEEKER_ID, writer.stringValue(interest.jobSeekerId()));
        putOptional(item, DynamoDbAttributeNames.STATUS, interest.status());
        item.put(DynamoDbAttributeNames.CREATED_AT, writer.stringValue(defaultTimestamp(interest.createdAt())));
        writer.putItem(tableNames.getJobPostInterests(), item);
    }

    private void upsertAllocation(AiUpdatePayload.JobPostAllocation allocation) {
        if (allocation == null || isBlank(allocation.jobPostId()) || isBlank(allocation.jobSeekerId())) {
            return;
        }
        Map<String, AttributeValue> item = writer.newItem();
        item.put(DynamoDbAttributeNames.JOB_POST_ID, writer.stringValue(allocation.jobPostId()));
        item.put(DynamoDbAttributeNames.JOB_SEEKER_ID, writer.stringValue(allocation.jobSeekerId()));
        putOptional(item, DynamoDbAttributeNames.JOB_POSTER_ID, allocation.jobPosterId());
        putOptional(item, DynamoDbAttributeNames.STATUS, allocation.status());
        item.put(DynamoDbAttributeNames.ALLOCATED_AT, writer.stringValue(defaultTimestamp(allocation.allocatedAt())));
        writer.putItem(tableNames.getJobPostAllocations(), item);
    }

    private void upsertRating(AiUpdatePayload.JobRating rating) {
        if (rating == null || isBlank(rating.jobPostId()) || isBlank(rating.jobSeekerId())) {
            return;
        }
        Map<String, AttributeValue> item = writer.newItem();
        item.put(DynamoDbAttributeNames.JOB_POST_ID, writer.stringValue(rating.jobPostId()));
        String target = rating.ratingTarget() == null ? "JOB_POST" : rating.ratingTarget();
        item.put(DynamoDbAttributeNames.RATING_KEY, writer.stringValue(rating.jobSeekerId() + "#" + target));
        item.put(DynamoDbAttributeNames.JOB_SEEKER_ID, writer.stringValue(rating.jobSeekerId()));
        putOptional(item, DynamoDbAttributeNames.JOB_POSTER_ID, rating.jobPosterId());
        putOptional(item, DynamoDbAttributeNames.RATING_TARGET, target);
        if (rating.rating() != null) {
            item.put(DynamoDbAttributeNames.RATING, writer.numberValue(rating.rating()));
        }
        putOptional(item, DynamoDbAttributeNames.COMMENTS, rating.comments());
        item.put(DynamoDbAttributeNames.CREATED_AT, writer.stringValue(defaultTimestamp(rating.createdAt())));
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
