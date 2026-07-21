package com.iter.mrplatform.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VisitCheckInRequest {
    @NotNull
    private Long doctorId;
    @NotNull
    private Double latitude;
    @NotNull
    private Double longitude;
}
