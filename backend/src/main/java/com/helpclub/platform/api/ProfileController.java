package com.helpclub.platform.api;

import com.helpclub.platform.api.dto.ProfileResponse;
import com.helpclub.platform.api.dto.ProfileUpdateRequest;
import com.helpclub.platform.domain.JobSeekerProfile;
import com.helpclub.platform.domain.UserAccount;
import com.helpclub.platform.service.ProfileService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ProfileResponse getProfile(@RequestAttribute("authUser") UserAccount user) {
        JobSeekerProfile profile = profileService.getOrCreateProfile(user);
        return toResponse(profile);
    }

    @PatchMapping
    public ProfileResponse updateProfile(@RequestAttribute("authUser") UserAccount user,
                                         @RequestBody ProfileUpdateRequest request) {
        JobSeekerProfile profile = profileService.getOrCreateProfile(user);
        JobSeekerProfile updated = profileService.updateProfile(
            profile,
            request.getFullName(),
            request.getHeadline(),
            request.getSkills(),
            request.getLocation(),
            request.getExperienceSummary()
        );
        return toResponse(updated);
    }

    private ProfileResponse toResponse(JobSeekerProfile profile) {
        ProfileResponse response = new ProfileResponse();
        response.setId(profile.getId());
        response.setUserId(profile.getUser().getId());
        response.setFullName(profile.getFullName());
        response.setHeadline(profile.getHeadline());
        response.setSkills(profile.getSkills());
        response.setLocation(profile.getLocation());
        response.setExperienceSummary(profile.getExperienceSummary());
        response.setUpdatedAt(profile.getUpdatedAt());
        return response;
    }
}
