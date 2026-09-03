
        package com.Ecomm.prj.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "delivery_partners")
public class DeliveryPartner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // Base charge for the shipment
    private BigDecimal baseCost;

    // Additional cost for every kilometer
    private BigDecimal costPerKm;

    // Expected delivery time
    private Integer estimatedDays;

    // Historical reliability percentage
    private Double reliabilityScore;

    // Whether the partner is currently available
    private boolean available;
}

