package com.procureease.backend.controller;

import com.procureease.backend.service.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class UploadController {

    private final UploadService uploadService;

    // ============================================================
    // Upload Product Image
    // ============================================================

    @PostMapping("/product-image")
    public ResponseEntity<?> uploadProductImage(
            @RequestParam("productImage")
            MultipartFile productImage
    ) {
        try {

            UploadService.UploadResult result =
                    uploadService.uploadProductImage(
                            productImage
                    );

            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message",
                            "Product image uploaded successfully.",
                            "file",
                            result.fileName(),
                            "path",
                            result.path()
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    e.getMessage()
                            )
                    );

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }

    // ============================================================
    // Upload Invoice
    // ============================================================

    @PostMapping("/invoice")
    public ResponseEntity<?> uploadInvoice(
            @RequestParam("invoice")
            MultipartFile invoice
    ) {
        try {

            UploadService.UploadResult result =
                    uploadService.uploadInvoice(
                            invoice
                    );

            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message",
                            "Invoice uploaded successfully.",
                            "file",
                            result.fileName(),
                            "path",
                            result.path()
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    e.getMessage()
                            )
                    );

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }
}