package com.Ecomm.prj.Service;

import com.Ecomm.prj.Dto.DeliveryOptimizationResponse;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

@Component
public class DeliveryOptimizationTool {

    private final DeliveryOptimizationService
            deliveryOptimizationService;

    public DeliveryOptimizationTool(
            DeliveryOptimizationService deliveryOptimizationService) {

        this.deliveryOptimizationService =
                deliveryOptimizationService;
    }

    @Tool(
            description = """
            Recommend the best delivery partner for a merchant order.

            Use this tool when a merchant asks:
            - Which delivery partner should I use?
            - What is the cheapest delivery option?
            - Which partner gives the best delivery option?
            - How can I reduce delivery cost?
            - Which delivery partner is most profitable?

            The tool evaluates available delivery partners using:
            - delivery cost
            - estimated delivery time
            - historical reliability
            - merchant profitability

            The recommendation is calculated from the real
            Vastra delivery and order data.

            Never invent delivery partners, prices, delivery times,
            reliability scores, or profit figures.
            """
    )
    public DeliveryOptimizationResponse optimizeDelivery(
            Long deliveryId) {

        return deliveryOptimizationService.optimizeDelivery(
                deliveryId
        );
    }
}