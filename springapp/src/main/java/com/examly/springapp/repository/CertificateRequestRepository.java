package com.examly.springapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.examly.springapp.model.CertificateRequest;
@Repository
public interface CertificateRequestRepository extends JpaRepository<CertificateRequest,Long>{
    List<CertificateRequest> findByUserId(Long userId);
    List<CertificateRequest> findByUserIdAndStatus(Long userId, String status);
}
