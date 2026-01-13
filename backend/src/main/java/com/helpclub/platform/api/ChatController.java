package com.helpclub.platform.api;

import com.helpclub.platform.api.dto.ChatRequest;
import com.helpclub.platform.api.dto.ChatResponse;
import com.helpclub.platform.service.ChatService;
import com.helpclub.platform.service.InstructionAudience;
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
        return handle(request, InstructionAudience.JOB_SEEKER);
    }

    @PostMapping("/job-seeker")
    public ChatResponse chatJobSeeker(@RequestBody ChatRequest request) {
        return handle(request, InstructionAudience.JOB_SEEKER);
    }

    @PostMapping("/job-poster")
    public ChatResponse chatJobPoster(@RequestBody ChatRequest request) {
        return handle(request, InstructionAudience.JOB_POSTER);
    }

    private ChatResponse handle(ChatRequest request, InstructionAudience audience) {
        if (request.getMessage() == null || request.getMessage().isBlank()) {
            throw new IllegalArgumentException("Message is required");
        }
        ChatService.ChatResult result = chatService.handleMessage(request.getMessage(), audience);
        return new ChatResponse(result.reply(), result.updatedFields(), result.matchSummaries());
    }
}
