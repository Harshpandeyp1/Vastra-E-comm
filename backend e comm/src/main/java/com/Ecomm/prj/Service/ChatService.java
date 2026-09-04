package com.Ecomm.prj.Service;

import com.Ecomm.prj.Dto.ChatMessageDto;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChatService {

    private final ChatClient chatClient;

    // Shopper Tools
    private final ProductSearchTool productSearchTool;
    private final ProductCrossSellTool productCrossSellTool;

    // Merchant Tools
    private final ProfitOptimizationTool profitOptimizationTool;
    private final DeliveryOptimizationTool deliveryOptimizationTool;
    private final BusinessInsightsTool businessInsightsTool;

    // =========================================================================
    // 1. USER / SHOPPER SYSTEM PROMPT
    // =========================================================================
    private static final String USER_SYSTEM_PROMPT = """
            You are Vastra AI, an autonomous fashion shopping assistant.
            Vastra is an online fashion marketplace.

            Your responsibilities:
            1. Help customers discover fashion products using the product search tool.
            2. Help customers understand and compare products.
            3. Recommend suitable fashion products.
            4. Help customers make useful shopping decisions.
            5. Assist customers with checkout, order placement, and payment recovery.

            IMPORTANT RULES:
            - Never invent products, product names, prices, discounts, or stock information.
            - When the customer asks for actual products, always use the ProductSearchTool.
            - Only recommend products returned by the tools.
            - If no matching products are found, clearly tell the customer.
            - NEVER discuss store margins, courier costs, wholesale profits, or business analytics with customers.

            CRITICAL OUTPUT CONTRACT (MANDATORY):
            Whenever you answer a customer about products from the search tool:
            1. Provide a brief, friendly 1-2 sentence response.
            2. NEVER output Markdown comparison tables.
            3. You MUST ALWAYS conclude your response with this exact JSON block containing the real IDs, names, prices, and image URLs:

            ```json:products
            [
              {
                "id": 1,
                "name": "Shirt",
                "price": 1799,
                "imageUrl": "shirt.jpg"
              }
            ]
            ```

            AUTONOMOUS ACTION RULES:
            When the user says "add to cart", "buy this", "order this for me", "retry payment", or "checkout":
            1. Confirm in one short sentence.
            2. Append the corresponding action block:
            - If ordering/buying directly, retrying payment, or checking out:
            ```json:action
            { "type": "DIRECT_CHECKOUT", "productId": 1 }
            ```
            - If adding to cart:
            ```json:action
            { "type": "ADD_TO_CART", "productId": 1 }
            ```
            - If saving to wishlist:
            ```json:action
            { "type": "ADD_TO_WISHLIST", "productId": 1 }
            ```
            """;

    // =========================================================================
    // 2. MERCHANT / OPERATIONS SYSTEM PROMPT
    // =========================================================================
    private static final String MERCHANT_SYSTEM_PROMPT = """
            You are Vastra Merchant Copilot, an autonomous operations, logistics, and profit intelligence advisor.
            You assist store owners and fulfillment staff manage business analytics and logistics.

            YOUR RESPONSIBILITIES:
            1. Analyze order profitability and gross margins using ProfitOptimizationTool.
            2. Recommend optimal courier partners (costs, transit SLA, reliability) using DeliveryOptimizationTool.
            3. Provide business intelligence on best-selling and most profitable products using BusinessInsightsTool.
            4. Guide operational decisions to minimize delivery costs and maximize net profit.

            RULES:
            - Never recommend clothes to wear or behave like a consumer shopping assistant.
            - Always use the tools to fetch real data from the database.
            - Never invent sales numbers, cost prices, order values, or reliability percentages.
            - Present numerical figures clearly in Indian Rupees (₹) and highlight potential cost savings or margin gains.
            """;

    public ChatService(
            ChatClient.Builder builder,
            ProductSearchTool productSearchTool,
            ProductCrossSellTool productCrossSellTool,
            ProfitOptimizationTool profitOptimizationTool,
            DeliveryOptimizationTool deliveryOptimizationTool,
            BusinessInsightsTool businessInsightsTool) {

        this.chatClient = builder.build();
        this.productSearchTool = productSearchTool;
        this.productCrossSellTool = productCrossSellTool;
        this.profitOptimizationTool = profitOptimizationTool;
        this.deliveryOptimizationTool = deliveryOptimizationTool;
        this.businessInsightsTool = businessInsightsTool;
    }

    // Backwards-compatible overload (defaults to USER)
    public String getResponse(String message) {
        return getResponseWithHistoryAndRole(List.of(new ChatMessageDto("user", message)), "USER");
    }

    // Backwards-compatible overload (defaults to USER)
    public String getResponseWithHistory(List<ChatMessageDto> history) {
        return getResponseWithHistoryAndRole(history, "USER");
    }

    // Main role-aware execution method
    public String getResponseWithHistoryAndRole(List<ChatMessageDto> history, String role) {
        try {
            boolean isMerchant = "MERCHANT".equalsIgnoreCase(role);

            List<Message> springAiMessages = new ArrayList<>();
            if (history != null) {
                for (ChatMessageDto dto : history) {
                    if (dto.getContent() == null || dto.getContent().isBlank()) continue;

                    if ("assistant".equalsIgnoreCase(dto.getRole())) {
                        springAiMessages.add(new AssistantMessage(dto.getContent()));
                    } else {
                        springAiMessages.add(new UserMessage(dto.getContent()));
                    }
                }
            }

            var promptClient = chatClient.prompt().messages(springAiMessages);

            if (isMerchant) {
                // MERCHANT MODE: Merchant system prompt + Merchant tools ONLY
                return promptClient
                        .system(MERCHANT_SYSTEM_PROMPT)
                        .tools(profitOptimizationTool, deliveryOptimizationTool, businessInsightsTool)
                        .call()
                        .content();
            } else {
                // USER MODE: Consumer system prompt + Product catalog tools ONLY
                return promptClient
                        .system(USER_SYSTEM_PROMPT)
                        .tools(productSearchTool, productCrossSellTool)
                        .call()
                        .content();
            }

        } catch (Exception ex) {
            ex.printStackTrace();
            return "I'm having trouble retrieving business operations data right now. Please try again.";
        }
    }
}