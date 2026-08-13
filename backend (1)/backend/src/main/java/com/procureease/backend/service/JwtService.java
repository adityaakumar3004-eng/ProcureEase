package com.procureease.backend.service;

import com.procureease.backend.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    // ============================
    // Generate JWT Token
    // ============================

    public String generateToken(User user) {

        return Jwts.builder()
                .subject(user.getEmail())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith(getSignInKey())
                .compact();
    }

    // ============================
    // Extract Username (Email)
    // ============================

    public String extractUsername(String token) {

        return extractClaim(token, Claims::getSubject);
    }

    // ============================
    // Extract Expiration Date
    // ============================

    public Date extractExpiration(String token) {

        return extractClaim(token, Claims::getExpiration);
    }

    // ============================
    // Generic Claim Extractor
    // ============================

    public <T> T extractClaim(
            String token,
            Function<Claims, T> claimsResolver
    ) {

        final Claims claims = extractAllClaims(token);

        return claimsResolver.apply(claims);
    }

    // ============================
    // Extract All Claims
    // ============================

    private Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // ============================
    // Check Token Expiry
    // ============================

    private boolean isTokenExpired(String token) {

        return extractExpiration(token).before(new Date());
    }

    // ============================
    // Validate JWT Token
    // ============================

    public boolean isTokenValid(
            String token,
            UserDetails userDetails
    ) {

        final String username = extractUsername(token);

        return username.equals(userDetails.getUsername())
                && !isTokenExpired(token);
    }

    // ============================
    // Secret Key
    // ============================

    private SecretKey getSignInKey() {

        return Keys.hmacShaKeyFor(
                jwtSecret.getBytes(StandardCharsets.UTF_8)
        );
    }
}