package com.Ecomm.prj.Dto;

import com.Ecomm.prj.Model.Role;

public class LoginResponseDto {

    private Long id;
    private String username;
    private String email;
    private String token;
    private Role role;

    public LoginResponseDto() {
    }

    public LoginResponseDto(Long id, String username, String email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }

    public LoginResponseDto(
            Long id,
            String username,
            String email,
            String token,
            Role role) {

        this.id = id;
        this.username = username;
        this.email = email;
        this.token = token;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}