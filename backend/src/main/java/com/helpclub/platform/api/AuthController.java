package com.helpclub.platform.api;

import com.helpclub.platform.api.dto.AuthResponse;
import com.helpclub.platform.api.dto.LoginRequest;
import com.helpclub.platform.api.dto.RegisterRequest;
import com.helpclub.platform.api.dto.UserResponse;
import com.helpclub.platform.domain.SessionToken;
import com.helpclub.platform.domain.UserAccount;
import com.helpclub.platform.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@RequestBody RegisterRequest request) {
        if (request.getEmail() == null || request.getPassword() == null || request.getRole() == null) {
            throw new IllegalArgumentException("Email, password, and role are required");
        }
        authService.register(request.getEmail(), request.getPassword(), request.getRole());
        SessionToken session = authService.login(request.getEmail(), request.getPassword());
        return new AuthResponse(session.getToken(), session.getExpiresAt(), request.getRole());
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            throw new IllegalArgumentException("Email and password are required");
        }
        SessionToken session = authService.login(request.getEmail(), request.getPassword());
        return new AuthResponse(session.getToken(), session.getExpiresAt(), session.getUser().getRole());
    }

    @GetMapping("/me")
    public UserResponse me(@RequestAttribute("authUser") UserAccount user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}
