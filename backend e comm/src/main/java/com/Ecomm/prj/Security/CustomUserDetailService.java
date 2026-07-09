package com.Ecomm.prj.Security;

import com.Ecomm.prj.Model.User;
import com.Ecomm.prj.repository.UserRepo;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailService implements UserDetailsService {
    private final UserRepo userRepo;

    public  CustomUserDetailService(UserRepo userRepo){
        this.userRepo=userRepo;
    }
    @Override
    public CustomUserDetail loadUserByUsername(String email) throws UsernameNotFoundException{
        System.out.println("[CustomUserDetailService] Loading user by email = " + email);
        User user=userRepo.findByEmail(email)
                .orElseThrow(()->{
                    System.out.println("[CustomUserDetailService] User not found for email = " + email);
                    return new UsernameNotFoundException("User Not Found");
                });
        System.out.println("[CustomUserDetailService] User found, id = " + user.getId() + ", username = " + user.getUsername());
        
        return new CustomUserDetail(user);
    }
}
