package com.Ecomm.prj.Service;

import com.Ecomm.prj.Model.Merchant;
import com.Ecomm.prj.Model.Role;
import com.Ecomm.prj.Model.User;
import com.Ecomm.prj.repository.MerchantRepo;
import com.Ecomm.prj.repository.UserRepo;
import org.springframework.stereotype.Service;

@Service
public class MerchantService {

    private final MerchantRepo merchantRepo;
    private final UserRepo userRepo;

    public MerchantService(MerchantRepo merchantRepo,
                           UserRepo userRepo) {
        this.merchantRepo = merchantRepo;
        this.userRepo = userRepo;
    }

    public Merchant createMerchant(
            User user,
            String storeName,
            String description,
            String address,
            String phone) {

        if (user.getRole() != Role.USER) {
            throw new RuntimeException("Only normal users can become merchants");
        }

        if (merchantRepo.findByUserId(user.getId()).isPresent()) {
            throw new RuntimeException("Merchant profile already exists");
        }

        Merchant merchant = new Merchant();

        merchant.setUser(user);
        merchant.setStoreName(storeName);
        merchant.setDescription(description);
        merchant.setAddress(address);
        merchant.setPhone(phone);

        user.setRole(Role.MERCHANT);
        userRepo.save(user);

        return merchantRepo.save(merchant);
    }
}