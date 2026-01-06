package com.helpclub.platform.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class OllamaClient {

    private final WebClient webClient;
    private final String model;

    public OllamaClient(@Value("${ollama.base-url}") String baseUrl,
                        @Value("${ollama.model}") String model) {
        this.webClient = WebClient.builder().baseUrl(baseUrl).build();
        this.model = model;
    }

    public String generateChatReply(String message) {
        String prompt = """
            You are Helpclub's AI recruiting assistant.
            Reply to the user's message with helpful, concise guidance.
            User message:
            %s
            """.formatted(message);
        return generate(prompt);
    }

    private String generate(String prompt) {
        OllamaRequest request = new OllamaRequest(
            model,
            new Message[] { new Message("user", prompt) },
            false
        );
        OllamaResponse response = webClient.post()
            .uri("/api/chat")
            .bodyValue(request)
            .retrieve()
            .bodyToMono(OllamaResponse.class)
            .block();
        if (response == null
            || response.message() == null
            || response.message().content() == null
            || response.message().content().isBlank()) {
            throw new IllegalStateException("Empty response from LLM");
        }
        return response.message().content().trim();
    }

    private record OllamaRequest(String model, Message[] messages, boolean stream) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record OllamaResponse(Message message) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record Message(String role, String content) {
    }
}
