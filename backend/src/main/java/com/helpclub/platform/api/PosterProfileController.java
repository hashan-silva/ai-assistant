package com.helpclub.platform.api;

import com.helpclub.platform.api.dto.PosterProfileResponse;
import com.helpclub.platform.api.dto.PosterProfileUpdateRequest;
import com.helpclub.platform.domain.JobPosterProfile;
import com.helpclub.platform.domain.UserAccount;
import com.helpclub.platform.service.JobPosterProfileService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/poster-profile")
public class PosterProfileController {

    private final JobPosterProfileService jobPosterProfileService;

    public PosterProfileController(JobPosterProfileService jobPosterProfileService) {
        this.jobPosterProfileService = jobPosterProfileService;
    }

    @GetMapping
    public PosterProfileResponse getProfile(@RequestAttribute("authUser") UserAccount user) {
        JobPosterProfile profile = jobPosterProfileService.getOrCreateProfile(user);
        return toResponse(profile);
    }

    @PatchMapping
    public PosterProfileResponse updateProfile(@RequestAttribute("authUser") UserAccount user,
                                               @RequestBody PosterProfileUpdateRequest request) {
        JobPosterProfile profile = jobPosterProfileService.getOrCreateProfile(user);
        JobPosterProfile updated = jobPosterProfileService.updateProfile(
            profile,
            request.getCompanyName(),
            request.getContactName(),
            request.getContactTitle(),
            request.getLocation()
        );
        return toResponse(updated);
    }

    private PosterProfileResponse toResponse(JobPosterProfile profile) {
        PosterProfileResponse response = new PosterProfileResponse();
        response.setId(profile.getId());
        response.setUserId(profile.getUser().getId());
        response.setCompanyName(profile.getCompanyName());
        response.setContactName(profile.getContactName());
        response.setContactTitle(profile.getContactTitle());
        response.setLocation(profile.getLocation());
        response.setUpdatedAt(profile.getUpdatedAt());
        return response;
    }
}
