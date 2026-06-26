package com.Ecomm.prj.Controller;


import com.Ecomm.prj.Dto.ChatRequest;
import com.Ecomm.prj.Service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {
    @Autowired
    private ChatService service;
    @PostMapping
  public String chat(@RequestBody ChatRequest request){
      return service.getResponse(request.getMessage());
  }
}
