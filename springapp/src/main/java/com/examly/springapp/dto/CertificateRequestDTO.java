package com.examly.springapp.dto;

import lombok.Data;

@Data
public class CertificateRequestDTO {
    private String certificateType;
    private String reason;
    private String status;
    private int userId;
}
