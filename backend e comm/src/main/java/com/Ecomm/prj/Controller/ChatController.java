package com.Ecomm.prj.Controller;


import com.Ecomm.prj.Service.ChatService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/chat", "/api/chat"})
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {
    private final ChatService service;

    private final ObjectMapper objectMapper;

    public ChatController(ChatService service, ObjectMapper objectMapper) {
        this.service = service;
        this.objectMapper = objectMapper;
    }

    @PostMapping(
            consumes = {
                    MediaType.APPLICATION_JSON_VALUE,
                    MediaType.TEXT_PLAIN_VALUE,
                    MediaType.APPLICATION_OCTET_STREAM_VALUE
            }
    )
    public String chat(@RequestBody(required = false) String body) {
        String prompt = resolveMessage(body);
        return service.getResponse(prompt);
    }

    @PostMapping(
            consumes = {
                    MediaType.APPLICATION_FORM_URLENCODED_VALUE,
                    MediaType.MULTIPART_FORM_DATA_VALUE
            }
    )
    public String chatForm(@RequestParam("message") String message) {
        String prompt = normalizeMessage(message);
        return service.getResponse(prompt);
    }

    private String normalizeMessage(String message) {
        if (message == null || message.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "message is required");
        }
        return message.trim();
    }

    private String resolveMessage(String body) {
        if (body == null || body.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "message is required");
        }

        String trimmedBody = body.trim();
        if (trimmedBody.startsWith("{")) {
            try {
                JsonNode node = objectMapper.readTree(trimmedBody);
                JsonNode messageNode = node.get("message");
                if (messageNode != null && !messageNode.asText().isBlank()) {
                    return messageNode.asText().trim();
                }
            } catch (Exception ignored) {
                // Fall through to treating the body as plain text.
            }
        }

        return trimmedBody;
    }
}
