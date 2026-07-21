package com.iter.mrplatform.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Electronic Doctor Call Report (eDCR).
 * Captures a single field visit by an MR to a doctor/HCP, with GPS-based
 * geofence validation and offline-friendly draft/submit workflow.
 */
@Entity
@Table(name = "visits")
@Getter
@Setter
@NoArgsConstructor
public class Visit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @ManyToOne(optional = false)
    @JoinColumn(name = "mr_id")
    private User representative;

    private LocalDateTime checkInTime;
    private Double checkInLat;
    private Double checkInLng;

    private LocalDateTime checkOutTime;
    private Double checkOutLat;
    private Double checkOutLng;

    /** Distance in meters between check-in point and doctor's registered location. */
    private Double geofenceDistanceMeters;

    @Column(nullable = false)
    private boolean withinGeofence = false;

    @ElementCollection
    @CollectionTable(name = "visit_products_discussed", joinColumns = @JoinColumn(name = "visit_id"))
    @Column(name = "product_name")
    private List<String> productsDiscussed = new ArrayList<>();

    @Column(length = 2000)
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VisitStatus status = VisitStatus.DRAFT;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
