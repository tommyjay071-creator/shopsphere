package com.shopsphere.service;

import com.shopsphere.dto.ProductRequest;
import com.shopsphere.dto.ProductResponse;
import com.shopsphere.dto.ProductPageResponse;
import com.shopsphere.entity.Product;
import com.shopsphere.exception.ProductNotFoundException;
import com.shopsphere.mapper.ProductMapper;
import com.shopsphere.repository.ProductRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public ProductService(
            ProductRepository productRepository,
            ProductMapper productMapper) {

        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }

   public ProductPageResponse getAllProducts(
        String search,
        String category,
        Pageable pageable) {

    Page<Product> productPage;

    if (search != null && !search.isBlank()
            && category != null && !category.isBlank()) {

        productPage = productRepository
                .findByNameContainingIgnoreCaseAndCategory(
                        search,
                        category,
                        pageable
                );

    } else if (search != null && !search.isBlank()) {

        productPage = productRepository
                .findByNameContainingIgnoreCase(
                        search,
                        pageable
                );

    } else if (category != null && !category.isBlank()) {

        productPage = productRepository
                .findByCategory(
                        category,
                        pageable
                );

    } else {

        productPage = productRepository.findAll(pageable);
    }

    List<ProductResponse> content = productPage.getContent()
            .stream()
            .map(productMapper::toResponse)
            .toList();

    return new ProductPageResponse(
            content,
            productPage.getNumber(),
            productPage.getSize(),
            productPage.getTotalElements(),
            productPage.getTotalPages()
    );
}

    public ProductPageResponse getProductsByCategory(
        String category,
        Pageable pageable) {

    Page<Product> productPage =
            productRepository.findByCategory(category, pageable);

    List<ProductResponse> content = productPage.getContent()
            .stream()
            .map(productMapper::toResponse)
            .toList();

    return new ProductPageResponse(
            content,
            productPage.getNumber(),
            productPage.getSize(),
            productPage.getTotalElements(),
            productPage.getTotalPages()
    );
}

    public ProductPageResponse searchProducts(
        String name,
        Pageable pageable) {

    Page<Product> productPage =
            productRepository.findByNameContainingIgnoreCase(name, pageable);

    List<ProductResponse> content = productPage.getContent()
            .stream()
            .map(productMapper::toResponse)
            .toList();

    return new ProductPageResponse(
            content,
            productPage.getNumber(),
            productPage.getSize(),
            productPage.getTotalElements(),
            productPage.getTotalPages()
    );
}

    public ProductResponse getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        return productMapper.toResponse(product);
    }

    public ProductResponse createProduct(ProductRequest request) {

        Product product = productMapper.toEntity(request);

        Product savedProduct = productRepository.save(product);

        return productMapper.toResponse(savedProduct);
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        productMapper.updateEntity(product, request);

        Product updatedProduct = productRepository.save(product);

        return productMapper.toResponse(updatedProduct);
    }

    public void deleteProduct(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        productRepository.delete(product);
    }
}