   package com.Ecomm.prj.Service;

import com.Ecomm.prj.Dto.DeliveryOptimizationResponse;
import com.Ecomm.prj.Dto.ProfitOptimizationResponse;
import com.Ecomm.prj.Model.Delivery;
import com.Ecomm.prj.Model.Order;
import com.Ecomm.prj.Model.OrderItem;
import com.Ecomm.prj.repository.DeliveryRepository;
import com.Ecomm.prj.repository.orderrepo;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class ProfitOptimizationService {

    private final orderrepo orderRepository;
    private final DeliveryRepository deliveryRepository;
    private final DeliveryOptimizationService deliveryOptimizationService;

    public ProfitOptimizationService(
            orderrepo orderRepository,
            DeliveryRepository deliveryRepository,
            DeliveryOptimizationService deliveryOptimizationService) {

        this.orderRepository = orderRepository;
        this.deliveryRepository = deliveryRepository;
        this.deliveryOptimizationService = deliveryOptimizationService;
    }

    public ProfitOptimizationResponse analyzeProfit(int orderId) {

        // =========================================================
        // 1. FIND ORDER
        // =========================================================

        Order order = orderRepository.findOrderForMerchant(orderId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Order not found"
                        )
                );

        // =========================================================
        // 2. CALCULATE TOTAL PRODUCT COST
        // =========================================================

        BigDecimal productCost = BigDecimal.ZERO;

        for (OrderItem item : order.getOrderItems()) {

            if (item.getProduct().getCostPrice() == null) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Cost price is missing for product: "
                                + item.getProduct().getName()
                );
            }

            BigDecimal itemCost =
                    item.getProduct()
                            .getCostPrice()
                            .multiply(
                                    BigDecimal.valueOf(
                                            item.getQuantity()
                                    )
                            );

            productCost = productCost.add(itemCost);
        }

        productCost = productCost.setScale(
                2,
                RoundingMode.HALF_UP
        );

        // =========================================================
        // 3. ORDER VALUE
        // =========================================================

        BigDecimal orderValue =
                order.getTotalAmount()
                        .setScale(
                                2,
                                RoundingMode.HALF_UP
                        );

        // =========================================================
        // 4. FIND DELIVERY FOR THIS ORDER
        // =========================================================

        Delivery delivery =
                deliveryRepository
                        .findByOrder_Id(orderId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Delivery not found for order "
                                                + orderId
                                )
                        );

        // =========================================================
        // 5. OPTIMIZE DELIVERY
        // =========================================================

        DeliveryOptimizationResponse deliveryResult =
                deliveryOptimizationService.optimizeDelivery(
                        delivery.getId()
                );

        // =========================================================
        // 6. GET BEST DELIVERY COST
        // =========================================================

        BigDecimal deliveryCost =
                deliveryResult
                        .getEstimatedCost()
                        .setScale(
                                2,
                                RoundingMode.HALF_UP
                        );

        // =========================================================
        // 7. CALCULATE ACTUAL PROFIT
        // =========================================================

        BigDecimal actualProfit =
                orderValue
                        .subtract(productCost)
                        .subtract(deliveryCost)
                        .setScale(
                                2,
                                RoundingMode.HALF_UP
                        );

        // =========================================================
        // 8. GENERATE RECOMMENDATION
        // =========================================================

        String recommendation =
                generateRecommendation(
                        actualProfit,
                        deliveryResult
                );

        // =========================================================
        // 9. RETURN RESULT
        // =========================================================

        return new ProfitOptimizationResponse(
                orderId,
                orderValue,
                productCost,
                deliveryCost,
                actualProfit,
                recommendation
        );
    }

    private String generateRecommendation(
            BigDecimal profit,
            DeliveryOptimizationResponse deliveryResult) {

        String partner =
                deliveryResult.getRecommendedPartner();

        if (profit.compareTo(BigDecimal.ZERO) > 0) {

            return "The order is profitable after delivery costs. "
                    + "The recommended delivery partner is "
                    + partner
                    + ". Using this partner gives an estimated "
                    + "merchant profit of ₹"
                    + profit
                    + ".";
        }

        if (profit.compareTo(BigDecimal.ZERO) == 0) {

            return "The order breaks even after delivery costs. "
                    + "Consider reducing product or delivery costs.";
        }

        return "The order is generating a loss after delivery costs. "
                + "Review product pricing and delivery costs before "
                + "fulfilling the order.";
    }
}

