package com.Ecomm.prj.Service;

import com.Ecomm.prj.Dto.LoginDto;
import com.Ecomm.prj.Dto.LoginResponseDto;
import com.Ecomm.prj.Dto.SignupDto;
import com.Ecomm.prj.Model.LoginActivity;
import com.Ecomm.prj.Model.Role;
import com.Ecomm.prj.Model.User;
import com.Ecomm.prj.Security.JwtUtil;
import com.Ecomm.prj.repository.LoginActivityRepo;
import com.Ecomm.prj.repository.UserRepo;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserService {
    private final UserRepo repo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final LoginActivityRepo loginActivityRepo;

    public UserService(UserRepo repo,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil, LoginActivityRepo loginActivityRepo) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.loginActivityRepo = loginActivityRepo;
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
        user.setRole(Role.USER);
        // Signups through this endpoint are customer signups only.

        repo.save(user);

        System.out.println("[UserService] Signup successful, user id = " + user.getId());
        return "Signup successful";
    }

    public LoginResponseDto login(LoginDto request) {

        System.out.println(
                "[UserService] Login request for email = " + request.getEmail()
        );

        User user = repo.findByEmail(request.getEmail())
                .orElse(null);

        // Email does not exist
        if (user == null) {

            System.out.println(
                    "[UserService] User not found for email = " + request.getEmail()
            );

            loginActivityRepo.save(
                    new LoginActivity(
                            null,
                            request.getEmail(),
                            LocalDateTime.now(),
                            "FAILED"
                    )
            );

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid credentials"
            );
        }

        // Email exists but password is incorrect
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {

            System.out.println(
                    "[UserService] Password mismatch for email = "
                            + request.getEmail()
            );

            loginActivityRepo.save(
                    new LoginActivity(
                            user.getId(),
                            user.getEmail(),
                            LocalDateTime.now(),
                            "FAILED"
                    )
            );

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid credentials"
            );
        }

        // Successful login
        loginActivityRepo.save(
                new LoginActivity(
                        user.getId(),
                        user.getEmail(),
                        LocalDateTime.now(),
                        "SUCCESS"
                )
        );

        System.out.println(
                "[UserService] Password matched, generating token"
        );

        String token = jwtUtil.generateToken(user.getEmail());

        System.out.println(
                "[UserService] Token generated for email = "
                        + user.getEmail()
        );

        return new LoginResponseDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                token,
                user.getRole()
        );
    }
}
