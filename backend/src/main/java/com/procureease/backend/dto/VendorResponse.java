package com.procureease.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class VendorResponse {

    private Integer id;
    private String name;
    private String email;
    private String phone;
    private String address;
}