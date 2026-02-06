package com.hashan0314.aiassistant.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private static final Logger log = LoggerFactory.getLogger(ChatService.class);

    private final OllamaClient ollamaClient;

    public ChatService(OllamaClient ollamaClient) {
        this.ollamaClient = ollamaClient;
    }

    public ChatResult handleMessage(String message) {
        return handleMessage(message, "n/a");
    }

    public ChatResult handleMessage(String message, String requestId) {
        long startedAt = System.currentTimeMillis();
        int messageLength = message == null ? 0 : message.length();
        log.info("chat.service.start requestId={} messageLength={}", requestId, messageLength);

        String reply = ollamaClient.generateChatReply(message, requestId);

        long durationMs = System.currentTimeMillis() - startedAt;
        int replyLength = reply == null ? 0 : reply.length();
        log.info("chat.service.success requestId={} replyLength={} durationMs={}",
            requestId, replyLength, durationMs);
        return new ChatResult(reply);
    }

    public record ChatResult(String reply) {
    }
}
