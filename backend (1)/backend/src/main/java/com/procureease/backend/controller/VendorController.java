package com.procureease.backend.controller;

import com.procureease.backend.dto.VendorRequest;
import com.procureease.backend.dto.VendorResponse;
import com.procureease.backend.service.VendorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    // ============================
    // Create Vendor
    // ============================

    @PostMapping
    public ResponseEntity<Map<String, Object>> createVendor(
            @Valid @RequestBody VendorRequest request
    ) {

        VendorResponse vendor = vendorService.createVendor(request);

        Map<String, Object> response = new HashMap<>();

        response.put("success", true);
        response.put("message", "Vendor added successfully");
        response.put("data", vendor);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // ============================
    // Get All Vendors
    // ============================

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllVendors() {

        List<VendorResponse> vendors =
                vendorService.getAllVendors();

        Map<String, Object> response = new HashMap<>();

        response.put("success", true);
        response.put("data", vendors);

        return ResponseEntity.ok(response);
    }

    // ============================
    // Update Vendor
    // ============================

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateVendor(
            @PathVariable Integer id,
            @Valid @RequestBody VendorRequest request
    ) {

        vendorService.updateVendor(id, request);

        Map<String, Object> response = new HashMap<>();

        response.put("success", true);
        response.put("message", "Vendor updated successfully");

        return ResponseEntity.ok(response);
    }

    // ============================
    // Delete Vendor
    // ============================

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteVendor(
            @PathVariable Integer id
    ) {

        vendorService.deleteVendor(id);

        Map<String, Object> response = new HashMap<>();

        response.put("success", true);
        response.put("message", "Vendor deleted successfully");

        return ResponseEntity.ok(response);
    }
}