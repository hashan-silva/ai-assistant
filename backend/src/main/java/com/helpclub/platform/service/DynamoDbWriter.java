package com.helpclub.platform.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;

@Service
public class DynamoDbWriter {

    private final DynamoDbClient dynamoDbClient;

    public DynamoDbWriter(DynamoDbClient dynamoDbClient) {
        this.dynamoDbClient = dynamoDbClient;
    }

    public void putItem(String tableName, Map<String, AttributeValue> item) {
        if (tableName == null || tableName.isBlank()) {
            throw new IllegalArgumentException("DynamoDB table name is required");
        }
        dynamoDbClient.putItem(PutItemRequest.builder()
            .tableName(tableName)
            .item(item)
            .build());
    }

    public AttributeValue stringValue(String value) {
        return AttributeValue.builder().s(value).build();
    }

    public AttributeValue numberValue(Number value) {
        return AttributeValue.builder().n(String.valueOf(value)).build();
    }

    public AttributeValue listValue(List<String> values) {
        if (values == null || values.isEmpty()) {
            return null;
        }
        return AttributeValue.builder()
            .l(values.stream().map(this::stringValue).toList())
            .build();
    }

    public Map<String, AttributeValue> newItem() {
        return new HashMap<>();
    }
}
