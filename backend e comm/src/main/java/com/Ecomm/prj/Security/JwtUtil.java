package com.Ecomm.prj.Security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET =
            "mySuperSecretKeyForJwtAuthentication123456789";
    private static final long EXPIRATION_MS = 60L * 60L * 1000L;

    private final SecretKey key = Keys.hmacShaKeyFor(
            SECRET.getBytes(StandardCharsets.UTF_8)
    );

    public String generateToken(String email) {
        System.out.println("[JwtUtil] Generating token for email = " + email);
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(key)
                .compact();
    }

    public String extractUsername(String token) {
        System.out.println("[JwtUtil] Extracting username from token");
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String token, String email) {
        System.out.println("[JwtUtil] Validating token for email = " + email);
        String username = extractUsername(token);
        boolean valid = username != null
                && username.equals(email)
                && !isTokenExpired(token);
        System.out.println("[JwtUtil] Validation result = " + valid + ", token subject = " + username);
        return valid;
    }

    public boolean isTokenExpired(String token) {
        System.out.println("[JwtUtil] Checking token expiration");
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration()
                .before(new Date());
    }
}
