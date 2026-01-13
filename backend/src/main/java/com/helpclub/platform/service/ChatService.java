package com.helpclub.platform.service;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final OllamaClient ollamaClient;

    public ChatService(OllamaClient ollamaClient) {
        this.ollamaClient = ollamaClient;
    }

    public ChatResult handleMessage(String message, InstructionAudience audience) {
        String reply = ollamaClient.generateChatReply(message, audience);
        return new ChatResult(reply, List.of(), List.of());
    }

    public record ChatResult(String reply, List<String> updatedFields, List<String> matchSummaries) {
    }
}
