  package com.Ecomm.prj.repository;

import com.Ecomm.prj.Dto.BusinessInsightProduct;
import com.Ecomm.prj.Dto.BusinessProfitProduct;
import com.Ecomm.prj.Model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemRepo extends JpaRepository<OrderItem, Long> {

    @Query("""
        SELECT new com.Ecomm.prj.Dto.BusinessInsightProduct(
            oi.product.name,
            SUM(oi.quantity),
            SUM(oi.price * oi.quantity)
        )
        FROM OrderItem oi
        JOIN oi.product p
        WHERE p.merchant.id = :merchantId
        GROUP BY oi.product.id, oi.product.name
        ORDER BY SUM(oi.quantity) DESC
    """)
    List<BusinessInsightProduct> findBestSellingProducts(
            @Param("merchantId") Long merchantId);


    @Query("""
        SELECT new com.Ecomm.prj.Dto.BusinessProfitProduct(
            oi.product.name,
            SUM(oi.quantity),
            SUM(oi.price * oi.quantity),
            SUM(oi.product.costPrice * oi.quantity),
            SUM((oi.price - oi.product.costPrice) * oi.quantity)
        )
        FROM OrderItem oi
        JOIN oi.product p
        WHERE p.merchant.id = :merchantId
        GROUP BY oi.product.id, oi.product.name
        ORDER BY SUM((oi.price - oi.product.costPrice) * oi.quantity) DESC
    """)
    List<BusinessProfitProduct> findMostProfitableProducts(
            @Param("merchantId") Long merchantId);
}
