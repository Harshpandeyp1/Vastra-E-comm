package com.Ecomm.prj.Dto;

import java.util.List;

public class ChatRequestDto {
    private String role; // "USER" or "MERCHANT"
    private String message;
    private List<ChatMessageDto> messages;

    public ChatRequestDto() {}

    public ChatRequestDto(String role, List<ChatMessageDto> messages) {
        this.role = role;
        this.messages = messages;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<ChatMessageDto> getMessages() {
        return messages;
    }

    public void setMessages(List<ChatMessageDto> messages) {
        this.messages = messages;
    }
}