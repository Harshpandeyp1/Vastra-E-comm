package com.Ecomm.prj.Service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
@Service
public class ChatService {

    private final ChatClient chatClient;

    public ChatService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public String getResponse(String message) {

        System.out.println("Calling Gemini...");

        String response = chatClient
                .prompt()
                .user(message)
                .call()
                .content();

        System.out.println("Gemini responded.");

        return response;
    }
}