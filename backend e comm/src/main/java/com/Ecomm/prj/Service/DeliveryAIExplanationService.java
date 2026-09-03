
        package com.Ecomm.prj.Service;

import com.Ecomm.prj.Dto.DeliveryOptimizationResponse;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class DeliveryAIExplanationService {

    private final ChatClient chatClient;

    public DeliveryAIExplanationService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public String generateExplanation(
            DeliveryOptimizationResponse result) {

        String prompt = """
                You are an AI logistics assistant for an e-commerce merchant.

                Analyze the delivery optimization result below and explain it
                clearly to the merchant.

                IMPORTANT RULES:
                1. Do not change or recalculate any numbers.
                2. Do not invent delivery partners or data.
                3. The provided Java backend calculations are the source of truth.
                4. Explain why the recommended partner was selected.
                5. Mention the merchant profit or loss.
                6. If the order is unprofitable, clearly warn the merchant.
                7. Keep the explanation concise and practical.
                8. Do not use unnecessary technical language.

                Delivery ID:
                %s

                Recommended Partner:
                %s

                Order Value:
                ₹%s

                Delivery Cost:
                ₹%s

                Estimated Delivery Time:
                %s days

                Reliability:
                %s%%

                Merchant Saving:
                ₹%s

                Merchant Profit/Loss:
                ₹%s

                Optimization Score:
                %s

                Existing Backend Reason:
                %s

                Risk Warning:
                %s

                Available Partner Options:
                %s

                Give the merchant a short explanation of the recommendation.
                """.formatted(
                result.getDeliveryId(),
                result.getRecommendedPartner(),
                result.getOrderValue(),
                result.getEstimatedCost(),
                result.getEstimatedDays(),
                result.getReliabilityScore(),
                result.getMerchantSaving(),
                result.getProfitImpact(),
                findOptimizationScore(result),
                result.getReason(),
                result.getRiskWarning(),
                result.getOptions()
        );

        try {

            return chatClient
                    .prompt()
                    .user(prompt)
                    .call()
                    .content();

        } catch (Exception e) {

            // AI failure should not break delivery optimization.
            return result.getReason();
        }
    }

    private String findOptimizationScore(
            DeliveryOptimizationResponse result) {

        if (result.getOptions() == null) {
            return "N/A";
        }

        return result.getOptions()
                .stream()
                .filter(option ->
                        option.getPartnerName()
                                .equals(result.getRecommendedPartner()))
                .map(option ->
                        String.valueOf(option.getOptimizationScore()))
                .findFirst()
                .orElse("N/A");
    }
}

