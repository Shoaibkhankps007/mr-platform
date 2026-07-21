package com.iter.mrplatform.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class VisitCheckOutRequest {
    @NotNull
    private Double latitude;
    @NotNull
    private Double longitude;
    private List<String> productsDiscussed;
    private String notes;
    /** true = submit final report, false = save as draft */
    private boolean submit = true;
}
