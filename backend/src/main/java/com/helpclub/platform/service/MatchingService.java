package com.helpclub.platform.service;

import com.helpclub.platform.domain.JobPost;
import com.helpclub.platform.domain.JobSeekerProfile;
import com.helpclub.platform.domain.UserRole;
import com.helpclub.platform.repository.JobSeekerProfileRepository;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class MatchingService {

    private final JobSeekerProfileRepository jobSeekerProfileRepository;

    public MatchingService(JobSeekerProfileRepository jobSeekerProfileRepository) {
        this.jobSeekerProfileRepository = jobSeekerProfileRepository;
    }

    public List<MatchResult> computeMatches(JobPost jobPost) {
        Set<String> jobTokens = tokenize(jobPost.getTitle(), jobPost.getSkills(), jobPost.getDescription());

        List<MatchResult> matches = new ArrayList<>();
        for (JobSeekerProfile profile : jobSeekerProfileRepository.findAll()) {
            if (profile.getUser().getRole() != UserRole.JOB_SEEKER) {
                continue;
            }
            Set<String> seekerTokens = tokenize(profile.getSkills(), profile.getHeadline(),
                profile.getExperienceSummary());
            List<String> overlap = seekerTokens.stream()
                .filter(jobTokens::contains)
                .collect(Collectors.toList());
            if (overlap.isEmpty()) {
                continue;
            }
            matches.add(new MatchResult(
                profile.getUser().getId(),
                overlap.size(),
                "Matched skills: " + String.join(", ", overlap)
            ));
        }
        return matches.stream()
            .sorted((a, b) -> b.score().compareTo(a.score()))
            .toList();
    }

    private Set<String> tokenize(String... inputs) {
        Set<String> tokens = new LinkedHashSet<>();
        for (String input : inputs) {
            if (input == null || input.isBlank()) {
                continue;
            }
            String normalized = input.toLowerCase(Locale.ROOT);
            for (String raw : normalized.split("[,;/\\n\\t\\s]+")) {
                String token = raw.trim();
                if (token.length() < 2) {
                    continue;
                }
                tokens.add(token);
            }
        }
        return tokens;
    }

    public record MatchResult(Long seekerId, Integer score, String rationale) {
    }
}
