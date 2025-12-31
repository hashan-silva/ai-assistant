package com.helpclub.platform.service;

import com.helpclub.platform.domain.JobSeekerProfile;
import com.helpclub.platform.domain.UserAccount;
import com.helpclub.platform.domain.UserRole;
import com.helpclub.platform.repository.JobSeekerProfileRepository;
import java.time.Instant;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    private final JobSeekerProfileRepository jobSeekerProfileRepository;

    public ProfileService(JobSeekerProfileRepository jobSeekerProfileRepository) {
        this.jobSeekerProfileRepository = jobSeekerProfileRepository;
    }

    public JobSeekerProfile getOrCreateProfile(UserAccount user) {
        if (user.getRole() != UserRole.JOB_SEEKER) {
            throw new IllegalStateException("Only job seekers have profiles");
        }
        return jobSeekerProfileRepository.findByUserId(user.getId())
            .orElseGet(() -> {
                JobSeekerProfile profile = new JobSeekerProfile();
                profile.setUser(user);
                profile.setUpdatedAt(Instant.now());
                return jobSeekerProfileRepository.save(profile);
            });
    }

    public JobSeekerProfile updateProfile(JobSeekerProfile profile, String fullName, String headline,
                                          String skills, String location, String experienceSummary) {
        if (fullName != null) {
            profile.setFullName(fullName);
        }
        if (headline != null) {
            profile.setHeadline(headline);
        }
        if (skills != null) {
            profile.setSkills(skills);
        }
        if (location != null) {
            profile.setLocation(location);
        }
        if (experienceSummary != null) {
            profile.setExperienceSummary(experienceSummary);
        }
        profile.setUpdatedAt(Instant.now());
        return jobSeekerProfileRepository.save(profile);
    }
}
