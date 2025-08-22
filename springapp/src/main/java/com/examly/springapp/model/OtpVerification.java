package com.examly.springapp.model;

import java.time.LocalDateTime;
import javax.persistence.*; // use jakarta.persistence.* if you're on Spring Boot 3
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OtpVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, unique=true)
    private String email;

    @Column(nullable=false, length=6)
    private String otp;

    @Column(nullable=false)
    private LocalDateTime expiryTime;
}
