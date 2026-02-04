package com.helpclub.platform.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Arrays;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class OllamaClient {

    private final WebClient webClient;
    private final String model;
    private final AiInstructionLoader instructionLoader;

    public OllamaClient(@Value("${ollama.base-url}") String baseUrl,
                        @Value("${ollama.model}") String model,
                        AiInstructionLoader instructionLoader) {
        this.webClient = WebClient.builder().baseUrl(baseUrl).build();
        this.model = model;
        this.instructionLoader = instructionLoader;
    }

    public String generateChatReply(String message) {
        String prompt = instructionLoader.buildPrompt(message);
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

        @Override
        public boolean equals(Object other) {
            if (this == other) {
                return true;
            }
            if (!(other instanceof OllamaRequest that)) {
                return false;
            }
            return stream == that.stream
                && java.util.Objects.equals(model, that.model)
                && Arrays.equals(messages, that.messages);
        }

        @Override
        public int hashCode() {
            int result = java.util.Objects.hash(model, stream);
            result = 31 * result + Arrays.hashCode(messages);
            return result;
        }

        @Override
        public String toString() {
            return "OllamaRequest[model=" + model
                + ", messages=" + Arrays.toString(messages)
                + ", stream=" + stream + "]";
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record OllamaResponse(Message message) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record Message(String role, String content) {
    }
}
