package com.Ecomm.prj.Config;

import com.Ecomm.prj.Model.Role;
import com.Ecomm.prj.Model.User;
import com.Ecomm.prj.repository.UserRepo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner createAdmin(
            UserRepo userRepo,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.email}") String adminEmail,
            @Value("${app.admin.password}") String adminPassword
    ) {

        return args -> {

            if (userRepo.findByEmail(adminEmail).isEmpty()) {

                User admin = new User();

                admin.setUsername("admin");
                admin.setEmail(adminEmail);
                admin.setPassword(
                        passwordEncoder.encode(adminPassword)
                );
                admin.setRole(Role.ADMIN);

                userRepo.save(admin);

                System.out.println("Admin account created.");
            }
        };
    }
}