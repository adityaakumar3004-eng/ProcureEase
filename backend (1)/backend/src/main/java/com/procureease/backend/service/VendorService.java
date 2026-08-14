package com.procureease.backend.service;

import com.procureease.backend.dto.VendorRequest;
import com.procureease.backend.dto.VendorResponse;
import com.procureease.backend.entity.Vendor;
import com.procureease.backend.exception.ResourceAlreadyExistsException;
import com.procureease.backend.exception.ResourceNotFoundException;
import com.procureease.backend.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepository;

    // ============================
    // Create Vendor
    // ============================

    public VendorResponse createVendor(VendorRequest request) {

        // Check if email already exists
        if (vendorRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResourceAlreadyExistsException(
                    "Vendor with this email already exists."
            );
        }

        Vendor vendor = Vendor.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim())
                .phone(request.getPhone().trim())
                .address(request.getAddress().trim())
                .build();

        Vendor savedVendor = vendorRepository.save(vendor);

        return mapToResponse(savedVendor);
    }

    // ============================
    // Get All Vendors
    // ============================

    public List<VendorResponse> getAllVendors() {

        return vendorRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ============================
    // Update Vendor
    // ============================

    public VendorResponse updateVendor(
            Integer id,
            VendorRequest request
    ) {

        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Vendor not found with id: " + id
                        )
                );

        vendor.setName(request.getName().trim());
        vendor.setEmail(request.getEmail().trim());
        vendor.setPhone(request.getPhone().trim());
        vendor.setAddress(request.getAddress().trim());

        Vendor updatedVendor = vendorRepository.save(vendor);

        return mapToResponse(updatedVendor);
    }

    // ============================
    // Delete Vendor
    // ============================

    public void deleteVendor(Integer id) {

        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Vendor not found with id: " + id
                        )
                );

        vendorRepository.delete(vendor);
    }

    // ============================
    // Entity → Response Mapping
    // ============================

    private VendorResponse mapToResponse(Vendor vendor) {

        return VendorResponse.builder()
                .id(vendor.getId())
                .name(vendor.getName())
                .email(vendor.getEmail())
                .phone(vendor.getPhone())
                .address(vendor.getAddress())
                .build();
    }
}