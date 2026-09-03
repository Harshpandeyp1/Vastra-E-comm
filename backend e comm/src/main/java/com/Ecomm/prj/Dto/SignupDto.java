package com.Ecomm.prj.Dto;

import com.Ecomm.prj.Model.Role;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public class SignupDto {
    private String email;
    private String username;

    public void setRole(Role role) {
        this.role = role;
    }

    @JsonProperty("requestedRole")
    @JsonAlias({"role"})
    private Role role;

    public void setPassword(String password) {
        this.password = password;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    private String password;

}
