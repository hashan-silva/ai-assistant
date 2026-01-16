package com.helpclub.platform.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;

@Configuration
public class CognitoConfig {

    @Bean
    public CognitoIdentityProviderClient cognitoIdentityProviderClient(
        @Value("${cognito.region}") String region
    ) {
        return CognitoIdentityProviderClient.builder()
            .region(Region.of(region))
            .build();
    }
}
