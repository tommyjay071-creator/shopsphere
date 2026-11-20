
package com.shopsphere.service;

import com.shopsphere.dto.LoginRequest;
import com.shopsphere.customer.Customer;
import com.shopsphere.dto.LoginResponse;
import com.shopsphere.security.JwtService;
import com.shopsphere.dto.CustomerRequest;
import com.shopsphere.dto.CustomerResponse;
import com.shopsphere.repository.CustomerRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public CustomerService(
            CustomerRepository customerRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public CustomerResponse register(CustomerRequest request) {

        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException(
                    "A customer with this email already exists");
        }

        Customer customer = new Customer();

        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setEmail(request.getEmail());

        String hashedPassword =
                passwordEncoder.encode(request.getPassword());

        customer.setPassword(hashedPassword);

        Customer savedCustomer =
                customerRepository.save(customer);

        return new CustomerResponse(
                savedCustomer.getId(),
                savedCustomer.getFirstName(),
                savedCustomer.getLastName(),
                savedCustomer.getEmail()
        );
    }

    public LoginResponse login(LoginRequest request) {

        Customer customer = customerRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                customer.getPassword())) {

            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(
                customer.getEmail(),
                customer.getRole()
        );

        return new LoginResponse(
                customer.getId(),
                customer.getFirstName(),
                customer.getLastName(),
                customer.getEmail(),
                token,
                customer.getRole().name()
        );
    }
}
