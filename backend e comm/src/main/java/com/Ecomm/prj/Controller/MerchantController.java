package com.Ecomm.prj.Controller;

import com.Ecomm.prj.Model.Merchant;
import com.Ecomm.prj.Model.User;
import com.Ecomm.prj.Dto.MerchantRequest;
import com.Ecomm.prj.repository.UserRepo;
import com.Ecomm.prj.Service.MerchantService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/merchant")
public class MerchantController {

    private final MerchantService merchantService;
    private final UserRepo userRepo;

    public MerchantController(
            MerchantService merchantService,
            UserRepo userRepo) {

        this.merchantService = merchantService;
        this.userRepo = userRepo;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createMerchant(
            @RequestBody MerchantRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Merchant merchant = merchantService.createMerchant(
                user,
                request.getStoreName(),
                request.getDescription(),
                request.getAddress(),
                request.getPhone()
        );

        return ResponseEntity.ok(merchant);
    }
}