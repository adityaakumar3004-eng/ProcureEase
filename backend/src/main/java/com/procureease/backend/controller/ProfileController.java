package com.procureease.backend.controller;

import com.procureease.backend.dto.ChangePasswordRequest;
import com.procureease.backend.dto.ProfileResponse;
import com.procureease.backend.dto.UpdateProfileRequest;
import com.procureease.backend.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    // ============================================================
    // Get Logged-In User Profile
    // ============================================================

    @GetMapping
    public ResponseEntity<Map<String, Object>> getProfile(
            Authentication authentication
    ) {

        ProfileResponse profile =
                profileService.getProfile(
                        authentication.getName()
                );

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);
        response.put("data", profile);

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // Update Profile
    // ============================================================

    @PutMapping
    public ResponseEntity<Map<String, Object>> updateProfile(
            Authentication authentication,
            @Valid @RequestBody
            UpdateProfileRequest request
    ) {

        ProfileResponse profile =
                profileService.updateProfile(
                        authentication.getName(),
                        request
                );

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);

        response.put(
                "message",
                "Profile updated successfully."
        );

        response.put("data", profile);

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // Change Password
    // ============================================================

    @PutMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(
            Authentication authentication,
            @Valid @RequestBody
            ChangePasswordRequest request
    ) {

        profileService.changePassword(
                authentication.getName(),
                request
        );

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);

        response.put(
                "message",
                "Password changed successfully."
        );

        return ResponseEntity.ok(response);
    }
}