package com.examly.springapp.dto;

import com.examly.springapp.model.UserRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String name;
    private String email;
    private String phoneNumber;
    private String password;
    private String confirmPassword; // only for validation, not persisted
    private UserRole role;
}
