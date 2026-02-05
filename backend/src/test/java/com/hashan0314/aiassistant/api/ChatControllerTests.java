package com.hashan0314.aiassistant.api;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import com.hashan0314.aiassistant.api.dto.ChatRequest;
import com.hashan0314.aiassistant.api.dto.ChatResponse;
import com.hashan0314.aiassistant.service.ChatService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ChatControllerTests {

    @Mock
    private ChatService chatService;

    @Test
    void chatReturnsServiceReplyForValidRequest() {
        ChatController controller = new ChatController(chatService);
        ChatRequest request = new ChatRequest();
        request.setMessage("How are you?");
        when(chatService.handleMessage("How are you?")).thenReturn(new ChatService.ChatResult("Doing well"));

        ChatResponse response = controller.chat(request);

        assertEquals("Doing well", response.getReply());
        verify(chatService).handleMessage("How are you?");
    }

    @Test
    void chatThrowsBadRequestWhenMessageIsBlank() {
        ChatController controller = new ChatController(chatService);
        ChatRequest request = new ChatRequest();
        request.setMessage(" ");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> controller.chat(request));

        assertEquals("Message is required", ex.getMessage());
        verifyNoInteractions(chatService);
    }
}
