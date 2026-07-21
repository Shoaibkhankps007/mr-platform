package com.iter.mrplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LowStockAlert {
    private String productName;
    private int stockOnHand;
    private int reorderThreshold;
}
