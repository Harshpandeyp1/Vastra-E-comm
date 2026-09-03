package com.Ecomm.prj.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeliveryAssignmentRequest {

    private String partnerName;

    private BigDecimal deliveryCost;

    private Integer estimatedDays;
}