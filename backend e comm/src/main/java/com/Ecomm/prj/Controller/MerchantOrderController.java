package com.Ecomm.prj.Controller;

import com.Ecomm.prj.Model.Delivery;
import com.Ecomm.prj.Model.Merchant;
import com.Ecomm.prj.Model.Order;
import com.Ecomm.prj.Model.User;
import com.Ecomm.prj.Service.DeliveryService;
import com.Ecomm.prj.Service.orderService;
import com.Ecomm.prj.repository.MerchantRepo;
import com.Ecomm.prj.repository.UserRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/merchant/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class MerchantOrderController {

    private final orderService orderService;
    private final UserRepo userRepo;
    private final MerchantRepo merchantRepo;
    private final DeliveryService deliveryService;
    public MerchantOrderController(
            orderService orderService,
            UserRepo userRepo,
            MerchantRepo merchantRepo, DeliveryService deliveryService
    ) {

        this.orderService = orderService;
        this.userRepo = userRepo;
        this.merchantRepo = merchantRepo;
        this.deliveryService = deliveryService;
    }

    @GetMapping
    public ResponseEntity<List<Order>> getMyOrders(
            Authentication authentication) {

        Merchant merchant = getMerchant(authentication);

        List<Order> orders =
                orderService.getOrdersByMerchantId(merchant.getId());

        return ResponseEntity.ok(orders);
    }

    private Merchant getMerchant(Authentication authentication) {
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

        return merchantRepo.findByUserId(user.getId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Merchant profile not found"
                        ));
    }

    @PutMapping("/{orderId}/confirm")
    public ResponseEntity<?> confirmOrder(
            @PathVariable int orderId,
            Authentication authentication) {

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

        Order confirmedOrder =
                orderService.confirmOrder(
                        orderId,
                        merchant.getId()
                );

        return ResponseEntity.ok(confirmedOrder);
    }

    @PutMapping("/{orderId}/process")
    public ResponseEntity<?> startProcessing(
            @PathVariable int orderId,
            Authentication authentication) {

        // Get logged-in merchant's email
        String email = authentication.getName();

        // Find the user
        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        ));

        // Find the merchant profile
        Merchant merchant = merchantRepo.findByUserId(user.getId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Merchant profile not found"
                        ));

        // Call service
        Order order = orderService.startProcessing(
                orderId,
                merchant.getId()
        );

        return ResponseEntity.ok(order);
    }

    @PutMapping("/{orderId}/ship")
    public ResponseEntity<?> shipOrder(
            @PathVariable int orderId,
            Authentication authentication) {

        // 1. Get logged-in merchant's email
        String email = authentication.getName();

        // 2. Find the User
        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // 3. Find the Merchant profile
        Merchant merchant = merchantRepo.findByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Merchant profile not found"));

        // 4. Send order + merchant to service
        Delivery delivery = deliveryService.shipOrder(
                orderId,
                merchant
        );

        // 5. Return created delivery
        return ResponseEntity.ok(delivery);
    }

}
