package com.hashan0314.aiassistant.service;

import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final OllamaClient ollamaClient;

    public ChatService(OllamaClient ollamaClient) {
        this.ollamaClient = ollamaClient;
    }

    public ChatResult handleMessage(String message) {
        String reply = ollamaClient.generateChatReply(message);
        return new ChatResult(reply);
    }

    public record ChatResult(String reply) {
    }
}
