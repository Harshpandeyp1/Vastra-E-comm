package com.Ecomm.prj.Controller;

import com.Ecomm.prj.Dto.ChatMessageDto;
import com.Ecomm.prj.Dto.ChatRequestDto;
import com.Ecomm.prj.Service.ChatService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/chat", "/api/chat"})
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:3000"
})
public class ChatController {

    private final ChatService service;
    private final ObjectMapper objectMapper;

    public ChatController(
            ChatService service,
            ObjectMapper objectMapper
    ) {
        this.service = service;
        this.objectMapper = objectMapper;
    }

    // ---------------------------------------------------------
    // Get role from authenticated JWT / SecurityContext
    // ---------------------------------------------------------
    private String getAuthenticatedRole() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        System.out.println(
                "[ChatController] Authentication = "
                        + authentication
        );

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "User is not authenticated"
            );
        }

        System.out.println(
                "[ChatController] Authorities = "
                        + authentication.getAuthorities()
        );

        String role = authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .map(String::toUpperCase)
                .map(authority ->
                        authority.startsWith("ROLE_")
                                ? authority.substring(5)
                                : authority
                )
                .filter(authority ->
                        authority.equals("USER") ||
                                authority.equals("MERCHANT")
                )
                .findFirst()
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.FORBIDDEN,
                                "No valid USER or MERCHANT role found"
                        )
                );

        System.out.println(
                "[ChatController] Authenticated role = "
                        + role
        );

        return role;
    }

    // ---------------------------------------------------------
    // Chat endpoint
    // ---------------------------------------------------------
    @PostMapping(
            consumes = {
                    MediaType.APPLICATION_JSON_VALUE,
                    MediaType.TEXT_PLAIN_VALUE,
                    MediaType.APPLICATION_OCTET_STREAM_VALUE
            }
    )
    public Map<String, String> chat(
            @RequestBody(required = false) String body
    ) {

        if (body == null || body.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Body is required"
            );
        }

        try {

            String trimmedBody = body.trim();

            // -------------------------------------------------
            // Get role ONLY from authentication
            // -------------------------------------------------
            String role = getAuthenticatedRole();

            System.out.println(
                    "[ChatController] Processing chat as role = "
                            + role
            );

            // -------------------------------------------------
            // JSON request
            // -------------------------------------------------
            if (trimmedBody.startsWith("{")) {

                ChatRequestDto request =
                        objectMapper.readValue(
                                trimmedBody,
                                ChatRequestDto.class
                        );

                // ---------------------------------------------
                // Conversation history
                // ---------------------------------------------
                if (request.getMessages() != null &&
                        !request.getMessages().isEmpty()) {

                    System.out.println(
                            "[ChatController] Sending conversation history to "
                                    + role
                    );

                    String reply =
                            service.getResponseWithHistoryAndRole(
                                    request.getMessages(),
                                    role
                            );

                    return Map.of("reply", reply);
                }

                // ---------------------------------------------
                // Single message
                // ---------------------------------------------
                if (request.getMessage() != null &&
                        !request.getMessage().isBlank()) {

                    System.out.println(
                            "[ChatController] Sending single message to "
                                    + role
                    );

                    List<ChatMessageDto> single =
                            List.of(
                                    new ChatMessageDto(
                                            "user",
                                            request.getMessage()
                                    )
                            );

                    String reply =
                            service.getResponseWithHistoryAndRole(
                                    single,
                                    role
                            );

                    return Map.of("reply", reply);
                }

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Message or messages are required"
                );
            }

            // -------------------------------------------------
            // Plain text request
            // -------------------------------------------------
            List<ChatMessageDto> single =
                    List.of(
                            new ChatMessageDto(
                                    "user",
                                    trimmedBody
                            )
                    );

            String reply =
                    service.getResponseWithHistoryAndRole(
                            single,
                            role
                    );

            return Map.of("reply", reply);

        } catch (ResponseStatusException ex) {

            // Do NOT convert authentication/authorization
            // errors into USER AI responses.
            throw ex;

        } catch (Exception ex) {

            // IMPORTANT:
            // Do NOT fallback to service.getResponse().
            // That method uses the USER AI prompt.

            System.err.println(
                    "[ChatController] Chat processing failed: "
                            + ex.getClass().getSimpleName()
                            + " - "
                            + ex.getMessage()
            );

            ex.printStackTrace();

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "AI processing failed",
                    ex
            );
        }
    }

    // ---------------------------------------------------------
    // Form request
    // ---------------------------------------------------------
    @PostMapping(
            consumes = {
                    MediaType.APPLICATION_FORM_URLENCODED_VALUE,
                    MediaType.MULTIPART_FORM_DATA_VALUE
            }
    )
    public Map<String, String> chatForm(
            @RequestParam("message") String message
    ) {

        if (message == null || message.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "message is required"
            );
        }

        String role = getAuthenticatedRole();

        List<ChatMessageDto> single =
                List.of(
                        new ChatMessageDto(
                                "user",
                                message.trim()
                        )
                );

        String reply =
                service.getResponseWithHistoryAndRole(
                        single,
                        role
                );

        return Map.of("reply", reply);
    }
}

