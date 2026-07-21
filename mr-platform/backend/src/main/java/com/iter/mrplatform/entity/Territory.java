package com.iter.mrplatform.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "territories")
@Getter
@Setter
@NoArgsConstructor
public class Territory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String region;

    @ManyToOne
    @JoinColumn(name = "manager_id")
    @JsonIgnore
    private User manager;

    @OneToMany(mappedBy = "territory")
    @JsonIgnore
    private Set<User> representatives = new HashSet<>();

    @OneToMany(mappedBy = "territory")
    @JsonIgnore
    private Set<Doctor> doctors = new HashSet<>();
}
