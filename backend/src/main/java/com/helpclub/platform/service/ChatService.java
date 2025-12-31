package com.helpclub.platform.service;

import com.helpclub.platform.domain.ChatMessage;
import com.helpclub.platform.domain.ChatSender;
import com.helpclub.platform.domain.JobPost;
import com.helpclub.platform.domain.JobSeekerProfile;
import com.helpclub.platform.domain.UserAccount;
import com.helpclub.platform.domain.UserRole;
import com.helpclub.platform.repository.ChatMessageRepository;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final ProfileService profileService;
    private final JobPostService jobPostService;
    private final MatchingService matchingService;
    private final OllamaClient ollamaClient;

    public ChatService(ChatMessageRepository chatMessageRepository,
                       ProfileService profileService,
                       JobPostService jobPostService,
                       MatchingService matchingService,
                       OllamaClient ollamaClient) {
        this.chatMessageRepository = chatMessageRepository;
        this.profileService = profileService;
        this.jobPostService = jobPostService;
        this.matchingService = matchingService;
        this.ollamaClient = ollamaClient;
    }

    public ChatResult handleMessage(UserAccount user, String message) {
        saveMessage(user, ChatSender.USER, message);

        if (user.getRole() == UserRole.JOB_SEEKER) {
            return handleSeekerMessage(user, message);
        }
        return handlePosterMessage(user);
    }

    private ChatResult handleSeekerMessage(UserAccount user, String message) {
        JobSeekerProfile profile = profileService.getOrCreateProfile(user);
        try {
            OllamaClient.SeekerLlmResponse llmResponse = ollamaClient.generateSeekerResponse(profile, message);
            Map<String, String> updates = llmResponse.updates() == null ? Map.of() : llmResponse.updates();
            if (!updates.isEmpty()) {
                profileService.updateProfile(
                    profile,
                    updates.get("name"),
                    updates.get("headline"),
                    updates.get("skills"),
                    updates.get("location"),
                    updates.get("experience")
                );
            }
            String reply = llmResponse.reply() == null || llmResponse.reply().isBlank()
                ? buildSeekerFallbackReply(updates)
                : llmResponse.reply();
            saveMessage(user, ChatSender.AI, reply);
            return new ChatResult(reply, updates.keySet().stream().toList(), List.of());
        } catch (RuntimeException ex) {
            return handleSeekerFallback(user, message);
        }
    }

    private ChatResult handlePosterMessage(UserAccount user) {
        List<JobPost> posts = jobPostService.listByPoster(user);
        if (posts.isEmpty()) {
            String reply = "Create a job post first, then ask me to find matches.";
            saveMessage(user, ChatSender.AI, reply);
            return new ChatResult(reply, List.of(), List.of());
        }
        JobPost latest = posts.get(0);
        List<MatchResult> matches = matchingService.computeMatches(latest);
        List<String> topMatches = buildTopMatches(matches);
        String reply;
        try {
            reply = ollamaClient.generatePosterReply(latest, matches);
        } catch (RuntimeException ex) {
            reply = buildPosterFallbackReply(latest, topMatches);
        }
        saveMessage(user, ChatSender.AI, reply);
        return new ChatResult(reply, List.of(), topMatches);
    }

    private void saveMessage(UserAccount user, ChatSender sender, String message) {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setUser(user);
        chatMessage.setSender(sender);
        chatMessage.setMessage(message);
        chatMessage.setCreatedAt(Instant.now());
        chatMessageRepository.save(chatMessage);
    }

    private Map<String, String> parseKeyValueUpdates(String message) {
        Map<String, String> updates = new LinkedHashMap<>();
        for (String line : message.split("\\r?\\n")) {
            String trimmed = line.trim();
            int colon = trimmed.indexOf(':');
            if (colon <= 0) {
                continue;
            }
            String key = trimmed.substring(0, colon).trim().toLowerCase(Locale.ROOT);
            String value = trimmed.substring(colon + 1).trim();
            if (value.isEmpty()) {
                continue;
            }
            switch (key) {
                case "name" -> updates.put("name", value);
                case "headline" -> updates.put("headline", value);
                case "skills" -> updates.put("skills", value);
                case "location" -> updates.put("location", value);
                case "experience" -> updates.put("experience", value);
                default -> {
                }
            }
        }
        return updates;
    }

    private ChatResult handleSeekerFallback(UserAccount user, String message) {
        Map<String, String> updates = parseKeyValueUpdates(message);
        if (!updates.isEmpty()) {
            JobSeekerProfile profile = profileService.getOrCreateProfile(user);
            profileService.updateProfile(
                profile,
                updates.get("name"),
                updates.get("headline"),
                updates.get("skills"),
                updates.get("location"),
                updates.get("experience")
            );
        }
        String reply = buildSeekerFallbackReply(updates);
        saveMessage(user, ChatSender.AI, reply);
        return new ChatResult(reply, updates.keySet().stream().toList(), List.of());
    }

    private String buildSeekerFallbackReply(Map<String, String> updates) {
        if (!updates.isEmpty()) {
            return "Updated profile fields: " + String.join(", ", updates.keySet())
                + ". Tell me more if you want to refine anything.";
        }
        return "Tell me your name, headline, skills, location, and experience. "
            + "Use 'skills: Java, Spring' style entries so I can update your profile.";
    }

    private List<String> buildTopMatches(List<MatchResult> matches) {
        List<String> topMatches = new ArrayList<>();
        for (MatchResult match : matches.stream().limit(5).toList()) {
            topMatches.add("Seeker #" + match.seekerId()
                + " score=" + match.score());
        }
        return topMatches;
    }

    private String buildPosterFallbackReply(JobPost jobPost, List<String> topMatches) {
        if (topMatches.isEmpty()) {
            return "No matches yet. Add more required skills to your job post or invite seekers.";
        }
        return "Top matches for \"" + jobPost.getTitle() + "\": " + String.join("; ", topMatches);
    }

    public record ChatResult(String reply, List<String> updatedFields, List<String> matchSummaries) {
    }
}
