package com.examly.springapp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.examly.springapp.model.CertificateRequest;
import com.examly.springapp.repository.CertificateRequestRepository;

@Service
public class CertificateService {
    private final CertificateRequestRepository repository;

    public CertificateService(CertificateRequestRepository repository)
    {
        this.repository=repository;
    }
    public CertificateRequest addRequest(CertificateRequest request)
    {
        return repository.save(request);
    }

    public List<CertificateRequest>getAllRequests()
    {
        return repository.findAll();
    }
    public boolean approveRequest(Long id)
    {
        Optional<CertificateRequest>optionalRequest=repository.findById(id);
        if(optionalRequest.isPresent())
        {
            CertificateRequest request=optionalRequest.get();
            request.setStatus("APPROVED");
            repository.save(request);
            return true;
        }
        else
        {
            return false;
        }
    }
    public CertificateRequest updateRequestStatus(Long id, String status) {
    Optional<CertificateRequest> optional = repository.findById(id);
    if (optional.isPresent()) {
        CertificateRequest request = optional.get();
        request.setStatus(status);
        return repository.save(request);
    }
    return null;
}
public CertificateRequest getRequestById(Long id) {
    return repository.findById(id).orElseThrow(() -> new RuntimeException("Request not found"));
}



}
