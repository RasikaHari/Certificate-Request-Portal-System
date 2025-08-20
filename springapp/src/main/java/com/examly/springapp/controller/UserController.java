package com.examly.springapp.controller;

import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.examly.springapp.dto.LoginRequest;
import com.examly.springapp.dto.LoginResponse;
import com.examly.springapp.model.User;
import com.examly.springapp.model.UserRole;
import com.examly.springapp.service.EmailService;
import com.examly.springapp.service.UserService;

@RestController

@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    private final EmailService emailService;
    public UserController(UserService userService,EmailService emailService)
    {
        this.userService=userService;
        this.emailService=emailService;
    }
    @PostMapping("/register")
    public ResponseEntity<String>registerUser(@RequestBody User user)
    {
        try
        {
            boolean success=userService.registerUser(user);
            if(success)
            {
                emailService.sendEmail(
                user.getEmail(),
                "Welcome to OCRPS",
                "Hello " + user.getName() + ",\n\nThank you for registering with OCRPS!"
            );
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

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest, HttpSession session) {
        boolean success = userService.login(loginRequest.getEmail(), loginRequest.getPassword());
        if (success) {
            User user = userService.getUSersByemail(loginRequest.getEmail()).get();
            
            session.setAttribute("userId", user.getId());

            LoginResponse response = new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getPhoneNumber(),
                "Login successful."
            );

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body("Invalid email or password.");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> userOptional = userService.getUserById(id);
        return userOptional
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body("User not found."));
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<?> getUsersByRole(@PathVariable UserRole role) {
        List<User> users = userService.getUserByRole(role);
        return ResponseEntity.ok(users);
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        Optional<User> optionalUser = userService.getUserById(id);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            user.setName(updatedUser.getName());
            user.setEmail(updatedUser.getEmail());
            user.setPhoneNumber(updatedUser.getPhoneNumber());
            user.setRole(updatedUser.getRole());

            User savedUser = userService.saveUpdatedUser(user); 
            return ResponseEntity.ok(savedUser);  
        } else {
            return ResponseEntity.status(404).body("User not found.");
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
    Optional<User> optionalUser = userService.getUserById(id);

    if (optionalUser.isPresent()) {
        userService.deleteUserById(id); 
        return ResponseEntity.ok("User deleted successfully.");
    } else {
        return ResponseEntity.status(404).body("User not found.");
    }
    }

    @PostMapping("/logout")
public ResponseEntity<String> logout(HttpSession session) {
    session.invalidate(); 
    return ResponseEntity.ok("Logged out successfully.");
}



}
