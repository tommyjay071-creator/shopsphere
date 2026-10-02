package com.shopsphere.controller;

import com.shopsphere.cart.Cart;
import com.shopsphere.service.CartService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carts")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping
    public Cart createCart() {
        return cartService.createCart();
    }

    @GetMapping("/my-cart")
    public Cart getMyCart() {
        return cartService.getMyCart();
    }

    @GetMapping("/{id}")
    public Cart getCart(@PathVariable Long id) {
        return cartService.getCart(id);
    }

    @PutMapping("/{cartId}/items/{itemId}")
public Cart updateItemQuantity(
        @PathVariable Long cartId,
        @PathVariable Long itemId,
        @RequestParam int quantity) {

    return cartService.updateItemQuantity(
            cartId,
            itemId,
            quantity
    );
 }

@DeleteMapping("/{cartId}/items/{itemId}")
public Cart removeItem(
        @PathVariable Long cartId,
        @PathVariable Long itemId) {

    return cartService.removeItem(cartId, itemId);
    }

@DeleteMapping("/{cartId}/items")
public Cart clearCart(@PathVariable Long cartId) {

    return cartService.clearCart(cartId);
    }

    @PostMapping("/{cartId}/items")
    public Cart addProductToCart(
            @PathVariable Long cartId,
            @RequestParam Long productId,
            @RequestParam int quantity) {

        return cartService.addProductToCart(
                cartId,
                productId,
                quantity
        );
    }
}