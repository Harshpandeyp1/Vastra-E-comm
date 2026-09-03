 package com.Ecomm.prj.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeliveryPartnerOption {

    private String partnerName;

    private BigDecimal estimatedCost;

    private Integer estimatedDays;

    private Double reliabilityScore;

    private Double optimizationScore;

    // Estimated merchant profit after delivery cost
    private BigDecimal merchantProfit;


}

