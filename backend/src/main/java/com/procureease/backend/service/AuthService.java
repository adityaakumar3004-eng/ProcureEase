package com.procureease.backend.service;

import com.procureease.backend.dto.LoginRequest;
import com.procureease.backend.dto.LoginResponse;
import com.procureease.backend.dto.RegisterRequest;
import com.procureease.backend.dto.UserResponse;
import com.procureease.backend.entity.User;
import com.procureease.backend.exception.ResourceAlreadyExistsException;
import com.procureease.backend.exception.ResourceNotFoundException;
import com.procureease.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    // ============================
    // Register User
    // ============================

    public String register(RegisterRequest request) {

        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResourceAlreadyExistsException(
                    "Email already registered"
            );
        }

        // Create User Object
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        // Save User
        userRepository.save(user);

        return "User Registered Successfully";
    }

    // ============================
    // Login User
    // ============================

    public LoginResponse login(LoginRequest request) {

        // Find User
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Invalid Email or Password"));

        // Check Password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResourceNotFoundException("Invalid Email or Password");
        }

        // Generate JWT Token
        String token = jwtService.generateToken(user);

        // Build User Response
        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();

        // Return Login Response
        return LoginResponse.builder()
                .message("Login Successful")
                .token(token)
                .user(userResponse)
                .build();
    }
}