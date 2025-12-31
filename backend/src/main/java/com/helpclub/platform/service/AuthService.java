package com.helpclub.platform.service;

import com.helpclub.platform.domain.JobPosterProfile;
import com.helpclub.platform.domain.JobSeekerProfile;
import com.helpclub.platform.domain.SessionToken;
import com.helpclub.platform.domain.UserAccount;
import com.helpclub.platform.domain.UserRole;
import com.helpclub.platform.repository.JobSeekerProfileRepository;
import com.helpclub.platform.repository.JobPosterProfileRepository;
import com.helpclub.platform.repository.SessionTokenRepository;
import com.helpclub.platform.repository.UserAccountRepository;
import java.time.Duration;
import java.time.Instant;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final Duration SESSION_TTL = Duration.ofHours(24);

    private final UserAccountRepository userAccountRepository;
    private final JobSeekerProfileRepository jobSeekerProfileRepository;
    private final JobPosterProfileRepository jobPosterProfileRepository;
    private final SessionTokenRepository sessionTokenRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserAccountRepository userAccountRepository,
                       JobSeekerProfileRepository jobSeekerProfileRepository,
                       JobPosterProfileRepository jobPosterProfileRepository,
                       SessionTokenRepository sessionTokenRepository) {
        this.userAccountRepository = userAccountRepository;
        this.jobSeekerProfileRepository = jobSeekerProfileRepository;
        this.jobPosterProfileRepository = jobPosterProfileRepository;
        this.sessionTokenRepository = sessionTokenRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public UserAccount register(String email, String password, UserRole role) {
        String normalizedEmail = email.toLowerCase(Locale.ROOT).trim();
        if (userAccountRepository.findByEmail(normalizedEmail).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        UserAccount user = new UserAccount();
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole(role);
        user.setCreatedAt(Instant.now());
        UserAccount saved = userAccountRepository.save(user);

        if (role == UserRole.JOB_SEEKER) {
            JobSeekerProfile profile = new JobSeekerProfile();
            profile.setUser(saved);
            profile.setUpdatedAt(Instant.now());
            jobSeekerProfileRepository.save(profile);
        } else if (role == UserRole.JOB_POSTER) {
            JobPosterProfile profile = new JobPosterProfile();
            profile.setUser(saved);
            profile.setUpdatedAt(Instant.now());
            jobPosterProfileRepository.save(profile);
        }

        return saved;
    }

    public SessionToken login(String email, String password) {
        String normalizedEmail = email.toLowerCase(Locale.ROOT).trim();
        UserAccount user = userAccountRepository.findByEmail(normalizedEmail)
            .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        SessionToken token = new SessionToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString().replace("-", ""));
        token.setCreatedAt(Instant.now());
        token.setExpiresAt(Instant.now().plus(SESSION_TTL));
        return sessionTokenRepository.save(token);
    }

    public Optional<UserAccount> authenticate(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }
        return sessionTokenRepository.findByToken(token)
            .filter(session -> session.getExpiresAt().isAfter(Instant.now()))
            .map(SessionToken::getUser);
    }
}
