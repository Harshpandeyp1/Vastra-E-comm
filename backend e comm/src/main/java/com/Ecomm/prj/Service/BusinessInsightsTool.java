
        package com.Ecomm.prj.Service;

import com.Ecomm.prj.Dto.BusinessInsightProduct;
import com.Ecomm.prj.Dto.BusinessProfitProduct;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class BusinessInsightsTool {

    private final BusinessInsightsService businessInsightsService;

    public BusinessInsightsTool(
            BusinessInsightsService businessInsightsService) {

        this.businessInsightsService =
                businessInsightsService;
    }

    // =========================================================
    // 1. BEST-SELLING PRODUCTS
    // =========================================================

    @Tool(
            description = """
            Analyze the merchant's real Vastra business sales data.

            Use this tool when a merchant asks:
            - What are my best-selling products?
            - Which products sell the most?
            - Which products generate the most revenue?
            - Show me my sales performance.
            - Which products should I promote?

            Use real data from the Vastra database.

            Never invent sales, quantity, revenue, or profit numbers.
            """
    )
    public List<BusinessInsightProduct> getBestSellingProducts() {

        // Get currently logged-in merchant
        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "Merchant is not authenticated"
            );
        }

        // JWT username/email
        String merchantEmail =
                authentication.getName();

        // Send merchant email to service
        return businessInsightsService
                .getBestSellingProducts(merchantEmail);
    }


    // =========================================================
    // 2. MOST PROFITABLE PRODUCTS
    // =========================================================

    @Tool(
            description = """
            Analyze the merchant's most profitable products.

            Use this tool when the merchant asks:
            - Which products make the most profit?
            - What are my most profitable products?
            - Which products generate the highest profit?
            - Show me my profit by product.
            - Which products should I focus on for profit?

            The calculation uses:
            selling price - product cost price
            multiplied by quantity sold.

            Use real Vastra database data.

            Never invent revenue, cost, quantity, or profit numbers.
            """
    )
    public List<BusinessProfitProduct> getMostProfitableProducts() {

        // Get currently logged-in merchant
        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "Merchant is not authenticated"
            );
        }

        // Get merchant email from JWT
        String merchantEmail =
                authentication.getName();

        // Ask service to find merchant
        // and calculate profitable products
        return businessInsightsService
                .getMostProfitableProducts(merchantEmail);
    }
}

