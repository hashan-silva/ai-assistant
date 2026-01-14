package com.helpclub.platform.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final OllamaClient ollamaClient;
    private final AiPersistenceService persistenceService;
    private final ObjectMapper objectMapper;

    public ChatService(OllamaClient ollamaClient,
                       AiPersistenceService persistenceService,
                       ObjectMapper objectMapper) {
        this.ollamaClient = ollamaClient;
        this.persistenceService = persistenceService;
        this.objectMapper = objectMapper;
    }

    public ChatResult handleMessage(String message, InstructionAudience audience) {
        String reply = ollamaClient.generateChatReply(message, audience);
        AiUpdatePayload payload = tryParsePayload(reply);
        if (payload != null) {
            persistenceService.persist(payload.updates());
            String userReply = payload.reply() == null || payload.reply().isBlank()
                ? reply
                : payload.reply();
            List<String> updatedFields = payload.updates() == null
                ? List.of()
                : UpdatedFieldCollector.collect(payload.updates());
            return new ChatResult(userReply, updatedFields, List.of());
        }
        return new ChatResult(reply, List.of(), List.of());
    }

    private AiUpdatePayload tryParsePayload(String reply) {
        String json = extractJson(reply);
        if (json == null || json.isBlank()) {
            return null;
        }
        try {
            return objectMapper.readValue(json, AiUpdatePayload.class);
        } catch (JsonProcessingException ex) {
            return null;
        }
    }

    private String extractJson(String reply) {
        if (reply == null) {
            return null;
        }
        int fenceStart = reply.indexOf("```");
        if (fenceStart >= 0) {
            int fenceEnd = reply.indexOf("```", fenceStart + 3);
            if (fenceEnd > fenceStart) {
                String fenced = reply.substring(fenceStart + 3, fenceEnd).trim();
                if (fenced.startsWith("json")) {
                    return fenced.substring(4).trim();
                }
                return fenced;
            }
        }
        int start = reply.indexOf('{');
        int end = reply.lastIndexOf('}');
        if (start >= 0 && end > start) {
            return reply.substring(start, end + 1);
        }
        return null;
    }

    public record ChatResult(String reply, List<String> updatedFields, List<String> matchSummaries) {
    }
}
