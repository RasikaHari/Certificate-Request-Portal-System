package com.examly.springapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.examly.springapp.model.User;
import com.examly.springapp.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    public UserController(UserService userService)
    {
        this.userService=userService;
    }
    @PostMapping("/register")
    public ResponseEntity<String>registerUser(@RequestBody User user)
    {
        try
        {
            boolean success=userService.registerUser(user);
            if(success)
            {
                return ResponseEntity.ok("User Registered successfully.");
            }
            else
            {
                return ResponseEntity.badRequest().body("Email already exists");
            }
        }
        catch(Exception e)
        {
            return ResponseEntity.internalServerError().body("Something went wrong"+e.getMessage());
        }
    }
}
