package com.Ecomm.prj.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

public class ChatResponse {
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProfitOptimizationResponse {

        private long orderId;

        private BigDecimal orderValue;

        private BigDecimal productCost;

        private BigDecimal deliveryCost;

        private BigDecimal currentProfit;

        private String recommendation;
    }
}
