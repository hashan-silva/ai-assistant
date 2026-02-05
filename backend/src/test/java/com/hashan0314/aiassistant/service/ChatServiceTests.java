package com.hashan0314.aiassistant.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ChatServiceTests {

    @Mock
    private OllamaClient ollamaClient;

    @Test
    void handleMessageReturnsReplyFromOllamaClient() {
        when(ollamaClient.generateChatReply("Hello")).thenReturn("Hi there!");
        ChatService chatService = new ChatService(ollamaClient);

        ChatService.ChatResult result = chatService.handleMessage("Hello");

        assertEquals("Hi there!", result.reply());
        verify(ollamaClient).generateChatReply("Hello");
    }
}
