package com.iter.mrplatform.controller;

import com.iter.mrplatform.dto.OrderRequest;
import com.iter.mrplatform.entity.Order;
import com.iter.mrplatform.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public Order place(@Valid @RequestBody OrderRequest request) {
        return orderService.placeOrder(request);
    }

    @GetMapping("/mine")
    public List<Order> mine() {
        return orderService.myOrders();
    }

    @GetMapping
    public List<Order> all() {
        return orderService.all();
    }
}
