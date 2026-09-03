package com.Ecomm.prj.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfitOptimizationResponse {

    private int orderId;

    private BigDecimal orderValue;

    private BigDecimal productCost;

    private BigDecimal deliveryCost;

    private BigDecimal currentProfit;

    private String recommendation;
}