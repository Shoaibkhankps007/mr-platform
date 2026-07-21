package com.iter.mrplatform.service;

import com.iter.mrplatform.dto.DashboardSummary;
import com.iter.mrplatform.dto.LowStockAlert;
import com.iter.mrplatform.entity.Order;
import com.iter.mrplatform.entity.Product;
import com.iter.mrplatform.entity.Visit;
import com.iter.mrplatform.repository.DoctorRepository;
import com.iter.mrplatform.repository.OrderRepository;
import com.iter.mrplatform.repository.ProductRepository;
import com.iter.mrplatform.repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Lightweight manager analytics (EPIC 5 preview) built directly on top of
 * the core eDCR / Orders / Samples data so managers get immediate visibility
 * without waiting for the full analytics epic.
 */
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final VisitRepository visitRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final DoctorRepository doctorRepository;

    public DashboardSummary summary() {
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime now = LocalDateTime.now();

        List<Visit> visitsToday = visitRepository.findByCreatedAtBetween(startOfToday, now);
        List<Visit> visitsThisMonth = visitRepository.findByCreatedAtBetween(startOfMonth, now);

        long totalDoctorsInScope = doctorRepository.count();
        Set<Long> uniqueDoctorsVisited = visitsThisMonth.stream()
                .map(v -> v.getDoctor().getId())
                .collect(Collectors.toSet());
        double reachPercent = totalDoctorsInScope == 0 ? 0.0
                : (uniqueDoctorsVisited.size() * 100.0) / totalDoctorsInScope;

        List<Order> allOrders = orderRepository.findAll();
        List<Order> ordersThisMonth = allOrders.stream()
                .filter(o -> !o.getOrderDate().isBefore(startOfMonth))
                .collect(Collectors.toList());
        double orderValueThisMonth = ordersThisMonth.stream()
                .mapToDouble(o -> o.getTotalAmount().doubleValue())
                .sum();

        List<LowStockAlert> lowStock = productRepository.findAll().stream()
                .filter(p -> p.getStockOnHand() <= p.getReorderThreshold())
                .map(p -> new LowStockAlert(p.getName(), p.getStockOnHand(), p.getReorderThreshold()))
                .collect(Collectors.toList());

        var visitsByRep = visitsThisMonth.stream()
                .collect(Collectors.groupingBy(v -> v.getRepresentative().getName(), Collectors.counting()));

        return new DashboardSummary(
                visitsToday.size(),
                visitsThisMonth.size(),
                Math.round(reachPercent * 100.0) / 100.0,
                ordersThisMonth.size(),
                Math.round(orderValueThisMonth * 100.0) / 100.0,
                lowStock,
                visitsByRep
        );
    }
}
