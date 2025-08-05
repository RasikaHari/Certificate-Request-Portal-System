package com.examly.springapp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.examly.springapp.model.User;
import com.examly.springapp.model.UserRole;
import com.examly.springapp.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,PasswordEncoder passwordEncoder)
    {
        this.userRepository=userRepository;
        this.passwordEncoder=passwordEncoder;
    }
    public boolean registerUser(User user)
    {
        if(userRepository.existsByEmail(user.getEmail()))
        {
            return false;
        }
        String encodedPassword=passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        userRepository.save(user);
        return true;
    }
    public boolean login(String email,String rawPassword)
    {
        Optional<User> optionalUser=userRepository.findByEmail(email);
        if(optionalUser.isPresent())
        {
            User user=optionalUser.get();
            return  passwordEncoder.matches(rawPassword, user.getPassword());
        }
        return false;
    }
    public Optional<User>getUserById(Long id)
    {
        return userRepository.findById(id);
    }
    public Optional<User>getUSersByemail(String email)
    {
        return userRepository.findByEmail(email);
    }
    public List<User>getUserByRole(UserRole role)
    {
        return userRepository.findByRole(role);
    }
}
