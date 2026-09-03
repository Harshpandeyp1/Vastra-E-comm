
        package com.Ecomm.prj.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BusinessProfitProduct {

    private String productName;

    private Long quantitySold;

    private BigDecimal revenue;

    private BigDecimal productCost;

    private BigDecimal profit;

}

