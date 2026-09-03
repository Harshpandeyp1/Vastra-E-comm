package com.Ecomm.prj.Service;

import com.Ecomm.prj.Dto.MerchantDashboardResponse;
import com.Ecomm.prj.Model.Order;
import com.Ecomm.prj.Model.OrderItem;
import com.Ecomm.prj.Model.Product;
import com.Ecomm.prj.repository.orderrepo;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MerchantDashboardService {


    private final orderrepo orderrepo;

    public MerchantDashboardService(orderrepo orderrepo) {
        this.orderrepo = orderrepo;
    }

    public MerchantDashboardResponse getDashboard(Long merchantId) {

        // Get all orders containing this merchant's products
        List<Order> orders =
                orderrepo.findDistinctByOrderItems_Product_Merchant_Id(merchantId);

        BigDecimal totalRevenue = BigDecimal.ZERO;
        BigDecimal totalProfit = BigDecimal.ZERO;

        long pendingOrders = 0;
        long processingOrders = 0;
        long shippedOrders = 0;
        long deliveredOrders = 0;

        // Date-wise analytics
        Map<LocalDate, BigDecimal> revenueByDate = new TreeMap<>();
        Map<LocalDate, BigDecimal> profitByDate = new TreeMap<>();

        // Product analytics
        Map<String, Long> quantityByProduct = new HashMap<>();
        Map<String, BigDecimal> revenueByProduct = new HashMap<>();

        for (Order order : orders) {

            String status = order.getStatus();

            if (status != null) {

                switch (status.toUpperCase()) {

                    case "PLACED":
                        pendingOrders++;
                        break;

                    case "PROCESSING":
                        processingOrders++;
                        break;

                    case "SHIPPED":
                        shippedOrders++;
                        break;

                    case "DELIVERED":
                        deliveredOrders++;
                        break;
                }
            }

            LocalDate orderDate = order.getOrderdate();

            if (orderDate == null) {
                orderDate = LocalDate.now();
            }

            BigDecimal orderRevenue = BigDecimal.ZERO;
            BigDecimal orderProfit = BigDecimal.ZERO;

            if (order.getOrderItems() != null) {

                for (OrderItem item : order.getOrderItems()) {

                    Product product = item.getProduct();

                    // Only count products belonging to this merchant
                    if (product == null ||
                            product.getMerchant() == null ||
                            !merchantId.equals(product.getMerchant().getId())) {
                        continue;
                    }

                    BigDecimal itemRevenue =
                            item.getPrice() != null
                                    ? item.getPrice()
                                    : BigDecimal.ZERO;

                    BigDecimal itemCost = BigDecimal.ZERO;

                    if (product.getCostPrice() != null) {
                        itemCost = product.getCostPrice()
                                .multiply(
                                        BigDecimal.valueOf(item.getQuantity())
                                );
                    }

                    BigDecimal itemProfit =
                            itemRevenue.subtract(itemCost);

                    orderRevenue = orderRevenue.add(itemRevenue);
                    orderProfit = orderProfit.add(itemProfit);

                    // Product sales data
                    String productName = product.getName();

                    quantityByProduct.merge(
                            productName,
                            (long) item.getQuantity(),
                            Long::sum
                    );

                    revenueByProduct.merge(
                            productName,
                            itemRevenue,
                            BigDecimal::add
                    );
                }
            }

            totalRevenue = totalRevenue.add(orderRevenue);
            totalProfit = totalProfit.add(orderProfit);

            // Revenue by date
            revenueByDate.merge(
                    orderDate,
                    orderRevenue,
                    BigDecimal::add
            );

            // Profit by date
            profitByDate.merge(
                    orderDate,
                    orderProfit,
                    BigDecimal::add
            );
        }

        // Convert revenue chart data
        List<MerchantDashboardResponse.RevenuePoint> revenueChart =
                revenueByDate.entrySet()
                        .stream()
                        .map(entry ->
                                new MerchantDashboardResponse.RevenuePoint(
                                        entry.getKey().toString(),
                                        entry.getValue().setScale(
                                                2,
                                                RoundingMode.HALF_UP
                                        )
                                )
                        )
                        .collect(Collectors.toList());

        // Convert profit chart data
        List<MerchantDashboardResponse.ProfitPoint> profitChart =
                profitByDate.entrySet()
                        .stream()
                        .map(entry ->
                                new MerchantDashboardResponse.ProfitPoint(
                                        entry.getKey().toString(),
                                        entry.getValue().setScale(
                                                2,
                                                RoundingMode.HALF_UP
                                        )
                                )
                        )
                        .collect(Collectors.toList());

        // Order status chart
        List<MerchantDashboardResponse.OrderStatusPoint> orderStatusChart =
                new ArrayList<>();

        orderStatusChart.add(
                new MerchantDashboardResponse.OrderStatusPoint(
                        "PLACED",
                        pendingOrders
                )
        );

        orderStatusChart.add(
                new MerchantDashboardResponse.OrderStatusPoint(
                        "PROCESSING",
                        processingOrders
                )
        );

        orderStatusChart.add(
                new MerchantDashboardResponse.OrderStatusPoint(
                        "SHIPPED",
                        shippedOrders
                )
        );

        orderStatusChart.add(
                new MerchantDashboardResponse.OrderStatusPoint(
                        "DELIVERED",
                        deliveredOrders
                )
        );

        // Top products
        List<MerchantDashboardResponse.TopProductPoint> topProducts =
                quantityByProduct.entrySet()
                        .stream()
                        .sorted(
                                Map.Entry.<String, Long>comparingByValue()
                                        .reversed()
                        )
                        .limit(5)
                        .map(entry ->
                                new MerchantDashboardResponse.TopProductPoint(
                                        entry.getKey(),
                                        entry.getValue(),
                                        revenueByProduct.getOrDefault(
                                                entry.getKey(),
                                                BigDecimal.ZERO
                                        )
                                )
                        )
                        .collect(Collectors.toList());

        return new MerchantDashboardResponse(
                totalRevenue.setScale(2, RoundingMode.HALF_UP),
                totalProfit.setScale(2, RoundingMode.HALF_UP),
                orders.size(),
                pendingOrders,
                processingOrders,
                shippedOrders,
                deliveredOrders,
                revenueChart,
                profitChart,
                orderStatusChart,
                topProducts
        );
    }


}
