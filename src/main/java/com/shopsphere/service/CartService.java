package com.shopsphere.service;

import com.shopsphere.cart.Cart;
import com.shopsphere.cart.CartItem;
import com.shopsphere.customer.Customer;
import com.shopsphere.entity.Product;
import com.shopsphere.repository.CartRepository;
import com.shopsphere.repository.CustomerRepository;
import com.shopsphere.repository.ProductRepository;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    public CartService(
            CartRepository cartRepository,
            ProductRepository productRepository,
            CustomerRepository customerRepository) {

        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
    }

    private String getCurrentUserEmail() {

        return SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
    }

    public Cart getCart(Long cartId) {

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Cart with id " + cartId + " not found"));

        String email = getCurrentUserEmail();

        if (cart.getCustomer() == null ||
                !cart.getCustomer().getEmail().equals(email)) {

            throw new RuntimeException(
                    "You are not authorized to access this cart");
        }

        return cart;
    }

    public Cart createCart() {

        String email = getCurrentUserEmail();

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Customer not found"));

        if (cartRepository.findByCustomerEmail(email).isPresent()) {
            throw new RuntimeException(
                    "Customer already has a cart");
        }

        Cart cart = new Cart();

        cart.setCustomer(customer);

        return cartRepository.save(cart);
    }

    public Cart getMyCart() {

    String email = getCurrentUserEmail();

    return cartRepository.findByCustomerEmail(email)
            .orElseThrow(() ->
                    new RuntimeException(
                            "Customer does not have a cart"));
}

    public Cart addProductToCart(
            Long cartId,
            Long productId,
            int quantity) {

        if (quantity <= 0) {
            throw new IllegalArgumentException(
                    "Quantity must be greater than zero");
        }

        Cart cart = getCart(cartId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product with id " + productId + " not found"));

        for (CartItem item : cart.getItems()) {

            if (item.getProduct().getId().equals(productId)) {

                item.setQuantity(item.getQuantity() + quantity);

                return cartRepository.save(cart);
            }
        }

        CartItem newItem = new CartItem();

        newItem.setProduct(product);
        newItem.setQuantity(quantity);

        cart.addItem(newItem);

        return cartRepository.save(cart);
    }

    public Cart updateItemQuantity(
            Long cartId,
            Long itemId,
            int quantity) {

        if (quantity <= 0) {
            throw new IllegalArgumentException(
                    "Quantity must be greater than zero");
        }

        Cart cart = getCart(cartId);

        CartItem item = cart.getItems()
                .stream()
                .filter(cartItem ->
                        cartItem.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException(
                                "Cart item with id " + itemId + " not found"));

        item.setQuantity(quantity);

        return cartRepository.save(cart);
    }

    public Cart removeItem(
            Long cartId,
            Long itemId) {

        Cart cart = getCart(cartId);

        CartItem item = cart.getItems()
                .stream()
                .filter(cartItem ->
                        cartItem.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException(
                                "Cart item with id " + itemId + " not found"));

        cart.removeItem(item);

        return cartRepository.save(cart);
    }

    public Cart clearCart(Long cartId) {

        Cart cart = getCart(cartId);

        cart.getItems().clear();

        return cartRepository.save(cart);
    }
}