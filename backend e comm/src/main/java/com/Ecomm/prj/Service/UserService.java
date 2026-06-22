package com.Ecomm.prj.Service;

import com.Ecomm.prj.Dto.LoginDto;
import com.Ecomm.prj.Dto.LoginResponseDto;
import com.Ecomm.prj.Dto.SignupDto;
import com.Ecomm.prj.Model.User;
import com.Ecomm.prj.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepo repo;

    public String signup(SignupDto request){
        if(repo.existsByUsername(request.getUsername())){
            return "username already exists";
        }
        if(repo.existsByEmail(request.getEmail())){
            return "Email already exists";
        }
        User user=new User();

        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());

        repo.save(user);
        return "Signup successful";
    }
    public LoginResponseDto login(LoginDto request){

        User user = repo.findByUsername(request.getUsername())
                .orElse(null);

        if(user == null){
            return null;
        }

        if(!user.getPassword().equals(request.getPassword())){
            return null;
        }

        return new LoginResponseDto(
                user.getId(),
                user.getUsername(),
                user.getEmail()
        );
    }
    }
