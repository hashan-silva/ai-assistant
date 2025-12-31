package com.helpclub.platform.api.dto;

import com.helpclub.platform.domain.UserRole;
import java.time.Instant;

public class AuthResponse {

    private String token;
    private Instant expiresAt;
    private UserRole role;

    public AuthResponse() {
    }

    public AuthResponse(String token, Instant expiresAt, UserRole role) {
        this.token = token;
        this.expiresAt = expiresAt;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}
