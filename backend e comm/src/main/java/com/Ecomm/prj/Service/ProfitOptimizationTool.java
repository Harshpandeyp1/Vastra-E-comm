
package com.Ecomm.prj.Service;

import com.Ecomm.prj.Dto.ProfitOptimizationResponse;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

@Component
public class ProfitOptimizationTool {

    private final ProfitOptimizationService profitOptimizationService;

    public ProfitOptimizationTool(
            ProfitOptimizationService profitOptimizationService) {

        this.profitOptimizationService =
                profitOptimizationService;
    }

    @Tool(
            description = """
            Analyze the profitability of a Vastra customer order.

            Use this tool when a merchant asks questions such as:

            - How much profit did I make on this order?
            - Is this order profitable?
            - What is my profit on order 5?
            - How can I improve my profit?
            - Analyze the profit for this order.
            - Is this order making a loss?

            The tool calculates real profitability using:
            - order selling value
            - product cost price
            - product quantity

            The result is based on real Vastra database data.

            Never invent order values, product costs, or profit figures.

            The orderId must be the actual Vastra order ID.
            """
    )
    public ProfitOptimizationResponse analyzeProfit(int orderId) {

        return profitOptimizationService.analyzeProfit(orderId);
    }
}

