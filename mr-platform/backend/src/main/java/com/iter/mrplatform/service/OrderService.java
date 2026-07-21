package com.iter.mrplatform.service;

import com.iter.mrplatform.dto.OrderItemRequest;
import com.iter.mrplatform.dto.OrderRequest;
import com.iter.mrplatform.entity.*;
import com.iter.mrplatform.repository.DoctorRepository;
import com.iter.mrplatform.repository.OrderRepository;
import com.iter.mrplatform.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final DoctorRepository doctorRepository;
    private final ProductRepository productRepository;
    private final CurrentUserService currentUserService;

    public Order placeOrder(OrderRequest request) {
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found: " + request.getDoctorId()));
        User rep = currentUserService.get();

        Order order = new Order();
        order.setDoctor(doctor);
        order.setRepresentative(rep);
        order.setESignature(request.getESignature());
        order.setAuditLogged(true);

        BigDecimal grandTotal = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new EntityNotFoundException("Product not found: " + itemReq.getProductId()));

            BigDecimal unitPrice = product.getPrice();
            BigDecimal lineSubtotal = unitPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            BigDecimal taxAmount = lineSubtotal
                    .multiply(product.getTaxPercent())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            BigDecimal lineTotal = lineSubtotal.add(taxAmount);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setUnitPrice(unitPrice);
            item.setTaxAmount(taxAmount);
            item.setLineTotal(lineTotal);
            order.getItems().add(item);

            grandTotal = grandTotal.add(lineTotal);

            // Depletion tracking
            product.setStockOnHand(Math.max(0, product.getStockOnHand() - itemReq.getQuantity()));
            productRepository.save(product);
        }

        order.setTotalAmount(grandTotal);
        return orderRepository.save(order);
    }

    public List<Order> myOrders() {
        return orderRepository.findByRepresentativeId(currentUserService.get().getId());
    }

    public List<Order> all() {
        return orderRepository.findAll();
    }
}
