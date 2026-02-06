package com.hashan0314.aiassistant.api;

import com.hashan0314.aiassistant.api.dto.LoginRequest;
import com.hashan0314.aiassistant.api.dto.LoginResponse;
import com.hashan0314.aiassistant.api.dto.RegisterRequest;
import com.hashan0314.aiassistant.api.dto.RegisterResponse;
import com.hashan0314.aiassistant.service.AuthService;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request,
                               @RequestHeader(value = "X-Request-Id", required = false) String requestIdHeader) {
        String requestId = (requestIdHeader == null || requestIdHeader.isBlank())
            ? UUID.randomUUID().toString()
            : requestIdHeader;

        if (request.getIdentifier() == null || request.getIdentifier().isBlank()
            || request.getPassword() == null || request.getPassword().isBlank()) {
            log.warn("auth.login.invalid requestId={} reason=missing_credentials", requestId);
            throw new IllegalArgumentException("Email or phone number and password are required");
        }

        AuthService.AuthResult result = authService.login(
            request.getIdentifier().trim(),
            request.getPassword(),
            requestId
        );
        return new LoginResponse(result.accessToken(), result.idToken(), result.refreshToken());
    }

    @PostMapping("/register")
    public RegisterResponse register(@RequestBody RegisterRequest request,
                                     @RequestHeader(value = "X-Request-Id", required = false) String requestIdHeader) {
        String requestId = (requestIdHeader == null || requestIdHeader.isBlank())
            ? UUID.randomUUID().toString()
            : requestIdHeader;

        if (request.getPassword() == null || request.getPassword().isBlank()
            || request.getFirstName() == null || request.getFirstName().isBlank()
            || request.getLastName() == null || request.getLastName().isBlank()) {
            log.warn("auth.register.invalid requestId={} reason=missing_required_fields", requestId);
            throw new IllegalArgumentException("Missing required fields");
        }

        if ((request.getEmail() == null || request.getEmail().isBlank())
            && (request.getPhone() == null || request.getPhone().isBlank())) {
            log.warn("auth.register.invalid requestId={} reason=missing_identifier", requestId);
            throw new IllegalArgumentException("Email or phone number is required");
        }

        authService.register(new AuthService.RegisterPayload(
            request.getEmail(),
            request.getPhone(),
            request.getFirstName(),
            request.getLastName(),
            request.getPassword()
        ), requestId);

        return new RegisterResponse(true);
    }
}
