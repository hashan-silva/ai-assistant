package com.hashan0314.aiassistant.api;

import com.hashan0314.aiassistant.api.dto.ChatRequest;
import com.hashan0314.aiassistant.api.dto.ChatResponse;
import com.hashan0314.aiassistant.service.ChatService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request) {
        if (request.getMessage() == null || request.getMessage().isBlank()) {
            throw new IllegalArgumentException("Message is required");
        }
        ChatService.ChatResult result = chatService.handleMessage(request.getMessage());
        return new ChatResponse(result.reply());
    }
}
