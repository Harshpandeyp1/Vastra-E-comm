
        package com.Ecomm.prj.Controller;

import com.Ecomm.prj.Model.DeliveryPartner;
import com.Ecomm.prj.Service.DeliveryPartnerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/merchant/delivery-partners")
@CrossOrigin(origins = "http://localhost:5173")
public class DeliveryPartnerController {

    private final DeliveryPartnerService deliveryPartnerService;

    public DeliveryPartnerController(
            DeliveryPartnerService deliveryPartnerService) {

        this.deliveryPartnerService = deliveryPartnerService;
    }

    @GetMapping("/available")
    public ResponseEntity<List<DeliveryPartner>> getAvailablePartners() {

        return ResponseEntity.ok(
                deliveryPartnerService.getAvailablePartners()
        );
    }
}

