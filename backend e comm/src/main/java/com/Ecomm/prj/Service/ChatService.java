package com.Ecomm.prj.Service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChatService {
    public final ChatClient chatClient;
    public ChatService(ChatClient.Builder builder){
        this.chatClient=builder.build();
    }
    public String getResponse(String message){
        return chatClient
                .prompt()
                .user(message)
                .call()
                .content();
    }

}
