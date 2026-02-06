package com.hashan0314.aiassistant.api.dto;

public class RegisterResponse {
    private boolean ok;

    public RegisterResponse() {
    }

    public RegisterResponse(boolean ok) {
        this.ok = ok;
    }

    public boolean isOk() {
        return ok;
    }

    public void setOk(boolean ok) {
        this.ok = ok;
    }
}
