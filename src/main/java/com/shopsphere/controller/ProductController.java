package com.shopsphere.controller;

import com.shopsphere.dto.ProductPageResponse;
import com.shopsphere.dto.ProductRequest;
import com.shopsphere.dto.ProductResponse;
import com.shopsphere.service.ProductService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ProductPageResponse getAllProducts(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String category,
        Pageable pageable) {

    return productService.getAllProducts(
            search,
            category,
            pageable
    );
}

    @GetMapping("/search")
    public ProductPageResponse searchProducts(
        @RequestParam String name,
        Pageable pageable) {

    return productService.searchProducts(name, pageable);
    }

    @GetMapping("/category/{category}")
    public ProductPageResponse getProductsByCategory(
        @PathVariable String category,
        Pageable pageable) {

    return productService.getProductsByCategory(category, pageable);
}

    @GetMapping("/{id}")
    public ProductResponse getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @PostMapping
    public ProductResponse createProduct(
            @Valid @RequestBody ProductRequest request) {

        return productService.createProduct(request);
    }

    @PutMapping("/{id}")
    public ProductResponse updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {

        return productService.updateProduct(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }
}