package com.procureease.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileResponse {

    private Integer id;

    private String fullName;

    private String email;

    private String role;
}