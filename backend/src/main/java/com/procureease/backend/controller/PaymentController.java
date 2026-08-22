package com.procureease.backend.controller;

import com.procureease.backend.dto.PaymentResponse;
import com.procureease.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // ============================================================
    // Get All Payments
    // ============================================================

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPayments() {

        List<PaymentResponse> payments =
                paymentService.getAllPayments();

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);
        response.put("count", payments.size());
        response.put("data", payments);

        return ResponseEntity.ok(response);
    }
}