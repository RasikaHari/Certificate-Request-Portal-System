package com.examly.springapp.dto;

import com.examly.springapp.model.UserRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminCreateUserRequest {
    private String name;
    private String email;
    private String phoneNumber;
    private UserRole role;
}
