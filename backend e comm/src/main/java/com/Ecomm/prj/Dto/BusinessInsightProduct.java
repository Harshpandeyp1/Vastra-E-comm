  package com.Ecomm.prj.Dto;

import java.math.BigDecimal;

public class BusinessInsightProduct {

    private String productName;
    private Long quantitySold;
    private BigDecimal revenue;

    public BusinessInsightProduct(
            String productName,
            Long quantitySold,
            BigDecimal revenue) {

        this.productName = productName;
        this.quantitySold = quantitySold;
        this.revenue = revenue;
    }

    public String getProductName() {
        return productName;
    }

    public Long getQuantitySold() {
        return quantitySold;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }
}

