package com.helpclub.platform.api;

import com.helpclub.platform.api.dto.ProfileResponse;
import com.helpclub.platform.api.dto.ProfileUpdateRequest;
import com.helpclub.platform.service.CognitoProfileService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private static final String ACCESS_TOKEN_COOKIE = "helpclub_access_token";

    private final CognitoProfileService profileService;

    public ProfileController(CognitoProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<?> getProfile(
        @RequestHeader(value = "Authorization", required = false) String authorization,
        HttpServletRequest request
    ) {
        String token = resolveToken(authorization, request);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Missing access token"));
        }
        ProfileResponse response = profileService.getProfile(token);
        return ResponseEntity.ok(Map.of("profile", response));
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(
        @RequestHeader(value = "Authorization", required = false) String authorization,
        @RequestBody ProfileUpdateRequest requestBody,
        HttpServletRequest request
    ) {
        String token = resolveToken(authorization, request);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Missing access token"));
        }
        ProfileResponse response = profileService.updateProfile(token, requestBody);
        return ResponseEntity.ok(Map.of("profile", response));
    }

    private String resolveToken(String authorization, HttpServletRequest request) {
        if (authorization != null && authorization.startsWith("Bearer ")) {
            return authorization.substring("Bearer ".length()).trim();
        }
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }
        for (Cookie cookie : cookies) {
            if (ACCESS_TOKEN_COOKIE.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
