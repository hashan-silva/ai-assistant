package com.hashan0314.aiassistant.service;

import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AttributeType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AuthenticationResultType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AuthFlowType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CognitoIdentityProviderException;
import software.amazon.awssdk.services.cognitoidentityprovider.model.InitiateAuthRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.SignUpRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.SignUpResponse;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final String region;
    private final String userPoolClientId;

    public AuthService(@Value("${COGNITO_REGION:}") String region,
                       @Value("${COGNITO_USER_POOL_CLIENT_ID:}") String userPoolClientId) {
        this.region = region;
        this.userPoolClientId = userPoolClientId;
    }

    private CognitoIdentityProviderClient getClient() {
        if (region == null || region.isBlank() || userPoolClientId == null || userPoolClientId.isBlank()) {
            throw new IllegalStateException("Cognito is not configured");
        }
        return CognitoIdentityProviderClient.builder()
            .region(Region.of(region))
            .build();
    }

    public AuthResult login(String identifier, String password, String requestId) {
        log.info("auth.login.start requestId={} identifierLength={}", requestId, identifier.length());
        try {
            AuthenticationResultType result;
            try (CognitoIdentityProviderClient cognitoClient = getClient()) {
                result = cognitoClient.initiateAuth(InitiateAuthRequest.builder()
                    .authFlow(AuthFlowType.USER_PASSWORD_AUTH)
                    .clientId(userPoolClientId)
                    .authParameters(java.util.Map.of(
                        "USERNAME", identifier,
                        "PASSWORD", password
                    ))
                    .build())
                    .authenticationResult();
            }

            if (result == null || result.accessToken() == null || result.accessToken().isBlank()) {
                throw new IllegalArgumentException("No session returned from Cognito");
            }

            log.info("auth.login.success requestId={} hasIdToken={} hasRefreshToken={}",
                requestId, result.idToken() != null, result.refreshToken() != null);
            return new AuthResult(result.accessToken(), result.idToken(), result.refreshToken());
        } catch (CognitoIdentityProviderException ex) {
            log.warn("auth.login.failed requestId={} reason={}", requestId, ex.getMessage());
            throw new IllegalArgumentException(ex.getMessage());
        }
    }

    public void register(RegisterPayload payload, String requestId) {
        log.info("auth.register.start requestId={} hasEmail={} hasPhone={}",
            requestId, payload.email() != null && !payload.email().isBlank(),
            payload.phone() != null && !payload.phone().isBlank());

        List<AttributeType> attributes = new ArrayList<>();
        if (payload.email() != null && !payload.email().isBlank()) {
            attributes.add(AttributeType.builder().name("email").value(payload.email().trim()).build());
        }
        if (payload.phone() != null && !payload.phone().isBlank()) {
            attributes.add(AttributeType.builder().name("phone_number").value(payload.phone().trim()).build());
        }
        attributes.add(AttributeType.builder().name("given_name").value(payload.firstName().trim()).build());
        attributes.add(AttributeType.builder().name("family_name").value(payload.lastName().trim()).build());

        String username = payload.email() != null && !payload.email().isBlank()
            ? payload.email().trim()
            : payload.phone().trim();

        try {
            SignUpResponse response;
            try (CognitoIdentityProviderClient cognitoClient = getClient()) {
                response = cognitoClient.signUp(SignUpRequest.builder()
                    .clientId(userPoolClientId)
                    .username(username)
                    .password(payload.password())
                    .userAttributes(attributes)
                    .build());
            }

            if (response.userSub() == null || response.userSub().isBlank()) {
                throw new IllegalArgumentException("Unable to create account");
            }
            log.info("auth.register.success requestId={}", requestId);
        } catch (CognitoIdentityProviderException ex) {
            log.warn("auth.register.failed requestId={} reason={}", requestId, ex.getMessage());
            throw new IllegalArgumentException(ex.getMessage());
        }
    }

    public record AuthResult(String accessToken, String idToken, String refreshToken) {
    }

    public record RegisterPayload(String email, String phone, String firstName, String lastName, String password) {
    }
}
