package com.procureease.backend.service;

import com.procureease.backend.dto.ChangePasswordRequest;
import com.procureease.backend.dto.ProfileResponse;
import com.procureease.backend.dto.UpdateProfileRequest;
import com.procureease.backend.entity.User;
import com.procureease.backend.exception.ResourceAlreadyExistsException;
import com.procureease.backend.exception.ResourceNotFoundException;
import com.procureease.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    // ============================================================
    // Get Profile
    // ============================================================

    public ProfileResponse getProfile(String email) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"
                                )
                        );

        return mapToResponse(user);
    }

    // ============================================================
    // Update Profile
    // ============================================================

    public ProfileResponse updateProfile(
            String currentEmail,
            UpdateProfileRequest request
    ) {

        User user =
                userRepository
                        .findByEmail(currentEmail)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"
                                )
                        );

        // Check if the new email belongs to another user
        if (!user.getEmail().equalsIgnoreCase(
                request.getEmail()
        )) {

            if (userRepository
                    .findByEmail(request.getEmail())
                    .isPresent()) {

                throw new ResourceAlreadyExistsException(
                        "Email already registered"
                );
            }
        }

        user.setFullName(
                request.getFullName()
        );

        user.setEmail(
                request.getEmail()
        );

        User updatedUser =
                userRepository.save(user);

        return mapToResponse(updatedUser);
    }

    // ============================================================
    // Change Password
    // ============================================================

    public void changePassword(
            String email,
            ChangePasswordRequest request
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"
                                )
                        );

        // Check current password
        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword()
        )) {

            throw new IllegalArgumentException(
                    "Current password is incorrect"
            );
        }

        // Prevent using same password
        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword()
        )) {

            throw new IllegalArgumentException(
                    "New password cannot be the same as current password"
            );
        }

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);
    }

    // ============================================================
    // Entity → Response DTO
    // ============================================================

    private ProfileResponse mapToResponse(
            User user
    ) {

        return ProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}