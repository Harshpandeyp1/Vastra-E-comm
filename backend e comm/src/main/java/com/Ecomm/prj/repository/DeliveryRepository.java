package com.Ecomm.prj.repository;

import com.Ecomm.prj.Model.Delivery;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {

    Optional<Delivery> findByOrder_Id(int orderId);

    @Query("""
        SELECT DISTINCT d
        FROM Delivery d
        JOIN FETCH d.order o
        JOIN FETCH o.orderItems oi
        JOIN FETCH oi.product p
        JOIN FETCH p.merchant m
        WHERE d.id = :deliveryId
    """)
    Optional<Delivery> findDeliveryForOptimization(@Param("deliveryId") Long deliveryId);

    @Query("""
        SELECT DISTINCT d
        FROM Delivery d
        JOIN FETCH d.order o
        JOIN FETCH o.orderItems oi
        JOIN FETCH oi.product p
        JOIN FETCH p.merchant m
        WHERE d.deliveryStatus = :status
        AND m.id = :merchantId
    """)
    List<Delivery> findPendingDeliveriesForMerchant(
            String status,
            Long merchantId
    );
    @Query("""
    SELECT DISTINCT d
    FROM Delivery d
    JOIN FETCH d.order o
    JOIN FETCH o.orderItems oi
    JOIN FETCH oi.product p
    JOIN FETCH p.merchant m
    WHERE d.deliveryStatus = :status
    AND m.id = :merchantId
""")
    List<Delivery> findDeliveriesForMerchantByStatus(
            @Param("status") String status,
            @Param("merchantId") Long merchantId
    );

}
