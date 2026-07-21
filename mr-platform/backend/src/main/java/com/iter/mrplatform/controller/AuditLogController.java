package com.iter.mrplatform.controller;

import com.iter.mrplatform.entity.AuditLog;
import com.iter.mrplatform.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public List<AuditLog> recent(@RequestParam(defaultValue = "200") int limit) {
        return auditLogRepository
                .findAll(PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "timestamp")))
                .getContent();
    }
}
