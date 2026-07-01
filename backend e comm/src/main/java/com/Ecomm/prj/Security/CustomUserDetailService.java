package com.Ecomm.prj.Security;

import com.Ecomm.prj.Model.User;
import com.Ecomm.prj.repository.UserRepo;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailService {
    private final UserRepo userRepo;

    public final CustomUserDetailService(UserRepo userRepo){
        this.userRepo=userRepo;
    }
    @Override
    public CustomUserDetail loadUserByUsername(String email) throws UsernameNotFoundException{
        User user=userRepo.findByEmail(email)
                .orElseThrow(()->new UsernameNotFoundException("USer Not Found"));
        
        return new CustomUserDetail(user);
    }
}
