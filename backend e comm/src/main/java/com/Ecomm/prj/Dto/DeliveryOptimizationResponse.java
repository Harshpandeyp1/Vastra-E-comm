  package com.Ecomm.prj.Dto;

import com.Ecomm.prj.Dto.DeliveryPartnerOption;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeliveryOptimizationResponse {

    private Long deliveryId;

    private String recommendedPartner;

    private BigDecimal estimatedCost;

    private Integer estimatedDays;

    private Double reliabilityScore;

    private BigDecimal orderValue;

    private BigDecimal merchantSaving;

    private BigDecimal profitImpact;

    private String reason;

    private String riskWarning;

    private String aiExplanation;

    private List<DeliveryPartnerOption> options;
}

