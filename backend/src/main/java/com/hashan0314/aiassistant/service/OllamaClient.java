package com.hashan0314.aiassistant.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Arrays;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class OllamaClient {

    private static final Logger log = LoggerFactory.getLogger(OllamaClient.class);

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
        return generateChatReply(message, "n/a");
    }

    public String generateChatReply(String message, String requestId) {
        long promptStartedAt = System.currentTimeMillis();
        String prompt = instructionLoader.buildPrompt(message);
        long promptDurationMs = System.currentTimeMillis() - promptStartedAt;
        log.info("chat.ollama.prompt.ready requestId={} model={} promptLength={} promptBuildDurationMs={}",
            requestId, model, prompt.length(), promptDurationMs);
        return generate(prompt, requestId);
    }

    private String generate(String prompt, String requestId) {
        OllamaRequest request = new OllamaRequest(
            model,
            new Message[] { new Message("user", prompt) },
            false
        );

        long startedAt = System.currentTimeMillis();
        log.info("chat.ollama.request.start requestId={} model={}", requestId, model);
        OllamaResponse response;
        try {
            response = webClient.post()
                .uri("/api/chat")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(OllamaResponse.class)
                .block();
        } catch (WebClientResponseException ex) {
            log.error("chat.ollama.request.http_error requestId={} status={} responseBody={}",
                requestId, ex.getStatusCode().value(), ex.getResponseBodyAsString(), ex);
            throw ex;
        } catch (RuntimeException ex) {
            log.error("chat.ollama.request.failed requestId={} reason={}",
                requestId, ex.getMessage(), ex);
            throw ex;
        }
        long durationMs = System.currentTimeMillis() - startedAt;
        log.info("chat.ollama.request.completed requestId={} durationMs={}", requestId, durationMs);

        if (response == null
            || response.message() == null
            || response.message().content() == null
            || response.message().content().isBlank()) {
            log.error("chat.ollama.response.invalid requestId={} reason=empty_content", requestId);
            throw new IllegalStateException("Empty response from LLM");
        }

        log.info("chat.ollama.response.valid requestId={} replyLength={}",
            requestId, response.message().content().length());
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
