package com.procureease.backend.repository;

import com.procureease.backend.entity.PasswordResetOtp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetOtpRepository
        extends JpaRepository<PasswordResetOtp, Integer> {

    Optional<PasswordResetOtp>
    findTopByEmailOrderByIdDesc(String email);

}