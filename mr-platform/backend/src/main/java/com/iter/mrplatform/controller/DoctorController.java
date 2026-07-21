package com.iter.mrplatform.controller;

import com.iter.mrplatform.entity.Doctor;
import com.iter.mrplatform.repository.DoctorRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorRepository doctorRepository;

    @GetMapping
    public List<Doctor> all(@RequestParam(required = false) Long territoryId) {
        if (territoryId != null) {
            return doctorRepository.findByTerritoryId(territoryId);
        }
        return doctorRepository.findAll();
    }

    @PostMapping
    public Doctor create(@Valid @RequestBody Doctor doctor) {
        return doctorRepository.save(doctor);
    }
}
