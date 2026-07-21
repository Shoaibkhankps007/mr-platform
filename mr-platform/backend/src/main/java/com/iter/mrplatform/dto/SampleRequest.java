package com.iter.mrplatform.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class SampleRequest {
    @NotNull
    private Long doctorId;
    @NotNull
    private Long productId;
    @NotBlank
    private String batchNumber;
    @NotNull
    private LocalDate expiryDate;
    @Min(1)
    private int quantity;
    private String consentSignature;
}
