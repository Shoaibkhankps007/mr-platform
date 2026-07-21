package com.iter.mrplatform.controller;

import com.iter.mrplatform.dto.VisitCheckInRequest;
import com.iter.mrplatform.dto.VisitCheckOutRequest;
import com.iter.mrplatform.entity.Visit;
import com.iter.mrplatform.service.VisitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visits")
@RequiredArgsConstructor
public class VisitController {

    private final VisitService visitService;

    @PostMapping("/check-in")
    public Visit checkIn(@Valid @RequestBody VisitCheckInRequest request) {
        return visitService.checkIn(request);
    }

    @PostMapping("/{id}/check-out")
    public Visit checkOut(@PathVariable Long id, @Valid @RequestBody VisitCheckOutRequest request) {
        return visitService.checkOut(id, request);
    }

    @GetMapping("/mine")
    public List<Visit> mine() {
        return visitService.myVisits();
    }

    @GetMapping
    public List<Visit> all() {
        return visitService.all();
    }
}
