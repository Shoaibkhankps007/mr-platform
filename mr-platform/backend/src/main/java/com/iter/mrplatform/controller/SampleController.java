package com.iter.mrplatform.controller;

import com.iter.mrplatform.dto.SampleRequest;
import com.iter.mrplatform.entity.Sample;
import com.iter.mrplatform.service.SampleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/samples")
@RequiredArgsConstructor
public class SampleController {

    private final SampleService sampleService;

    @PostMapping
    public Sample issue(@Valid @RequestBody SampleRequest request) {
        return sampleService.issueSample(request);
    }

    @GetMapping("/mine")
    public List<Sample> mine() {
        return sampleService.mySamples();
    }

    @GetMapping
    public List<Sample> all() {
        return sampleService.all();
    }
}
