package com.Ecomm.prj.Controller;

import com.Ecomm.prj.Dto.DeliveryOptimizationRequest;
import com.Ecomm.prj.Dto.DeliveryOptimizationResponse;
import com.Ecomm.prj.Model.Merchant;
import com.Ecomm.prj.Model.User;
import com.Ecomm.prj.Service.DeliveryOptimizationService;
import com.Ecomm.prj.repository.MerchantRepo;
import com.Ecomm.prj.repository.UserRepo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/merchant/delivery-optimization")
@CrossOrigin(origins = "http://localhost:5173")
public class DeliveryOptimizationController {

    private final DeliveryOptimizationService optimizationService;
    private final UserRepo userRepo;
    private final MerchantRepo merchantRepo;

    public DeliveryOptimizationController(
            DeliveryOptimizationService optimizationService,
            UserRepo userRepo,
            MerchantRepo merchantRepo) {

        this.optimizationService = optimizationService;
        this.userRepo = userRepo;
        this.merchantRepo = merchantRepo;
    }

    @PostMapping("/{deliveryId}/optimize")
    public ResponseEntity<DeliveryOptimizationResponse> optimizeDelivery(
            @PathVariable Long deliveryId) {

        return ResponseEntity.ok(
                optimizationService.optimizeDelivery(
                        deliveryId
                )
        );
    }
}
