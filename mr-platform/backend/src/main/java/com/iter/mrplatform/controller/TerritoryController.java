package com.iter.mrplatform.controller;

import com.iter.mrplatform.entity.Territory;
import com.iter.mrplatform.repository.TerritoryRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/territories")
@RequiredArgsConstructor
public class TerritoryController {

    private final TerritoryRepository territoryRepository;

    @GetMapping
    public List<Territory> all() {
        return territoryRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public Territory create(@Valid @RequestBody Territory territory) {
        return territoryRepository.save(territory);
    }
}
