package com.iter.mrplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
@AllArgsConstructor
public class DashboardSummary {
    private long totalVisitsToday;
    private long totalVisitsThisMonth;
    private double doctorReachPercent; // unique doctors visited / total doctors in scope
    private long totalOrdersThisMonth;
    private double totalOrderValueThisMonth;
    private List<LowStockAlert> lowStockAlerts;
    private Map<String, Long> visitsByRepresentative;
}
