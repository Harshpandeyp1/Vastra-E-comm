package com.Ecomm.prj.Service;

import com.Ecomm.prj.Dto.LoginDto;
import com.Ecomm.prj.Dto.LoginResponseDto;
import com.Ecomm.prj.Dto.SignupDto;
import com.Ecomm.prj.Model.Role;
import com.Ecomm.prj.Model.User;
import com.Ecomm.prj.Security.JwtUtil;
import com.Ecomm.prj.repository.UserRepo;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepo repo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepo repo,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public String signup(SignupDto request) {
        System.out.println("[UserService] Signup request for email = "
                + request.getEmail() + ", username = " + request.getUsername());

        if (repo.existsByUsername(request.getUsername())) {
            System.out.println("[UserService] Username already exists");
            return "username already exists";
        }

        if (repo.existsByEmail(request.getEmail())) {
            System.out.println("[UserService] Email already exists");
            return "Email already exists";
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Signups through this endpoint are customer signups only.
        Role requestedRole = request.getRole();

        if (requestedRole == null) {
            requestedRole = Role.USER;
        }

        if (requestedRole != Role.USER) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only user registration is allowed"
            );
        }

        user.setRole(requestedRole);

        repo.save(user);

        System.out.println("[UserService] Signup successful, user id = " + user.getId());
        return "Signup successful";
    }

    public LoginResponseDto login(LoginDto request) {
        System.out.println("[UserService] Login request for email = " + request.getEmail());
        User user = repo.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    System.out.println("[UserService] User not found for email = " + request.getEmail());
                    return new UsernameNotFoundException("User not found");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            System.out.println("[UserService] Password mismatch for email = " + request.getEmail());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        System.out.println("[UserService] Password matched, generating token");
        String token = jwtUtil.generateToken(user.getEmail());
        System.out.println("[UserService] Token generated for email = " + user.getEmail());

        return new LoginResponseDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                token,
                user.getRole()
        );
    }
}
