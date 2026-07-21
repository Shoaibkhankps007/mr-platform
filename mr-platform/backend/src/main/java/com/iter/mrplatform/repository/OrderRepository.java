package com.iter.mrplatform.repository;

import com.iter.mrplatform.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByRepresentativeId(Long repId);
}
