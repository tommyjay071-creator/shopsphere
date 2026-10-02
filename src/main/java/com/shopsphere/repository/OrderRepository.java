package com.shopsphere.repository;

import com.shopsphere.order.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByIdAndCustomerEmail(Long id, String email);

    List<Order> findByCustomerEmail(String email);
}