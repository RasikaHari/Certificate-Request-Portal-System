package com.examly.springapp.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import com.examly.springapp.model.OtpVerification;
import com.examly.springapp.repository.OtpVerificationRepository;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpVerificationRepository otpRepo;
    private final EmailService emailService;

    // Generate a 6-digit OTP, save or update with 5-min expiry, and email it
    @Transactional
    public void generateAndSendOtp(String email, String nameForEmail) {
        String otp = String.format("%06d", new SecureRandom().nextInt(1_000_000));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(5);

        // Update existing OTP if present, else create new
        Optional<OtpVerification> existingOpt = otpRepo.findByEmail(email);

        OtpVerification entity;
        if (existingOpt.isPresent()) {
            entity = existingOpt.get();
            entity.setOtp(otp);
            entity.setExpiryTime(expiry);
        } else {
            entity = new OtpVerification();
            entity.setEmail(email);
            entity.setOtp(otp);
            entity.setExpiryTime(expiry);
        }

        otpRepo.save(entity); // save or update in a single transaction

        // Send OTP email
        String subject = "Your OTP Code";
        String body = "Hello " + (nameForEmail == null ? "" : nameForEmail) + "\n\n"
                + "Your OTP for registration is: " + otp + "\n"
                + "It is valid for 5 minutes.";
        emailService.sendEmail(email, subject, body);
    }

    // Validate an OTP (also deletes on success)
    @Transactional
    public boolean validateAndConsumeOtp(String email, String otp) {
        Optional<OtpVerification> rec = otpRepo.findByEmail(email);
        if (rec.isEmpty()) return false;

        OtpVerification entity = rec.get();
        boolean notExpired = entity.getExpiryTime().isAfter(LocalDateTime.now());
        boolean matches = entity.getOtp().equals(otp);

        if (matches && notExpired) {
            otpRepo.delete(entity); // delete after successful verification
            return true;
        }
        return false;
    }

    // Resend OTP (simply regenerates it)
    @Transactional
    public void resendOtp(String email, String nameForEmail) {
        generateAndSendOtp(email, nameForEmail);
    }
}
