package com.Ecomm.prj.Controller;

import com.Ecomm.prj.Dto.DeliveryOptimizationResponse;
import com.Ecomm.prj.Service.DeliveryOptimizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/merchant/delivery-optimization")
@CrossOrigin(origins = "http://localhost:5173")
public class DeliveryOptimizationController {

    private final DeliveryOptimizationService deliveryOptimizationService;

    public DeliveryOptimizationController(
            DeliveryOptimizationService deliveryOptimizationService) {

        this.deliveryOptimizationService = deliveryOptimizationService;
    }

    @PostMapping("/optimize/{deliveryId}")
    public ResponseEntity<DeliveryOptimizationResponse> optimizeDelivery(
            @PathVariable Long deliveryId) {

        return ResponseEntity.ok(
                deliveryOptimizationService.optimizeDelivery(deliveryId)
        );
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<?> handleResponseStatusException(
            ResponseStatusException ex) {

        return ResponseEntity
                .status(ex.getStatusCode())
                .body(
                        java.util.Map.of(
                                "error", ex.getReason()
                        )
                );
    }
}