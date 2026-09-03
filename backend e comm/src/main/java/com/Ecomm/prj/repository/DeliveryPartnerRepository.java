
        package com.Ecomm.prj.repository;

import com.Ecomm.prj.Model.DeliveryPartner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryPartnerRepository
        extends JpaRepository<DeliveryPartner, Long> {

    List<DeliveryPartner> findByAvailableTrue();
}

