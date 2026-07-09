package com.Ecomm.prj.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailService userDetailService;

    public JwtFilter(JwtUtil jwtUtil,
                     CustomUserDetailService customUserDetailService) {
        this.jwtUtil = jwtUtil;
        this.userDetailService = customUserDetailService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        System.out.println("[JwtFilter] " + request.getMethod() + " " + request.getRequestURI());

        String authHeader = request.getHeader("Authorization");
        System.out.println("[JwtFilter] Authorization header = " + authHeader);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("[JwtFilter] Missing Bearer token, skipping JWT auth");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String jwt = authHeader.substring(7);
            System.out.println("[JwtFilter] JWT extracted = " + jwt);

            String username = jwtUtil.extractUsername(jwt);
            System.out.println("[JwtFilter] Username from token = " + username);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                System.out.println("[JwtFilter] SecurityContext is empty, loading user details");
                CustomUserDetail userDetail = userDetailService.loadUserByUsername(username);
                System.out.println("[JwtFilter] Loaded user email = " + userDetail.getUsername());

                boolean valid = jwtUtil.validateToken(jwt, userDetail.getUsername());
                System.out.println("[JwtFilter] Token valid = " + valid);

                if (valid) {
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetail,
                                    null,
                                    userDetail.getAuthorities()
                            );

                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    System.out.println("[JwtFilter] Authentication stored in SecurityContext");
                } else {
                    System.out.println("[JwtFilter] Token validation failed");
                }
            } else {
                System.out.println("[JwtFilter] Username was null or authentication already exists");
            }
        } catch (RuntimeException ex) {
            System.out.println("[JwtFilter] Exception while parsing JWT: " + ex.getClass().getSimpleName() + " - " + ex.getMessage());
            SecurityContextHolder.clearContext();
        }

        System.out.println("[JwtFilter] Continuing filter chain");
        filterChain.doFilter(request, response);
    }
}
