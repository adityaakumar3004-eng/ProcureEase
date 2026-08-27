package com.procureease.backend.controller;

import com.procureease.backend.dto.ForgotPasswordRequest;
import com.procureease.backend.dto.ResetPasswordRequest;
import com.procureease.backend.dto.VerifyOtpRequest;
import com.procureease.backend.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/password-reset")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    // ============================================================
    // Send OTP
    // ============================================================

    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, Object>> sendOtp(
            @Valid @RequestBody ForgotPasswordRequest request
    ) {

        passwordResetService.sendOtp(request.getEmail());

        Map<String, Object> response = new HashMap<>();

        response.put("success", true);
        response.put("message", "OTP sent successfully.");

        return ResponseEntity.ok(response);
    }


    // ============================================================
    // Verify OTP
    // ============================================================

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request
    ) {

        passwordResetService.verifyOtp(
                request.getEmail(),
                request.getOtp()
        );

        Map<String, Object> response = new HashMap<>();

        response.put("success", true);
        response.put("message", "OTP verified successfully.");

        return ResponseEntity.ok(response);
    }


    // ============================================================
    // Reset Password
    // ============================================================

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request
    ) {

        passwordResetService.resetPassword(
                request.getEmail(),
                request.getNewPassword()
        );

        Map<String, Object> response = new HashMap<>();

        response.put("success", true);
        response.put(
                "message",
                "Password reset successfully."
        );

        return ResponseEntity.ok(response);
    }
}