package com.iter.mrplatform.config;

import com.iter.mrplatform.entity.AuditLog;
import com.iter.mrplatform.repository.AuditLogRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.annotation.Order;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;

/**
 * Runs after JwtAuthFilter (so SecurityContext is populated) and logs every
 * mutating request (POST/PUT/PATCH/DELETE) under /api/** to the immutable
 * audit_logs table. Satisfies EPIC 7's "audit logging for all CRUD"
 * requirement without scattering logging calls through every service.
 */
@Component
@Order(50)
@RequiredArgsConstructor
public class AuditLoggingFilter extends OncePerRequestFilter {

    private static final Set<String> AUDITED_METHODS = Set.of("POST", "PUT", "PATCH", "DELETE");

    private final AuditLogRepository auditLogRepository;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                     @NonNull HttpServletResponse response,
                                     @NonNull FilterChain filterChain) throws ServletException, IOException {
        filterChain.doFilter(request, response);

        String path = request.getRequestURI();
        if (!path.startsWith("/api/") || !AUDITED_METHODS.contains(request.getMethod())) {
            return;
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String actor = (auth != null && auth.isAuthenticated()) ? auth.getName() : "anonymous";

        AuditLog log = new AuditLog();
        log.setActorEmail(actor);
        log.setHttpMethod(request.getMethod());
        log.setPath(path);
        log.setStatusCode(response.getStatus());
        log.setRemoteAddress(request.getRemoteAddr());
        auditLogRepository.save(log);
    }
}
