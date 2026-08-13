package com.procureease.backend.security;

import com.procureease.backend.service.CustomUserDetailsService;
import com.procureease.backend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("========== JWT FILTER EXECUTED ==========");

        // Get Authorization Header
        final String authHeader = request.getHeader("Authorization");

        final String jwt;
        final String userEmail;

        // Check if Authorization Header is present
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract JWT Token
        jwt = authHeader.substring(7);

        // Extract User Email from JWT
        userEmail = jwtService.extractUsername(jwt);

        // Authenticate only if not already authenticated
        if (userEmail != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

            // Load User from Database
            UserDetails userDetails =
                    userDetailsService.loadUserByUsername(userEmail);

            // Validate Token
            if (jwtService.isTokenValid(jwt, userDetails)) {

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                // Set Authentication in Security Context
                SecurityContextHolder.getContext()
                        .setAuthentication(authToken);
            }
        }

        // Continue the Filter Chain
        filterChain.doFilter(request, response);
    }
}