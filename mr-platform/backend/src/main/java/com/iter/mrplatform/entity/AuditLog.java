package com.iter.mrplatform.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Immutable audit trail entry (EPIC 7: Compliance & Security Enhancements -
 * "audit logging for all CRUD"). One row per authenticated API call that
 * mutates data. Rows are never updated or deleted by application code.
 */
@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    @Column(nullable = false)
    private String actorEmail;

    @Column(nullable = false)
    private String httpMethod;

    @Column(nullable = false)
    private String path;

    @Column(nullable = false)
    private int statusCode;

    private String remoteAddress;
}
