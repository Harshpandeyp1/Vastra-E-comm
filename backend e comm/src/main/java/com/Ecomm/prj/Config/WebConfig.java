package com.Ecomm.prj.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    private static final String LOCAL_VITE_ORIGIN = "http://localhost:5173";
    private static final String LOCAL_REACT_ORIGIN = "http://localhost:3000";
    private static final String PRODUCTION_FRONTEND_ORIGIN = "https://vastra-e-comm-1-jnkv.onrender.com";

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                                LOCAL_VITE_ORIGIN,
                                LOCAL_REACT_ORIGIN,
                                PRODUCTION_FRONTEND_ORIGIN
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }
}
