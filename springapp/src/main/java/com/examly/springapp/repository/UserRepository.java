package com.examly.springapp.repository;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.examly.springapp.model.User;
import com.examly.springapp.model.UserRole;

@Repository
public interface UserRepository extends JpaRepository<User,Long>{
    Optional<User>findByEmail(String email);
    
    boolean existsByEmail(String email);

    List<User>findByRole(UserRole role);

}
