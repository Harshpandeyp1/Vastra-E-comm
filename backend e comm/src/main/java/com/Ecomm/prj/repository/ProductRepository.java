package com.Ecomm.prj.repository;

import com.Ecomm.prj.Model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // =========================
    // BASIC PRODUCT QUERIES
    // =========================

    List<Product> findByCategory(String category);

    List<Product> findTop6ByOrderByIdDesc();


    // =========================
    // MERCHANT QUERIES
    // =========================

    List<Product> findByMerchantId(Long merchantId);

    List<Product> findByMerchantIdAndId(
            Long merchantId,
            Long productId
    );


    // =========================
    // PRICE QUERIES
    // =========================

    List<Product> findByPriceLessThanEqual(
            BigDecimal maxPrice
    );


    // =========================
    // CATEGORY QUERIES
    // =========================

    List<Product> findByCategoryIgnoreCase(
            String category
    );

    List<Product> findByCategoryIgnoreCaseAndPriceLessThanEqual(
            String category,
            BigDecimal maxPrice
    );


    // =========================
    // GENDER QUERIES
    // =========================

    List<Product> findByGenderIgnoreCase(
            String gender
    );

    List<Product> findByGenderIgnoreCaseAndPriceLessThanEqual(
            String gender,
            BigDecimal maxPrice
    );


    // =========================
    // CATEGORY + GENDER
    // =========================

    List<Product> findByCategoryIgnoreCaseAndGenderIgnoreCase(
            String category,
            String gender
    );

    List<Product> findByCategoryIgnoreCaseAndGenderIgnoreCaseAndPriceLessThanEqual(
            String category,
            String gender,
            BigDecimal maxPrice
    );


    // =========================
    // OCCASION
    // =========================

    List<Product> findByOccasionIgnoreCase(
            String occasion
    );

    List<Product> findByOccasionIgnoreCaseAndPriceLessThanEqual(
            String occasion,
            BigDecimal maxPrice
    );


    // =========================
    // GENDER + OCCASION
    // =========================

    List<Product> findByGenderIgnoreCaseAndOccasionIgnoreCase(
            String gender,
            String occasion
    );

    List<Product> findByGenderIgnoreCaseAndOccasionIgnoreCaseAndPriceLessThanEqual(
            String gender,
            String occasion,
            BigDecimal maxPrice
    );


    // =========================
    // CATEGORY + OCCASION
    // =========================

    List<Product> findByCategoryIgnoreCaseAndOccasionIgnoreCase(
            String category,
            String occasion
    );

    List<Product> findByCategoryIgnoreCaseAndOccasionIgnoreCaseAndPriceLessThanEqual(
            String category,
            String occasion,
            BigDecimal maxPrice
    );


    // =========================
    // CATEGORY + GENDER + OCCASION
    // =========================

    List<Product> findByCategoryIgnoreCaseAndGenderIgnoreCaseAndOccasionIgnoreCase(
            String category,
            String gender,
            String occasion
    );

    List<Product> findByCategoryIgnoreCaseAndGenderIgnoreCaseAndOccasionIgnoreCaseAndPriceLessThanEqual(
            String category,
            String gender,
            String occasion,
            BigDecimal maxPrice
    );


    // =========================
    // PRODUCT NAME SEARCH
    // =========================

    List<Product> findByNameContainingIgnoreCase(
            String name
    );

    List<Product> findByNameContainingIgnoreCaseAndPriceLessThanEqual(
            String name,
            BigDecimal maxPrice
    );
    List<Product> findTop6ByGenderIgnoreCaseAndIdNot(
            String gender,
            Long productId
    );
}