package com.hashan0314.aiassistant.api;

import com.hashan0314.aiassistant.api.dto.ChatRequest;
import com.hashan0314.aiassistant.api.dto.ChatResponse;
import com.hashan0314.aiassistant.service.ChatService;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private static final Logger log = LoggerFactory.getLogger(ChatController.class);

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request,
                             @RequestHeader(value = "X-Request-Id", required = false) String requestIdHeader) {
        String requestId = (requestIdHeader == null || requestIdHeader.isBlank())
            ? UUID.randomUUID().toString()
            : requestIdHeader;
        int messageLength = request.getMessage() == null ? 0 : request.getMessage().length();
        log.info("chat.request.received requestId={} messageLength={}", requestId, messageLength);

        if (request.getMessage() == null || request.getMessage().isBlank()) {
            log.warn("chat.request.invalid requestId={} reason=missing_message", requestId);
            throw new IllegalArgumentException("Message is required");
        }

        ChatService.ChatResult result = chatService.handleMessage(request.getMessage(), requestId);
        int replyLength = result.reply() == null ? 0 : result.reply().length();
        log.info("chat.request.completed requestId={} replyLength={}", requestId, replyLength);
        return new ChatResponse(result.reply());
    }
}
