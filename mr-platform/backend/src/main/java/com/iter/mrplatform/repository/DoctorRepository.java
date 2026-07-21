package com.iter.mrplatform.repository;

import com.iter.mrplatform.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findByTerritoryId(Long territoryId);
}
