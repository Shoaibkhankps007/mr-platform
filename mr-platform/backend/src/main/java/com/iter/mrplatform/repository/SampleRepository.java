package com.iter.mrplatform.repository;

import com.iter.mrplatform.entity.Sample;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SampleRepository extends JpaRepository<Sample, Long> {
    List<Sample> findByRepresentativeId(Long repId);
    List<Sample> findByProductId(Long productId);
}
