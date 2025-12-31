package com.helpclub.platform.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.helpclub.platform.domain.JobPost;
import com.helpclub.platform.domain.JobSeekerProfile;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class OllamaClient {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final String model;

    public OllamaClient(@Value("${ollama.base-url}") String baseUrl,
                        @Value("${ollama.model}") String model,
                        ObjectMapper objectMapper) {
        this.webClient = WebClient.builder().baseUrl(baseUrl).build();
        this.model = model;
        this.objectMapper = objectMapper;
    }

    public SeekerLlmResponse generateSeekerResponse(JobSeekerProfile profile, String message) {
        String prompt = """
            You are an AI recruiting assistant.
            Update a job seeker's profile based on the user's message.
            Return only strict JSON with this shape:
            {"reply":"...","updates":{"name":"...","headline":"...","skills":"...","location":"...","experience":"..."}}
            Include only keys in updates that have new values.
            Current profile:
            name=%s
            headline=%s
            skills=%s
            location=%s
            experience=%s
            User message:
            %s
            """.formatted(
                nullToEmpty(profile.getFullName()),
                nullToEmpty(profile.getHeadline()),
                nullToEmpty(profile.getSkills()),
                nullToEmpty(profile.getLocation()),
                nullToEmpty(profile.getExperienceSummary()),
                message
            );
        String raw = generate(prompt);
        return parseSeekerResponse(raw);
    }

    public String generatePosterReply(JobPost jobPost, List<MatchResult> matches) {
        String matchSummary = matches.isEmpty()
            ? "No matches yet."
            : matches.stream()
                .limit(5)
                .map(match -> "Seeker #" + match.seekerId() + " score=" + match.score())
                .collect(Collectors.joining("; "));
        String prompt = """
            You are an AI recruiting assistant for a job poster.
            Provide a concise response about the top matches for this job.
            Job title: %s
            Matches: %s
            """.formatted(jobPost.getTitle(), matchSummary);
        return generate(prompt);
    }

    public List<MatchResult> rankMatches(JobPost jobPost, List<JobSeekerProfile> profiles) {
        List<SeekerSummary> seekers = profiles.stream()
            .filter(profile -> profile.getUser() != null)
            .map(profile -> new SeekerSummary(
                profile.getUser().getId(),
                profile.getFullName(),
                profile.getHeadline(),
                profile.getSkills(),
                profile.getLocation(),
                profile.getExperienceSummary()
            ))
            .collect(Collectors.toList());
        if (seekers.isEmpty()) {
            return List.of();
        }
        String seekersJson;
        try {
            seekersJson = objectMapper.writeValueAsString(seekers);
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to serialize seekers", ex);
        }
        String prompt = """
            You are an AI recruiter. Score job seekers for the job below.
            Return only strict JSON array of objects with fields:
            [{"seekerId":1,"score":0-100,"rationale":"short reason"}]
            Only include seekers that are a reasonable match.
            Job:
            title=%s
            description=%s
            skills=%s
            location=%s
            Seekers JSON:
            %s
            """.formatted(
                nullToEmpty(jobPost.getTitle()),
                nullToEmpty(jobPost.getDescription()),
                nullToEmpty(jobPost.getSkills()),
                nullToEmpty(jobPost.getLocation()),
                seekersJson
            );
        String raw = generate(prompt);
        return parseMatchResults(raw);
    }

    private String generate(String prompt) {
        OllamaRequest request = new OllamaRequest(model, prompt, false);
        OllamaResponse response = webClient.post()
            .uri("/api/generate")
            .bodyValue(request)
            .retrieve()
            .bodyToMono(OllamaResponse.class)
            .block();
        if (response == null || response.response() == null || response.response().isBlank()) {
            throw new IllegalStateException("Empty response from LLM");
        }
        return response.response().trim();
    }

    private SeekerLlmResponse parseSeekerResponse(String raw) {
        String json = extractJson(raw);
        try {
            return objectMapper.readValue(json, SeekerLlmResponse.class);
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to parse LLM response", ex);
        }
    }

    private List<MatchResult> parseMatchResults(String raw) {
        String json = extractJson(raw);
        try {
            List<MatchResultPayload> payload = objectMapper.readValue(
                json,
                objectMapper.getTypeFactory().constructCollectionType(List.class, MatchResultPayload.class)
            );
            if (payload == null) {
                return List.of();
            }
            return payload.stream()
                .filter(item -> item.seekerId() != null && item.score() != null)
                .map(item -> new MatchResult(
                    item.seekerId(),
                    item.score(),
                    item.rationale() == null ? "" : item.rationale()
                ))
                .toList();
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to parse match results", ex);
        }
    }

    private String extractJson(String raw) {
        int start = raw.indexOf('{');
        int end = raw.lastIndexOf('}');
        if (start >= 0 && end > start) {
            return raw.substring(start, end + 1);
        }
        int arrayStart = raw.indexOf('[');
        int arrayEnd = raw.lastIndexOf(']');
        if (arrayStart >= 0 && arrayEnd > arrayStart) {
            return raw.substring(arrayStart, arrayEnd + 1);
        }
        return raw.trim();
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value;
    }

    private record OllamaRequest(String model, String prompt, boolean stream) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record OllamaResponse(String response) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record SeekerLlmResponse(String reply, Map<String, String> updates) {
    }

    private record SeekerSummary(Long seekerId, String name, String headline, String skills,
                                 String location, String experience) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record MatchResultPayload(Long seekerId, Integer score, String rationale) {
    }
}
