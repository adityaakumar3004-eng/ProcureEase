package com.procureease.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                // Disable CSRF because this is a stateless REST API
                .csrf(csrf -> csrf.disable())

                // ============================
                // Authorization Rules
                // ============================
                .authorizeHttpRequests(auth -> auth

                        // Authentication APIs are public
                        .requestMatchers("/api/auth/**")
                        .permitAll()

                        // Create Vendor
                        .requestMatchers(org.springframework.http.HttpMethod.POST,
                                "/api/vendors")
                        .hasAnyRole("ADMIN", "MANAGER")

                        // Get All Vendors
                        .requestMatchers(org.springframework.http.HttpMethod.GET,
                                "/api/vendors")
                        .hasAnyRole("ADMIN", "MANAGER", "EMPLOYEE")

                        // Update Vendor
                        .requestMatchers(org.springframework.http.HttpMethod.PUT,
                                "/api/vendors/**")
                        .hasAnyRole("ADMIN", "MANAGER")

                        // Delete Vendor
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE,
                                "/api/vendors/**")
                        .hasRole("ADMIN")

                        // Everything else requires authentication
                        .anyRequest()
                        .authenticated()
                )

                // ============================
                // Stateless Session
                // ============================
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // ============================
                // Authentication Provider
                // ============================
                .authenticationProvider(authenticationProvider)

                // ============================
                // JWT Filter
                // ============================
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}