package com.iter.mrplatform.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "doctors")
@Getter
@Setter
@NoArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String specialization;

    private String hospitalOrPharmacy;

    private String phone;

    private String address;

    private Double latitude;

    private Double longitude;

    @ManyToOne
    @JoinColumn(name = "territory_id", nullable = false)
    private Territory territory;

    @Column(nullable = false)
    private boolean consentOnFile = false;
}
