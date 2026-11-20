
package com.shopsphere.dto;

public class LoginResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String token;
    private String role;

    public LoginResponse(
            Long id,
            String firstName,
            String lastName,
            String email,
            String token,
            String role) {

        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.token = token;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }
}
