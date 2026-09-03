package com.Ecomm.prj.repository;

import com.Ecomm.prj.Model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface orderrepo extends JpaRepository<Order,Integer> {
    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.orderItems oi LEFT JOIN FETCH oi.product p LEFT JOIN FETCH p.merchant m WHERE o.user.id = :userId")
    List<Order> findByUser_Id(Long userId);

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.orderItems oi LEFT JOIN FETCH oi.product p LEFT JOIN FETCH p.merchant m WHERE m.id = :merchantId")
    List<Order> findDistinctByOrderItems_Product_Merchant_Id(Long merchantId);

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.orderItems oi LEFT JOIN FETCH oi.product p LEFT JOIN FETCH p.merchant m WHERE o.id = :orderId")
    Optional<Order> findOrderForMerchant(@Param("orderId") int orderId );
}
