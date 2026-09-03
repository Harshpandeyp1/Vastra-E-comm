package com.Ecomm.prj.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MerchantDashboardResponse {


    private BigDecimal totalRevenue;
    private BigDecimal totalProfit;
    private long totalOrders;

    private long pendingOrders;
    private long processingOrders;
    private long shippedOrders;
    private long deliveredOrders;

    private List<RevenuePoint> revenueChart;
    private List<ProfitPoint> profitChart;
    private List<OrderStatusPoint> orderStatusChart;
    private List<TopProductPoint> topProducts;


    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RevenuePoint {

        private String date;
        private BigDecimal revenue;
    }


    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProfitPoint {

        private String date;
        private BigDecimal profit;
    }


    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderStatusPoint {

        private String status;
        private long count;
    }


    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TopProductPoint {

        private String productName;
        private long quantitySold;
        private BigDecimal revenue;
    }
}
