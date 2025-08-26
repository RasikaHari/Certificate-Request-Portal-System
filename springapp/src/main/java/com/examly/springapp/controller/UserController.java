package com.examly.springapp.controller;

import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.dto.AdminCreateUserRequest;
import com.examly.springapp.dto.ChangePasswordRequest;
import com.examly.springapp.dto.LoginRequest;
import com.examly.springapp.dto.LoginResponse;
import com.examly.springapp.dto.RegisterRequest;
import com.examly.springapp.model.User;
import com.examly.springapp.model.UserRole;
import com.examly.springapp.service.EmailService;
import com.examly.springapp.service.UserService;
import com.examly.springapp.service.OtpService;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    private final EmailService emailService;
    private final OtpService otpService;

    public UserController(UserService userService, EmailService emailService, OtpService otpService) {
        this.userService = userService;
        this.emailService = emailService;
        this.otpService = otpService;
    }

    
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest request) {
         if (request.getRole() == UserRole.ADMIN) {
        return ResponseEntity.badRequest().body("Admin Registeration.");
    }
        try {
            if (!request.getPassword().equals(request.getConfirmPassword())) {
                return ResponseEntity.badRequest().body("Passwords do not match");
            }

            if (userService.getUSersByemail(request.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email already exists");
            }

            try {
                otpService.generateAndSendOtp(request.getEmail(), request.getName());
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("No such email exists or cannot receive messages.");
            }

            return ResponseEntity.ok("OTP sent to email. Please verify within 5 minutes.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Something went wrong: " + e.getMessage());
        }
    }

    
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtpAndCreateUser(
            @RequestParam String otp,
            @RequestBody RegisterRequest request) {
        try {
            boolean valid = otpService.validateAndConsumeOtp(request.getEmail(), otp);
            if (!valid) {
                return ResponseEntity.badRequest().body("Invalid or expired OTP.");
            }

            if (userService.getUSersByemail(request.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email already exists");
            }

            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPhoneNumber(request.getPhoneNumber());
            user.setRole(request.getRole());

            
            userService.saveNewUser(user, request.getPassword());

            try {
                emailService.sendEmail(
                        user.getEmail(),
                        "Welcome to OCRPS",
                        "Hello " + user.getName() + ",\n\nThank you for registering with OCRPS!"
                );
            } catch (Exception e) {
                System.err.println("Failed to send welcome email: " + e.getMessage());
            }

            return ResponseEntity.ok("User registered successfully.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Something went wrong: " + e.getMessage());
        }
    }

   
    @PostMapping("/resend-otp")
    public ResponseEntity<String> resendOtp(@RequestParam String email, @RequestParam(required=false) String name) {
        try {
            if (userService.getUSersByemail(email).isPresent()) {
                return ResponseEntity.badRequest().body("Email already registered.");
            }

            try {
                otpService.resendOtp(email, name);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Failed to send OTP. Please check the email address.");
            }

            return ResponseEntity.ok("A new OTP has been sent to your email.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Something went wrong: " + e.getMessage());
        }
    }

    
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        Optional<User> userOptional = userService.getUSersByemail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Email not registered.");
        }

        try {
            otpService.generateAndSendOtp(email, userOptional.get().getName());
            return ResponseEntity.ok("Password reset OTP sent to email.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to send OTP: " + e.getMessage());
        }
    }

    
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestParam String email,
            @RequestParam String otp,
            @RequestParam String newPassword) {

        Optional<User> userOptional = userService.getUSersByemail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Email not registered.");
        }

        boolean validOtp = otpService.validateAndConsumeOtp(email, otp);
        if (!validOtp) {
            return ResponseEntity.badRequest().body("Invalid or expired OTP.");
        }

        try {
            User user = userOptional.get();
            userService.saveUpdatedUser(user, newPassword); // hash inside service
            return ResponseEntity.ok("Password updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to reset password: " + e.getMessage());
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

   @PostMapping("/admin/create")
public ResponseEntity<String> createUserByAdmin(@RequestBody AdminCreateUserRequest request) {
    try {
        if (userService.getUSersByemail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(request.getRole());

        // Default password for admin-created users
        userService.saveNewUser(user, "123456");

        // 🔹 Send welcome email
        try {
            emailService.sendEmail(
                user.getEmail(),
                "Welcome to OCRPS",
                "Hello " + user.getName() + ",\n\n" +
                "Your account has been created by the administrator.\n" +
                "Role: " + user.getRole() + "\n" +
                "Default Password: 123456\n\n" +
                "Please log in and change your password immediately for security.\n\n" +
                "Welcome aboard!\n\n" +
                "— OCRPS Team"
            );
        } catch (Exception e) {
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }

        return ResponseEntity.ok(
            "User created successfully with default password 123456. " +
            "A welcome email has been sent to " + user.getEmail()
        );
    } catch (Exception e) {
        return ResponseEntity.internalServerError().body("Something went wrong: " + e.getMessage());
    }
}

 @PostMapping("/{id}/change-password")
    public ResponseEntity<String> changePassword(
            @PathVariable Long id,
            @RequestBody ChangePasswordRequest request) {
        String message = userService.changePassword(id, request);
        return ResponseEntity.ok(message);
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
