package com.hashan0314.aiassistant.api.dto;

public class LoginResponse {
    private String accessToken;
    private String idToken;
    private String refreshToken;

    public LoginResponse() {
    }

    public LoginResponse(String accessToken, String idToken, String refreshToken) {
        this.accessToken = accessToken;
        this.idToken = idToken;
        this.refreshToken = refreshToken;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
