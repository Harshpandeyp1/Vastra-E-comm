package com.Ecomm.prj.Dto;

import com.Ecomm.prj.Model.Role;
import lombok.Getter;

@Getter
public class SignupDto {
    private String email;
    private String username;

    public void setRole(Role role) {
        this.role = role;
    }

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
