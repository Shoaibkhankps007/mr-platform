package com.iter.mrplatform.repository;

import com.iter.mrplatform.entity.Visit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface VisitRepository extends JpaRepository<Visit, Long> {
    List<Visit> findByRepresentativeId(Long repId);
    List<Visit> findByRepresentativeIdAndCreatedAtBetween(Long repId, LocalDateTime start, LocalDateTime end);
    List<Visit> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
