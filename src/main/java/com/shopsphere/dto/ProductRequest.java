package com.shopsphere.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class ProductRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    @Min(value = 0, message = "Price cannot be negative")
    private Double price;

    private String category;

    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;

    public String getName() {
        return name;
    }

    private String imageUrl;

    public String getImageUrl() {
    return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }
}