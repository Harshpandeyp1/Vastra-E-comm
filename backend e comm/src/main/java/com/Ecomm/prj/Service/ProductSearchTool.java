package com.Ecomm.prj.Service;

import com.Ecomm.prj.Model.Product;
import com.Ecomm.prj.repository.ProductRepository;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class ProductSearchTool {

    private final ProductRepository productRepository;

    public ProductSearchTool(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }


    // =========================================================
    // TOOL 1: SEARCH BY PRODUCT NAME
    // =========================================================

    @Tool(
            description = """
                    Find a specific Vastra product by its exact or
                    partial product name.

                    Use this when the customer mentions a specific
                    product name and wants details or comparison.

                    Examples:

                    "Tell me about Oversized Premium Hoodie"
                    -> name = "Oversized Premium Hoodie"

                    "Show me the Urban Jacket"
                    -> name = "Urban Jacket"

                    Only return products that actually exist
                    in the Vastra database.

                    Never invent products.
                    """
    )
    public List<Product> findProductByName(String name) {

        if (name == null || name.isBlank()) {
            return List.of();
        }

        return productRepository
                .findByNameContainingIgnoreCase(name.trim());
    }


    // =========================================================
    // TOOL 2: SEARCH PRODUCTS
    // =========================================================

    @Tool(
            description = """
                    Search the real Vastra product inventory.

                    ALL PARAMETERS ARE OPTIONAL.

                    Use this tool whenever the customer asks about
                    actual Vastra products.

                    --------------------------------------------
                    CATEGORY
                    --------------------------------------------

                    The type of fashion product.

                    Examples:

                    hoodie
                    shirt
                    jacket
                    dress
                    skirt
                    gown
                    t-shirt
                    polo
                    tracksuit
                    streetwear

                    If category is not specified, use null.

                    --------------------------------------------
                    GENDER
                    --------------------------------------------

                    Allowed values:

                    MEN
                    WOMEN
                    KIDS
                    UNISEX

                    Examples:

                    "men's products"
                    -> gender = MEN

                    "women's clothes"
                    -> gender = WOMEN

                    "kids clothes"
                    -> gender = KIDS

                    If gender is not specified, use null.

                    --------------------------------------------
                    OCCASION
                    --------------------------------------------

                    Use the occasion when the customer specifies
                    where or when they want to wear the product.

                    Examples:

                    CASUAL
                    FORMAL
                    PARTY

                    "something for a party"
                    -> occasion = PARTY

                    "casual clothes"
                    -> occasion = CASUAL

                    "formal shirt"
                    -> occasion = FORMAL

                    If occasion is not specified, use null.

                    --------------------------------------------
                    MAXIMUM PRICE
                    --------------------------------------------

                    Use maxPrice when the customer gives a budget.

                    Examples:

                    "under ₹1500"
                    -> maxPrice = 1500

                    "below 2000"
                    -> maxPrice = 2000

                    "within ₹1000"
                    -> maxPrice = 1000

                    If no budget is specified, use null.

                    --------------------------------------------
                    IMPORTANT
                    --------------------------------------------

                    Do NOT ask for a category if the customer
                    already provided gender, occasion, or budget.

                    Search the database using whatever information
                    the customer has provided.

                    Examples:

                    "women's products under ₹1200"

                    category = null
                    gender = WOMEN
                    occasion = null
                    maxPrice = 1200


                    "men's casual clothes under ₹1500"

                    category = null
                    gender = MEN
                    occasion = CASUAL
                    maxPrice = 1500


                    "women's dresses for a party under ₹2000"

                    category = DRESS
                    gender = WOMEN
                    occasion = PARTY
                    maxPrice = 2000


                    "hoodies under ₹1500"

                    category = HOODIE
                    gender = null
                    occasion = null
                    maxPrice = 1500


                    "show me party dresses"

                    category = DRESS
                    gender = null
                    occasion = PARTY
                    maxPrice = null


                    "products under ₹1000"

                    category = null
                    gender = null
                    occasion = null
                    maxPrice = 1000


                    --------------------------------------------
                    DATABASE RULE
                    --------------------------------------------

                    Always search the real Vastra database when
                    the customer asks for actual products.

                    Never invent:

                    - product names
                    - prices
                    - discounts
                    - stock
                    - availability
                    - product features

                    Only recommend products returned by this tool.
                    """
    )
    public List<Product> searchProducts(
            String category,
            String gender,
            String occasion,
            BigDecimal maxPrice) {


        // Normalize values before searching

        category = normalize(category);
        gender = normalize(gender);
        occasion = normalize(occasion);


        // =====================================================
        // 1. CATEGORY + GENDER + OCCASION + PRICE
        // =====================================================

        if (category != null
                && gender != null
                && occasion != null
                && maxPrice != null) {

            return productRepository
                    .findByCategoryIgnoreCaseAndGenderIgnoreCaseAndOccasionIgnoreCaseAndPriceLessThanEqual(
                            category,
                            gender,
                            occasion,
                            maxPrice
                    );
        }


        // =====================================================
        // 2. CATEGORY + GENDER + OCCASION
        // =====================================================

        if (category != null
                && gender != null
                && occasion != null) {

            return productRepository
                    .findByCategoryIgnoreCaseAndGenderIgnoreCaseAndOccasionIgnoreCase(
                            category,
                            gender,
                            occasion
                    );
        }


        // =====================================================
        // 3. CATEGORY + GENDER + PRICE
        // =====================================================

        if (category != null
                && gender != null
                && maxPrice != null) {

            return productRepository
                    .findByCategoryIgnoreCaseAndGenderIgnoreCaseAndPriceLessThanEqual(
                            category,
                            gender,
                            maxPrice
                    );
        }


        // =====================================================
        // 4. CATEGORY + OCCASION + PRICE
        // =====================================================

        if (category != null
                && occasion != null
                && maxPrice != null) {

            return productRepository
                    .findByCategoryIgnoreCaseAndOccasionIgnoreCaseAndPriceLessThanEqual(
                            category,
                            occasion,
                            maxPrice
                    );
        }


        // =====================================================
        // 5. GENDER + OCCASION + PRICE
        // =====================================================

        if (gender != null
                && occasion != null
                && maxPrice != null) {

            return productRepository
                    .findByGenderIgnoreCaseAndOccasionIgnoreCaseAndPriceLessThanEqual(
                            gender,
                            occasion,
                            maxPrice
                    );
        }


        // =====================================================
        // 6. CATEGORY + GENDER
        // =====================================================

        if (category != null
                && gender != null) {

            return productRepository
                    .findByCategoryIgnoreCaseAndGenderIgnoreCase(
                            category,
                            gender
                    );
        }


        // =====================================================
        // 7. CATEGORY + OCCASION
        // =====================================================

        if (category != null
                && occasion != null) {

            return productRepository
                    .findByCategoryIgnoreCaseAndOccasionIgnoreCase(
                            category,
                            occasion
                    );
        }


        // =====================================================
        // 8. GENDER + OCCASION
        // =====================================================

        if (gender != null
                && occasion != null) {

            return productRepository
                    .findByGenderIgnoreCaseAndOccasionIgnoreCase(
                            gender,
                            occasion
                    );
        }


        // =====================================================
        // 9. CATEGORY + PRICE
        // =====================================================

        if (category != null
                && maxPrice != null) {

            return productRepository
                    .findByCategoryIgnoreCaseAndPriceLessThanEqual(
                            category,
                            maxPrice
                    );
        }


        // =====================================================
        // 10. GENDER + PRICE
        // =====================================================

        if (gender != null
                && maxPrice != null) {

            return productRepository
                    .findByGenderIgnoreCaseAndPriceLessThanEqual(
                            gender,
                            maxPrice
                    );
        }


        // =====================================================
        // 11. OCCASION + PRICE
        // =====================================================

        if (occasion != null
                && maxPrice != null) {

            return productRepository
                    .findByOccasionIgnoreCaseAndPriceLessThanEqual(
                            occasion,
                            maxPrice
                    );
        }


        // =====================================================
        // 12. CATEGORY ONLY
        // =====================================================

        if (category != null) {

            return productRepository
                    .findByCategoryIgnoreCase(category);
        }


        // =====================================================
        // 13. GENDER ONLY
        // =====================================================

        if (gender != null) {

            return productRepository
                    .findByGenderIgnoreCase(gender);
        }


        // =====================================================
        // 14. OCCASION ONLY
        // =====================================================

        if (occasion != null) {

            return productRepository
                    .findByOccasionIgnoreCase(occasion);
        }


        // =====================================================
        // 15. PRICE ONLY
        // =====================================================

        if (maxPrice != null) {

            return productRepository
                    .findByPriceLessThanEqual(maxPrice);
        }


        // =====================================================
        // 16. NO FILTERS
        // =====================================================

        return productRepository.findAll();
    }


    // =========================================================
    // HELPER METHOD
    // =========================================================

    private String normalize(String value) {

        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim().toUpperCase();
    }
}