package com.Ecomm.prj.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {
   private final JwtFilter jwtFilter;
    private final CustomUserDetailService customeruserdetailservice;

    public SecurityConfig(CustomUserDetailService customeruserdetailservice,JwtFilter jwtFilter){
        this.customeruserdetailservice=customeruserdetailservice;
        this.jwtFilter=jwtFilter;
    }
    @Bean
    public PasswordEncoder passwordEncoder(){
        System.out.println("[SecurityConfig] Creating PasswordEncoder");
        return new BCryptPasswordEncoder();
    }
    @Bean
    public AuthenticationProvider authenticationProvider(){
        System.out.println("[SecurityConfig] Creating AuthenticationProvider");
        DaoAuthenticationProvider provider=new DaoAuthenticationProvider();

        provider.setUserDetailsService(customeruserdetailservice);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)throws Exception{
        System.out.println("[SecurityConfig] Building SecurityFilterChain");

        http
                .cors(Customizer.withDefaults())
                .csrf(csrf->csrf.disable())
                .authorizeHttpRequests(auth->auth
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/home").permitAll()
                        .requestMatchers("/cart/**", "/wishlist/**").authenticated()
                        .anyRequest().authenticated()
                )
        .sessionManagement(session->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        System.out.println("[SecurityConfig] JWT filter added before UsernamePasswordAuthenticationFilter");
        return http.build();



    }
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config)
        throws Exception{
        System.out.println("[SecurityConfig] Creating AuthenticationManager");
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        System.out.println("[SecurityConfig] Creating CORS configuration");
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
