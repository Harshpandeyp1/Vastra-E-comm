package com.Ecomm.prj.Service;

import com.Ecomm.prj.Dto.LoginDto;
import com.Ecomm.prj.Dto.LoginResponseDto;
import com.Ecomm.prj.Dto.SignupDto;
import com.Ecomm.prj.Model.User;
import com.Ecomm.prj.Security.JwtUtil;
import com.Ecomm.prj.repository.UserRepo;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepo repo;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepo repo,
                       AuthenticationManager authenticationManager,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.repo = repo;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public String signup(SignupDto request) {
        if (repo.existsByUsername(request.getUsername())) {
            return "username already exists";
        }
        if (repo.existsByEmail(request.getEmail())) {
            return "Email already exists";
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        repo.save(user);
        return "Signup successful";
    }

    public LoginResponseDto login(LoginDto request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = repo.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        String token = jwtUtil.generateToken(user.getEmail());

        return new LoginResponseDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                token
        );
    }
}
