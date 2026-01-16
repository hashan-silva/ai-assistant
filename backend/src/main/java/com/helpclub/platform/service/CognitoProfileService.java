package com.helpclub.platform.service;

import com.helpclub.platform.api.dto.ProfileResponse;
import com.helpclub.platform.api.dto.ProfileUpdateRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AttributeType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.GetUserResponse;
import software.amazon.awssdk.services.cognitoidentityprovider.model.UpdateUserAttributesRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.GetUserRequest;

@Service
public class CognitoProfileService {

    private final CognitoIdentityProviderClient cognitoClient;

    public CognitoProfileService(CognitoIdentityProviderClient cognitoClient) {
        this.cognitoClient = cognitoClient;
    }

    public ProfileResponse getProfile(String accessToken) {
        GetUserResponse user = cognitoClient.getUser(GetUserRequest.builder()
            .accessToken(accessToken)
            .build());

        Map<String, String> attributes = toAttributeMap(user.userAttributes());

        return new ProfileResponse(
            user.username(),
            attributes.getOrDefault("email", ""),
            attributes.getOrDefault("phone_number", ""),
            attributes.getOrDefault("given_name", ""),
            attributes.getOrDefault("family_name", ""),
            attributes.getOrDefault("address", ""),
            attributes.getOrDefault("custom:profile_type", "")
        );
    }

    public ProfileResponse updateProfile(String accessToken, ProfileUpdateRequest request) {
        List<AttributeType> updates = buildUpdates(request);
        if (updates.isEmpty()) {
            throw new IllegalArgumentException("No profile updates provided");
        }

        cognitoClient.updateUserAttributes(UpdateUserAttributesRequest.builder()
            .accessToken(accessToken)
            .userAttributes(updates)
            .build());

        return getProfile(accessToken);
    }

    private List<AttributeType> buildUpdates(ProfileUpdateRequest request) {
        List<AttributeType> updates = new java.util.ArrayList<>();
        addAttribute(updates, "email", request.getEmail());
        addAttribute(updates, "phone_number", request.getPhone());
        addAttribute(updates, "given_name", request.getFirstName());
        addAttribute(updates, "family_name", request.getLastName());
        addAttribute(updates, "address", request.getCity());
        addAttribute(updates, "custom:profile_type", request.getProfileType());
        return updates;
    }

    private void addAttribute(List<AttributeType> updates, String name, String value) {
        if (value == null) {
            return;
        }
        String trimmed = value.trim();
        if (trimmed.isBlank()) {
            return;
        }
        updates.add(AttributeType.builder()
            .name(name)
            .value(trimmed)
            .build());
    }

    private Map<String, String> toAttributeMap(List<AttributeType> attributes) {
        Map<String, String> mapped = new HashMap<>();
        if (attributes == null) {
            return mapped;
        }
        for (AttributeType attribute : attributes) {
            if (attribute.name() != null && attribute.value() != null) {
                mapped.put(attribute.name(), attribute.value());
            }
        }
        return mapped;
    }
}
