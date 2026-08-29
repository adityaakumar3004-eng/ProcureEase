package com.procureease.backend.service;

import com.procureease.backend.dto.VendorRequest;
import com.procureease.backend.dto.VendorResponse;
import com.procureease.backend.entity.Vendor;
import com.procureease.backend.exception.ResourceAlreadyExistsException;
import com.procureease.backend.exception.ResourceNotFoundException;
import com.procureease.backend.repository.VendorRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VendorServiceTest {

    @Mock
    private VendorRepository vendorRepository;

    @InjectMocks
    private VendorService vendorService;

    private Vendor vendor;
    private VendorRequest vendorRequest;

    @BeforeEach
    void setUp() {

        vendor = Vendor.builder()
                .id(1)
                .name("ABC Suppliers")
                .email("abc@example.com")
                .phone("9876543210")
                .address("Delhi")
                .build();

        vendorRequest = new VendorRequest();
        vendorRequest.setName("ABC Suppliers");
        vendorRequest.setEmail("abc@example.com");
        vendorRequest.setPhone("9876543210");
        vendorRequest.setAddress("Delhi");
    }

    // ============================================================
    // 1. Create Vendor Successfully
    // ============================================================

    @Test
    void createVendor_ShouldCreateVendor_WhenEmailDoesNotExist() {

        when(vendorRepository.findByEmail("abc@example.com"))
                .thenReturn(Optional.empty());

        when(vendorRepository.save(any(Vendor.class)))
                .thenAnswer(invocation -> {

                    Vendor savedVendor =
                            invocation.getArgument(0);

                    savedVendor.setId(1);

                    return savedVendor;
                });

        VendorResponse response =
                vendorService.createVendor(vendorRequest);

        assertNotNull(response);
        assertEquals(1, response.getId());
        assertEquals("ABC Suppliers", response.getName());
        assertEquals("abc@example.com", response.getEmail());

        verify(vendorRepository)
                .findByEmail("abc@example.com");

        verify(vendorRepository)
                .save(any(Vendor.class));
    }

    // ============================================================
    // 2. Create Vendor - Email Already Exists
    // ============================================================

    @Test
    void createVendor_ShouldThrowException_WhenEmailAlreadyExists() {

        when(vendorRepository.findByEmail("abc@example.com"))
                .thenReturn(Optional.of(vendor));

        ResourceAlreadyExistsException exception =
                assertThrows(
                        ResourceAlreadyExistsException.class,
                        () -> vendorService.createVendor(vendorRequest)
                );

        assertEquals(
                "Vendor with this email already exists.",
                exception.getMessage()
        );

        verify(vendorRepository, never())
                .save(any(Vendor.class));
    }

    // ============================================================
    // 3. Get All Vendors Successfully
    // ============================================================

    @Test
    void getAllVendors_ShouldReturnVendorList() {

        Vendor vendor2 = Vendor.builder()
                .id(2)
                .name("XYZ Suppliers")
                .email("xyz@example.com")
                .phone("9876543211")
                .address("Mumbai")
                .build();

        when(vendorRepository.findAll())
                .thenReturn(List.of(vendor, vendor2));

        List<VendorResponse> response =
                vendorService.getAllVendors();

        assertNotNull(response);
        assertEquals(2, response.size());

        assertEquals(
                "ABC Suppliers",
                response.get(0).getName()
        );

        assertEquals(
                "XYZ Suppliers",
                response.get(1).getName()
        );

        verify(vendorRepository)
                .findAll();
    }

    // ============================================================
    // 4. Update Vendor Successfully
    // ============================================================

    @Test
    void updateVendor_ShouldUpdateVendor_WhenVendorExists() {

        VendorRequest updatedRequest = new VendorRequest();
        updatedRequest.setName("Updated Supplier");
        updatedRequest.setEmail("updated@example.com");
        updatedRequest.setPhone("9999999999");
        updatedRequest.setAddress("Bangalore");

        when(vendorRepository.findById(1))
                .thenReturn(Optional.of(vendor));

        when(vendorRepository.save(any(Vendor.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0)
                );

        VendorResponse response =
                vendorService.updateVendor(
                        1,
                        updatedRequest
                );

        assertNotNull(response);

        assertEquals(
                "Updated Supplier",
                response.getName()
        );

        assertEquals(
                "updated@example.com",
                response.getEmail()
        );

        assertEquals(
                "Bangalore",
                response.getAddress()
        );

        verify(vendorRepository)
                .save(vendor);
    }

    // ============================================================
    // 5. Update Vendor - Not Found
    // ============================================================

    @Test
    void updateVendor_ShouldThrowException_WhenVendorNotFound() {

        when(vendorRepository.findById(1))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> vendorService.updateVendor(
                                1,
                                vendorRequest
                        )
                );

        assertEquals(
                "Vendor not found with id: 1",
                exception.getMessage()
        );

        verify(vendorRepository, never())
                .save(any(Vendor.class));
    }

    // ============================================================
    // 6. Delete Vendor Successfully
    // ============================================================

    @Test
    void deleteVendor_ShouldDeleteVendor_WhenVendorExists() {

        when(vendorRepository.findById(1))
                .thenReturn(Optional.of(vendor));

        vendorService.deleteVendor(1);

        verify(vendorRepository)
                .findById(1);

        verify(vendorRepository)
                .delete(vendor);
    }
}