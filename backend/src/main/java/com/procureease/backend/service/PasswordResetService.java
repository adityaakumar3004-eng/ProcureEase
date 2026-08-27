package com.procureease.backend.service;

import com.procureease.backend.entity.PasswordResetOtp;
import com.procureease.backend.entity.User;
import com.procureease.backend.exception.ResourceNotFoundException;
import com.procureease.backend.repository.PasswordResetOtpRepository;
import com.procureease.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;

    private final PasswordResetOtpRepository passwordResetOtpRepository;

    private final JavaMailSender mailSender;

    private final PasswordEncoder passwordEncoder;

    @Value("${spring.mail.username}")
    private String senderEmail;


    // ============================================================
    // Send OTP
    // ============================================================

    public void sendOtp(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No account found with this email"
                        )
                );

        // Generate 6-digit OTP
        String otp = String.format(
                "%06d",
                new Random().nextInt(1_000_000)
        );

        // Save OTP with 10-minute expiry
        PasswordResetOtp passwordResetOtp =
                PasswordResetOtp.builder()
                        .email(user.getEmail())
                        .otp(otp)
                        .expiryTime(
                                LocalDateTime.now()
                                        .plusMinutes(10)
                        )
                        .verified(false)
                        .build();

        passwordResetOtpRepository.save(passwordResetOtp);

        // Create email
        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setFrom(senderEmail);

        message.setTo(user.getEmail());

        message.setSubject(
                "ProcureEase Password Reset OTP"
        );

        message.setText(
                "Your OTP for resetting your ProcureEase password is: "
                        + otp
                        + "\n\nThis OTP will expire in 10 minutes."
                        + "\n\nIf you did not request a password reset, please ignore this email."
        );

        // Send email
        mailSender.send(message);
    }


    // ============================================================
    // Verify OTP
    // ============================================================

    public void verifyOtp(String email, String otp) {

        PasswordResetOtp passwordResetOtp =
                passwordResetOtpRepository
                        .findTopByEmailOrderByIdDesc(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "OTP not found"
                                )
                        );

        // Check expiry
        if (passwordResetOtp.getExpiryTime()
                .isBefore(LocalDateTime.now())) {

            throw new RuntimeException(
                    "OTP has expired"
            );
        }

        // Check OTP
        if (!passwordResetOtp.getOtp().equals(otp)) {

            throw new RuntimeException(
                    "Invalid OTP"
            );
        }

        // Mark OTP as verified
        passwordResetOtp.setVerified(true);

        passwordResetOtpRepository.save(passwordResetOtp);
    }


    // ============================================================
    // Reset Password
    // ============================================================
    public void resetPassword(
            String email,
            String newPassword
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );

        PasswordResetOtp passwordResetOtp =
                passwordResetOtpRepository
                        .findTopByEmailOrderByIdDesc(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "OTP not found"
                                )
                        );

        // Check whether OTP was verified
        if (!Boolean.TRUE.equals(passwordResetOtp.getVerified())) {

            throw new RuntimeException(
                    "OTP verification required"
            );
        }

        // Check whether OTP has expired
        if (passwordResetOtp.getExpiryTime()
                .isBefore(LocalDateTime.now())) {

            throw new RuntimeException(
                    "OTP has expired"
            );
        }

        // Encrypt new password
        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        userRepository.save(user);

        // Invalidate OTP after successful password reset
        passwordResetOtp.setVerified(false);

        passwordResetOtpRepository.save(passwordResetOtp);
    }
}