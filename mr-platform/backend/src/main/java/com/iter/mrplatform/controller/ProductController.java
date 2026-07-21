package com.iter.mrplatform.controller;

import com.iter.mrplatform.entity.Product;
import com.iter.mrplatform.repository.ProductRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;

    @GetMapping
    public List<Product> all() {
        return productRepository.findAll();
    }

    @PostMapping
    public Product create(@Valid @RequestBody Product product) {
        return productRepository.save(product);
    }
}
