package com.helpclub.platform.service;

import com.helpclub.platform.domain.JobPosterProfile;
import com.helpclub.platform.domain.UserAccount;
import com.helpclub.platform.domain.UserRole;
import com.helpclub.platform.repository.JobPosterProfileRepository;
import java.time.Instant;
import org.springframework.stereotype.Service;

@Service
public class JobPosterProfileService {

    private final JobPosterProfileRepository jobPosterProfileRepository;

    public JobPosterProfileService(JobPosterProfileRepository jobPosterProfileRepository) {
        this.jobPosterProfileRepository = jobPosterProfileRepository;
    }

    public JobPosterProfile getOrCreateProfile(UserAccount user) {
        if (user.getRole() != UserRole.JOB_POSTER) {
            throw new IllegalStateException("Only job posters have company profiles");
        }
        return jobPosterProfileRepository.findByUserId(user.getId())
            .orElseGet(() -> {
                JobPosterProfile profile = new JobPosterProfile();
                profile.setUser(user);
                profile.setUpdatedAt(Instant.now());
                return jobPosterProfileRepository.save(profile);
            });
    }

    public JobPosterProfile updateProfile(JobPosterProfile profile, String companyName,
                                          String contactName, String contactTitle,
                                          String location) {
        if (companyName != null) {
            profile.setCompanyName(companyName);
        }
        if (contactName != null) {
            profile.setContactName(contactName);
        }
        if (contactTitle != null) {
            profile.setContactTitle(contactTitle);
        }
        if (location != null) {
            profile.setLocation(location);
        }
        profile.setUpdatedAt(Instant.now());
        return jobPosterProfileRepository.save(profile);
    }
}
