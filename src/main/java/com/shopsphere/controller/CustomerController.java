package com.shopsphere.controller;

import com.shopsphere.dto.CustomerRequest;
import com.shopsphere.dto.CustomerResponse;
import com.shopsphere.dto.LoginRequest;
import com.shopsphere.dto.LoginResponse;
import com.shopsphere.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping("/register")
    public CustomerResponse register(
            @Valid @RequestBody CustomerRequest request) {

        return customerService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
       return customerService.login(request);
    }
}