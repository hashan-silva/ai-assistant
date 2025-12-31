package com.helpclub.platform.api;

import com.helpclub.platform.api.dto.ChatRequest;
import com.helpclub.platform.api.dto.ChatResponse;
import com.helpclub.platform.domain.UserAccount;
import com.helpclub.platform.service.ChatService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
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
    public ChatResponse chat(@RequestAttribute("authUser") UserAccount user,
                             @RequestBody ChatRequest request) {
        if (request.getMessage() == null || request.getMessage().isBlank()) {
            throw new IllegalArgumentException("Message is required");
        }
        ChatService.ChatResult result = chatService.handleMessage(user, request.getMessage());
        return new ChatResponse(result.reply(), result.updatedFields(), result.matchSummaries());
    }
}
