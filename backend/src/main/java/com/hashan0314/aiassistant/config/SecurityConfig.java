package com.hashan0314.aiassistant.config;

import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/health", "/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder(@Value("${COGNITO_REGION:}") String region,
                                 @Value("${COGNITO_USER_POOL_ID:}") String userPoolId,
                                 @Value("${COGNITO_USER_POOL_CLIENT_ID:}") String clientId) {
        if (region == null || region.isBlank()
            || userPoolId == null || userPoolId.isBlank()
            || clientId == null || clientId.isBlank()) {
            throw new IllegalStateException("Cognito JWT validation is not configured");
        }

        String issuer = "https://cognito-idp." + region + ".amazonaws.com/" + userPoolId;
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withIssuerLocation(issuer).build();

        OAuth2TokenValidator<Jwt> issuerValidator = JwtValidators.createDefaultWithIssuer(issuer);
        OAuth2TokenValidator<Jwt> clientValidator = jwt -> {
            Object clientClaim = jwt.getClaim("client_id");
            if (clientId.equals(clientClaim)) {
                return OAuth2TokenValidatorResult.success();
            }

            List<String> audience = jwt.getAudience();
            if (audience != null && audience.contains(clientId)) {
                return OAuth2TokenValidatorResult.success();
            }

            return OAuth2TokenValidatorResult.failure(
                new OAuth2Error("invalid_token", "Token was not issued for configured client", null)
            );
        };

        decoder.setJwtValidator(jwt -> {
            OAuth2TokenValidatorResult issuerResult = issuerValidator.validate(jwt);
            if (issuerResult.hasErrors()) {
                return issuerResult;
            }
            return clientValidator.validate(jwt);
        });

        return decoder;
    }
}
