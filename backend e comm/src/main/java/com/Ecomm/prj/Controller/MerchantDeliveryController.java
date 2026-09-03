package com.Ecomm.prj.Controller;

import com.Ecomm.prj.Model.Delivery;
import com.Ecomm.prj.Model.Merchant;
import com.Ecomm.prj.Model.User;
import com.Ecomm.prj.Service.DeliveryService;
import com.Ecomm.prj.repository.MerchantRepo;
import com.Ecomm.prj.repository.UserRepo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.Ecomm.prj.Dto.DeliveryAssignmentRequest;
import java.util.List;

@RestController
@RequestMapping("/api/merchant/deliveries")
@CrossOrigin(origins = "http://localhost:5173")
public class MerchantDeliveryController {

    private final UserRepo userRepo;
    private final MerchantRepo merchantRepo;
    private final DeliveryService deliveryService;

    public MerchantDeliveryController(
            UserRepo userRepo,
            MerchantRepo merchantRepo,
            DeliveryService deliveryService) {

        this.userRepo = userRepo;
        this.merchantRepo = merchantRepo;
        this.deliveryService = deliveryService;
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Delivery>> getPendingDeliveries(
            Authentication authentication) {

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
                        ));

        Merchant merchant = merchantRepo.findByUserId(user.getId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Merchant profile not found"
                        ));

        List<Delivery> deliveries =
                deliveryService.getPendingDeliveries(
                        merchant.getId()
                );

        return ResponseEntity.ok(deliveries);
    }
    @PostMapping("/{deliveryId}/assign")
    public ResponseEntity<Delivery> acceptAndAssignDelivery(
            @PathVariable Long deliveryId,
            @RequestBody DeliveryAssignmentRequest request,
            Authentication authentication) {

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
                        ));

        Merchant merchant = merchantRepo.findByUserId(user.getId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Merchant profile not found"
                        ));

        Delivery delivery =
                deliveryService.acceptAndAssignDelivery(
                        deliveryId,
                        request.getPartnerName(),
                        request.getDeliveryCost(),
                        request.getEstimatedDays(),
                        merchant
                );

        return ResponseEntity.ok(delivery);
    }
    @GetMapping("/ongoing")
    public ResponseEntity<List<Delivery>> getOngoingDeliveries(
            Authentication authentication) {

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
                        ));

        Merchant merchant = merchantRepo.findByUserId(user.getId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Merchant profile not found"
                        ));

        List<Delivery> deliveries =
                deliveryService.getOngoingDeliveries(
                        merchant.getId()
                );

        return ResponseEntity.ok(deliveries);
    }


    @GetMapping("/delivered")
    public ResponseEntity<List<Delivery>> getDeliveredDeliveries(
            Authentication authentication) {

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
                        ));

        Merchant merchant = merchantRepo.findByUserId(user.getId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Merchant profile not found"
                        ));

        List<Delivery> deliveries =
                deliveryService.getDeliveredDeliveries(
                        merchant.getId()
                );

        return ResponseEntity.ok(deliveries);
    }
}