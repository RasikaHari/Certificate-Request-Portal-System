package com.examly.springapp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.examly.springapp.dto.ChangePasswordRequest;
import com.examly.springapp.model.User;
import com.examly.springapp.model.UserRole;
import com.examly.springapp.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Save new user with hashed password
    public boolean saveNewUser(User user, String rawPassword) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return false;
        }
        String encodedPassword = passwordEncoder.encode(rawPassword);
        user.setPassword(encodedPassword);
        userRepository.save(user);
        return true;
    }

    // Login: check raw password against hashed password
    public boolean login(String email, String rawPassword) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            return passwordEncoder.matches(rawPassword, user.getPassword());
        }
        return false;
    }
private boolean isValidPassword(String password) {
    // At least 8 chars, one upper, one lower, one digit, one special char
    String regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
    return password.matches(regex);
}

   public String changePassword(Long userId, ChangePasswordRequest request) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // 1. Check newPassword == confirmPassword
    if (!request.getNewPassword().equals(request.getConfirmPassword())) {
        throw new RuntimeException("New password and Confirm password do not match");
    }

    // 2. Validate current password
    if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
        throw new RuntimeException("Current password is incorrect");
    }

    // 3. Check password policy
    if (!isValidPassword(request.getNewPassword())) {
        throw new RuntimeException(
            "Password must be at least 8 characters long, contain uppercase, lowercase, a number, and a special character."
        );
    }

    // 4. Save new password
    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);

    return "Password changed successfully!";
}


    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUSersByemail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getUserByRole(UserRole role) {
        return userRepository.findByRole(role);
    }

    // Update user details without changing password
    public User saveUpdatedUser(User user) {
        return userRepository.save(user);
    }

    // Update password with hashing
    public User saveUpdatedUser(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }

    public void deleteUserById(Long id) {
        userRepository.deleteById(id);
    }
}
