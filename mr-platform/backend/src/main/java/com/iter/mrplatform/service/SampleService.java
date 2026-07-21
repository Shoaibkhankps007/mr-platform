package com.iter.mrplatform.service;

import com.iter.mrplatform.dto.SampleRequest;
import com.iter.mrplatform.entity.Doctor;
import com.iter.mrplatform.entity.Product;
import com.iter.mrplatform.entity.Sample;
import com.iter.mrplatform.entity.User;
import com.iter.mrplatform.repository.DoctorRepository;
import com.iter.mrplatform.repository.ProductRepository;
import com.iter.mrplatform.repository.SampleRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SampleService {

    private final SampleRepository sampleRepository;
    private final DoctorRepository doctorRepository;
    private final ProductRepository productRepository;
    private final CurrentUserService currentUserService;

    public Sample issueSample(SampleRequest request) {
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found: " + request.getDoctorId()));
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Product not found: " + request.getProductId()));
        User rep = currentUserService.get();

        Sample sample = new Sample();
        sample.setDoctor(doctor);
        sample.setProduct(product);
        sample.setRepresentative(rep);
        sample.setBatchNumber(request.getBatchNumber());
        sample.setExpiryDate(request.getExpiryDate());
        sample.setQuantity(request.getQuantity());
        sample.setConsentSignature(request.getConsentSignature());

        // Compliance log + stock depletion
        product.setStockOnHand(Math.max(0, product.getStockOnHand() - request.getQuantity()));
        productRepository.save(product);

        return sampleRepository.save(sample);
    }

    public List<Sample> mySamples() {
        return sampleRepository.findByRepresentativeId(currentUserService.get().getId());
    }

    public List<Sample> all() {
        return sampleRepository.findAll();
    }
}
