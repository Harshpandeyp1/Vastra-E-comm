package com.Ecomm.prj.Controller;

import com.Ecomm.prj.Dto.MerchantDashboardResponse;
import com.Ecomm.prj.Dto.MerchantRequest;
import com.Ecomm.prj.Model.Merchant;
import com.Ecomm.prj.Model.User;
import com.Ecomm.prj.Service.MerchantService;
import com.Ecomm.prj.repository.UserRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/merchant")
@CrossOrigin(origins = "http://localhost:5173")
public class MerchantController {

    private final MerchantService merchantService;
    private final UserRepo userRepo;

    public MerchantController(
            MerchantService merchantService,
            UserRepo userRepo) {

        this.merchantService = merchantService;
        this.userRepo = userRepo;
    }

    // =========================
    // CREATE MERCHANT PROFILE
    // =========================

    @PostMapping("/create")
    public ResponseEntity<?> createMerchant(
            @RequestBody MerchantRequest request,
            Authentication authentication) {

        User user = getLoggedInUser(authentication);

        Merchant merchant = merchantService.createMerchant(
                user,
                request.getStoreName(),
                request.getDescription(),
                request.getAddress(),
                request.getPhone()
        );

        return ResponseEntity.ok(merchant);
    }


    // =========================
    // GET MERCHANT PROFILE
    // =========================

    @GetMapping("/profile")
    public ResponseEntity<Merchant> getMerchantProfile(
            Authentication authentication) {

        User user = getLoggedInUser(authentication);

        Merchant merchant =
                merchantService.getMerchantByUser(user);

        return ResponseEntity.ok(merchant);
    }


    // =========================
    // UPDATE MERCHANT PROFILE
    // =========================

    @PutMapping("/profile")
    public ResponseEntity<Merchant> updateMerchantProfile(
            @RequestBody MerchantRequest request,
            Authentication authentication) {

        User user = getLoggedInUser(authentication);

        Merchant merchant =
                merchantService.updateMerchant(
                        user,
                        request.getStoreName(),
                        request.getDescription(),
                        request.getAddress(),
                        request.getPhone()
                );

        return ResponseEntity.ok(merchant);
    }


    // =========================
    // FIND LOGGED-IN USER
    // =========================

    private User getLoggedInUser(Authentication authentication) {

        String email = authentication.getName();

        return userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
}