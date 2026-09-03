
        package com.Ecomm.prj.Service;

import com.Ecomm.prj.Model.DeliveryPartner;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class DeliveryCostService {

    public BigDecimal calculateCost(
            DeliveryPartner partner,
            double distanceKm) {

        // baseCost + (costPerKm × distance)
        BigDecimal distance =
                BigDecimal.valueOf(distanceKm);

        BigDecimal distanceCost =
                partner.getCostPerKm()
                        .multiply(distance);

        BigDecimal totalCost =
                partner.getBaseCost()
                        .add(distanceCost);

        return totalCost.setScale(
                2,
                RoundingMode.HALF_UP
        );
    }
}

