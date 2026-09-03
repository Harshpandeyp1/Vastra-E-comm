package com.Ecomm.prj.Controller;

import com.Ecomm.prj.Dto.MerchantDashboardResponse;
import com.Ecomm.prj.Model.Merchant;
import com.Ecomm.prj.Model.User;
import com.Ecomm.prj.Service.MerchantDashboardService;
import com.Ecomm.prj.repository.MerchantRepo;
import com.Ecomm.prj.repository.UserRepo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/merchant/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class MerchantDashboardController {

    private final MerchantDashboardService merchantDashboardService;
    private final UserRepo userRepo;
    private final MerchantRepo merchantRepo;

    public MerchantDashboardController(
            MerchantDashboardService merchantDashboardService,
            UserRepo userRepo,
            MerchantRepo merchantRepo
    ) {
        this.merchantDashboardService = merchantDashboardService;
        this.userRepo = userRepo;
        this.merchantRepo = merchantRepo;
    }

    @GetMapping
    public ResponseEntity<MerchantDashboardResponse> getDashboard(
            Authentication authentication
    ) {

        if (authentication == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication is required"
            );
        }

        String email = authentication.getName();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        )
                );

        Merchant merchant = merchantRepo.findByUserId(user.getId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Merchant profile not found"
                        )
                );

        MerchantDashboardResponse response =
                merchantDashboardService.getDashboard(
                        merchant.getId()
                );

        return ResponseEntity.ok(response);
    }


}
