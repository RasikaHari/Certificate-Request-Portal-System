package com.examly.springapp.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.examly.springapp.dto.LoginRequest;
import com.examly.springapp.dto.LoginResponse;
import com.examly.springapp.model.CertificateRequest;
import com.examly.springapp.model.User;
import com.examly.springapp.service.CertificateService;
import com.examly.springapp.service.UserService;

@RestController
@CrossOrigin("*")
public class ApiController {
    private final CertificateService service;
    private final UserService userService;

    public ApiController(CertificateService service,UserService userService)
    {
        this.service=service;
        this.userService=userService;
    }
    @PostMapping("/addRequest")
    public ResponseEntity<CertificateRequest>addRequest(@RequestBody CertificateRequest request)
    {
        CertificateRequest saved=service.addRequest(request);
        return ResponseEntity.ok(saved);
    }
    @GetMapping("/getAllRequests")
    public ResponseEntity<List<CertificateRequest>>getAllRequests()
    {
        return ResponseEntity.ok(service.getAllRequests());
    }

    // @PutMapping("/approveRequest/{id}")
    // public ResponseEntity<String>approveRequest(@PathVariable Long id)
    // {
    //     boolean approved=service.approveRequest(id);
    //     if(approved)
    //     {
    //         return ResponseEntity.ok("Request approved");
    //     }
    //     else
    //     {
    //         return ResponseEntity.status(404).body("Request not found");
    //     }
    // }
    @PutMapping("/approveRequest/{id}")
public ResponseEntity<?> approveRequest(@PathVariable Long id) {
    CertificateRequest request = service.updateRequestStatus(id, "APPROVED");
    if (request != null) {
        return ResponseEntity.ok(request);
    } else {
        return ResponseEntity.status(404).body("Request not found");
    }
}

@PutMapping("/rejectRequest/{id}")
public ResponseEntity<?> rejectRequest(@PathVariable Long id) {
    CertificateRequest request = service.updateRequestStatus(id, "REJECTED");
    if (request != null) {
        return ResponseEntity.ok(request);
    } else {
        return ResponseEntity.status(404).body("Request not found");
    }
}

}
