package com.iter.mrplatform.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderRequest {
    @NotNull
    private Long doctorId;
    @NotEmpty
    private List<OrderItemRequest> items;
    private String eSignature;
}
