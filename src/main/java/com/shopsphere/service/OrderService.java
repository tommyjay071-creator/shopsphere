package com.shopsphere.service;

import com.shopsphere.cart.Cart;
import com.shopsphere.cart.CartItem;
import com.shopsphere.entity.Product;
import com.shopsphere.order.Order;
import com.shopsphere.order.OrderItem;
import com.shopsphere.order.OrderStatus;
import com.shopsphere.repository.CartRepository;
import com.shopsphere.repository.OrderRepository;
import com.shopsphere.repository.ProductRepository;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public OrderService(
            OrderRepository orderRepository,
            CartRepository cartRepository,
            ProductRepository productRepository) {

        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    private String getCurrentUserEmail() {

        return SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
    }

    @Transactional
    public Order createOrderFromCart(Long cartId) {

        String email = getCurrentUserEmail();

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Cart with id " + cartId + " not found"));

        if (cart.getCustomer() == null ||
                !cart.getCustomer().getEmail().equals(email)) {

            throw new RuntimeException(
                    "You are not authorized to checkout this cart");
        }

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException(
                    "Cannot create order from an empty cart");
        }

        // Check stock before changing anything
        for (CartItem cartItem : cart.getItems()) {

            Product product = cartItem.getProduct();

            if (cartItem.getQuantity() > product.getStock()) {
                throw new RuntimeException(
                        "Not enough stock for product: "
                                + product.getName()
                                + ". Available: "
                                + product.getStock()
                                + ", requested: "
                                + cartItem.getQuantity()
                );
            }
        }

        Order order = new Order();

        order.setCustomer(cart.getCustomer());
        order.setStatus(OrderStatus.PENDING);

        BigDecimal total = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {

            Product product = cartItem.getProduct();

            BigDecimal productPrice =
                    BigDecimal.valueOf(product.getPrice());

            OrderItem orderItem = new OrderItem();

            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(productPrice);

            BigDecimal itemTotal =
                    productPrice.multiply(
                            BigDecimal.valueOf(cartItem.getQuantity())
                    );

            total = total.add(itemTotal);

            product.setStock(
                    product.getStock() - cartItem.getQuantity()
            );

            productRepository.save(product);

            order.addItem(orderItem);
        }

        order.setTotalAmount(total);

        Order savedOrder = orderRepository.save(order);

        cart.getItems().clear();
        cartRepository.save(cart);

        return savedOrder;
    }

    public Order getOrder(Long id) {

        String email = getCurrentUserEmail();

        return orderRepository.findByIdAndCustomerEmail(id, email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order with id " + id + " not found"));
    }

    public List<Order> getAllOrders() {

        String email = getCurrentUserEmail();

        return orderRepository.findByCustomerEmail(email);
    }

    public Order updateOrderStatus(
            Long id,
            OrderStatus status) {

        Order order = getOrder(id);

        order.setStatus(status);

        return orderRepository.save(order);
    }

    public Order cancelOrder(Long id) {

        Order order = getOrder(id);

        order.setStatus(OrderStatus.CANCELLED);

        return orderRepository.save(order);
    }
}