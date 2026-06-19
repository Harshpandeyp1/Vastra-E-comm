package com.Ecomm.prj.Controller;

import com.Ecomm.prj.Dto.LoginDto;
import com.Ecomm.prj.Dto.SignupDto;
import com.Ecomm.prj.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupDto request) {
        return ResponseEntity.ok(service.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDto request) {
        return ResponseEntity.ok(service.login(request));
    }
}
