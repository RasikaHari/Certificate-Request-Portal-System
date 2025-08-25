package com.examly.springapp.controller;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.examly.springapp.dto.RequestsTrendResponse;
import com.examly.springapp.dto.UserStatsResponse;
import com.examly.springapp.model.CertificateRequest;
import com.examly.springapp.model.User;
import com.examly.springapp.model.UserRole;
import com.examly.springapp.service.CertificateService;
import com.examly.springapp.service.EmailService;
import com.examly.springapp.service.UserService;
import com.examly.springapp.util.PdfGeneratorUtil;

@RestController
// @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") 
@CrossOrigin(origins = "https://certificate-request-portal.onrender.com", allowCredentials = "true") 
public class ApiController {

    private final CertificateService service;
    private final UserService userService;
    private final EmailService emailService; 

    public ApiController(CertificateService service, UserService userService,EmailService emailService) {
        this.service = service;
        this.userService = userService;
        this.emailService=emailService;
    }

    
    @GetMapping("/loggedInUser")
    public ResponseEntity<User> getLoggedInUser(HttpSession session) {
        Long loggedInUserId = (Long) session.getAttribute("userId");
        if (loggedInUserId == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userService.getUserById(loggedInUserId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(user);
    }

    @PostMapping("/addRequest")
    public ResponseEntity<CertificateRequest> addRequest(@RequestBody CertificateRequest request) {
        Long userId = request.getUser().getId();

        User loggedInUser = userService.getUserById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        request.setUser(loggedInUser);
        request.setStatus("PENDING");
        request.setCreatedAt(LocalDateTime.now());

        CertificateRequest saved = service.addRequest(request);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/getAllRequests")
    public ResponseEntity<List<CertificateRequest>> getAllRequests() {
        return ResponseEntity.ok(service.getAllRequests());
    }

    @GetMapping("/getRequestsByUser/{userId}")
    public ResponseEntity<List<CertificateRequest>> getRequestsByUser(@PathVariable Long userId) {
        List<CertificateRequest> userRequests = service.getRequestsByUserId(userId);
        return ResponseEntity.ok(userRequests);
    }

    @PutMapping("/approveRequest/{id}")
    public ResponseEntity<?> approveRequest(@PathVariable Long id) {
        CertificateRequest request = service.updateRequestStatus(id, "APPROVED");
        // return request != null ? ResponseEntity.ok(request)
        //                        : ResponseEntity.status(404).body("Request not found");
        if (request != null) {
            String subject = "Your Certificate Request is Approved!";
            String body = "Hello " + request.getName() + ",\n\n" +
                          "Good news! Your certificate request for the course \"" +
                          request.getCourse() + "\" has been approved.\n\n" +
                          "You can now download your certificate from the portal.\n\n" +
                          "Best regards,\nOCRPS Team";

            emailService.sendEmail(request.getUser().getEmail(), subject, body);

            return ResponseEntity.ok(request);
        }
        return ResponseEntity.status(404).body("Request not found");
    }

    @PutMapping("/rejectRequest/{id}")
    public ResponseEntity<?> rejectRequest(@PathVariable Long id) {
        CertificateRequest request = service.updateRequestStatus(id, "REJECTED");
        // return request != null ? ResponseEntity.ok(request)
        //                        : ResponseEntity.status(404).body("Request not found");

         if (request != null) {
            String subject = "Your Certificate Request is Rejected";
            String body = "Hello " + request.getName() + ",\n\n" +
                          "We regret to inform you that your certificate request for the course \"" +
                          request.getCourse() + "\" has been rejected.\n\n" +
                          "Please contact the administrator for more details.\n\n" +
                          "Best regards,\nOCRPS Team";

            emailService.sendEmail(request.getUser().getEmail(), subject, body);

            return ResponseEntity.ok(request);
        }
        return ResponseEntity.status(404).body("Request not found");
    }

    @GetMapping("/getDownloadedCertificates/{userId}")
    public ResponseEntity<List<CertificateRequest>> getDownloadedCertificates(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getDownloadedCertificatesByUserId(userId));
    }

    @GetMapping("/students/count")
    public ResponseEntity<Long> getStudentCount() {
        long count = userService.getUserByRole(UserRole.STUDENT).size();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/staff/count")
    public ResponseEntity<Long> getStaffCount() {
        long count = userService.getUserByRole(UserRole.STAFF).size();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/users/{userId}/stats")
    public ResponseEntity<UserStatsResponse> getUserStats(@PathVariable Long userId) {
         User user = userService.getUserById(userId)
                           .orElseThrow(() -> new RuntimeException("User not found"));
        List<CertificateRequest> requests = service.getRequestsByUserId(userId);
         if(user.getRole() == UserRole.ADMIN||user.getRole()==UserRole.STAFF) {
       
        requests = service.getAllRequests();
    } else {
        
        requests = service.getRequestsByUserId(userId);
    }
        int requestedCount = requests.size();
        int pendingCount = (int) requests.stream().filter(r -> "PENDING".equalsIgnoreCase(r.getStatus())).count();
        int approvedCount = (int) requests.stream().filter(r -> "APPROVED".equalsIgnoreCase(r.getStatus())).count();
        int downloadedCount = service.getDownloadedCertificatesByUserId(userId).size();

        List<UserStatsResponse.Activity> allActivity = requests.stream()
            .map(r -> new UserStatsResponse.Activity(r.getStatus(), r.getCourse(), r.getCreatedAt().toString()))
            .toList();

        List<UserStatsResponse.Activity> recentActivity = requests.stream()
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .limit(5)
            .map(r -> new UserStatsResponse.Activity(r.getStatus(), r.getCourse(), r.getCreatedAt().toString()))
            .toList();

        long totalStudents = userService.getUserByRole(UserRole.STUDENT).size();
        long totalStaff = userService.getUserByRole(UserRole.STAFF).size();
        LocalDate today = LocalDate.now();

        long approvedToday = requests.stream()
            .filter(r -> "APPROVED".equalsIgnoreCase(r.getStatus()))
            .filter(r -> r.getUpdatedAt() != null && r.getUpdatedAt().toLocalDate().equals(today))
            .count();

        long rejectedToday = requests.stream()
            .filter(r -> "REJECTED".equalsIgnoreCase(r.getStatus()))
            .filter(r -> r.getUpdatedAt() != null && r.getUpdatedAt().toLocalDate().equals(today))
            .count();

        UserStatsResponse response = new UserStatsResponse();
        response.setRequestedCount(requestedCount);
        response.setPendingCount(pendingCount);
        response.setApprovedCount(approvedCount);
        response.setDownloadedCount(downloadedCount);
        response.setRecentActivity(recentActivity);
        response.setAllActivity(allActivity);
        response.setTotalStudents(totalStudents);
        response.setTotalStaff(totalStaff);
        response.setApprovedToday(approvedToday);
        response.setRejectedToday(rejectedToday);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/requests/trend")
    public ResponseEntity<RequestsTrendResponse> getRequestsTrend() {
        LocalDate today = LocalDate.now();
        LocalDate sevenDaysAgo = today.minusDays(6);
        List<CertificateRequest> allRequests = service.getAllRequests();

        List<String> dates = new java.util.ArrayList<>();
        List<Long> pendingCounts = new java.util.ArrayList<>();
        List<Long> approvedCounts = new java.util.ArrayList<>();
        List<Long> rejectedCounts = new java.util.ArrayList<>();

        for (int i = 0; i < 7; i++) {
            LocalDate date = sevenDaysAgo.plusDays(i);
            dates.add(date.toString());

            long pending = allRequests.stream()
                .filter(r -> "PENDING".equalsIgnoreCase(r.getStatus()))
                .filter(r -> !r.getCreatedAt().toLocalDate().isAfter(date))
                .count();

            long approved = allRequests.stream()
                .filter(r -> "APPROVED".equalsIgnoreCase(r.getStatus()))
                .filter(r -> r.getUpdatedAt() != null && r.getUpdatedAt().toLocalDate().equals(date))
                .count();

            long rejected = allRequests.stream()
                .filter(r -> "REJECTED".equalsIgnoreCase(r.getStatus()))
                .filter(r -> r.getUpdatedAt() != null && r.getUpdatedAt().toLocalDate().equals(date))
                .count();

            pendingCounts.add(pending);
            approvedCounts.add(approved);
            rejectedCounts.add(rejected);
        }

        RequestsTrendResponse response = new RequestsTrendResponse();
        response.setDates(dates);
        response.setPendingCounts(pendingCounts);
        response.setApprovedCounts(approvedCounts);
        response.setRejectedCounts(rejectedCounts);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/generateCertificate/{requestId}")
    public ResponseEntity<InputStreamResource> generateCertificate(@PathVariable Long requestId) {
        CertificateRequest request = service.getRequestById(requestId);

        if (!"APPROVED".equalsIgnoreCase(request.getStatus())) {
            return ResponseEntity.badRequest().build();
        }

        ByteArrayInputStream bis = PdfGeneratorUtil.generateCertificate(
            request.getName(),
            request.getCourse(),
            request.getCompletionDate()
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentDispositionFormData("attachment", "certificate.pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }
}
