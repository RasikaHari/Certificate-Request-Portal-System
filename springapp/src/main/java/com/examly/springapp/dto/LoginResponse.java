package com.examly.springapp.dto;

import com.examly.springapp.model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponse {
    private Long id;
    private String name;
    private String email;
    private UserRole role;
    private String phoneNumber;
    private String message;
}
