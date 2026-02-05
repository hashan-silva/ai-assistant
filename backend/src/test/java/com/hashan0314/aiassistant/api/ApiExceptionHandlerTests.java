package com.hashan0314.aiassistant.api;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

class ApiExceptionHandlerTests {

    private final ApiExceptionHandler handler = new ApiExceptionHandler();

    @Test
    void handleBadRequestReturns400AndErrorBody() {
        ResponseEntity<Map<String, String>> response =
            handler.handleBadRequest(new IllegalArgumentException("Message is required"));

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Message is required", response.getBody().get("error"));
    }

    @Test
    void handleConflictReturns409AndErrorBody() {
        ResponseEntity<Map<String, String>> response =
            handler.handleConflict(new IllegalStateException("Empty response from LLM"));

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals("Empty response from LLM", response.getBody().get("error"));
    }
}
