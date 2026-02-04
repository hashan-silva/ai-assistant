package com.helpclub.platform.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

@Service
public class AiInstructionLoader {

    private final AiInstructions instructions;

    public AiInstructionLoader(@Value("${ai.instructions.version}") String version,
                               ResourceLoader resourceLoader) {
        this.instructions = load(version, resourceLoader);
    }

    public String buildPrompt(String message) {
        String schemaBlock = formatOptionalBlock("Schema", instructions.schemaJson());
        String configBlock = formatOptionalBlock("Model config", instructions.modelConfig());
        return """
            %s

            %s%sUser message:
            %s
            """.formatted(instructions.systemPrompt(), schemaBlock, configBlock, message);
    }

    private AiInstructions load(String version, ResourceLoader resourceLoader) {
        String basePath = "classpath:ai/" + version + "/";
        String systemPrompt = readRequired(resourceLoader.getResource(basePath + "system.md"),
            "system.md", version);
        String schemaJson = readOptional(resourceLoader.getResource(basePath + "schema.json"));
        String modelConfig = readOptional(resourceLoader.getResource(basePath + "config.yml"));
        return new AiInstructions(systemPrompt, schemaJson, modelConfig);
    }

    private String readRequired(Resource resource, String filename, String version) {
        if (!resource.exists()) {
            throw new IllegalStateException(
                "Missing AI instruction file: ai/" + version + "/" + filename);
        }
        return readResource(resource);
    }

    private String readOptional(Resource resource) {
        if (resource == null || !resource.exists()) {
            return null;
        }
        return readResource(resource);
    }

    private String readResource(Resource resource) {
        try (InputStream inputStream = resource.getInputStream()) {
            return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8).trim();
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to read AI instruction file", ex);
        }
    }

    private String formatOptionalBlock(String title, String content) {
        if (content == null || content.isBlank()) {
            return "";
        }
        return title + ":\n" + content + "\n\n";
    }

    private record AiInstructions(String systemPrompt,
                                  String schemaJson,
                                  String modelConfig) {
    }
}
