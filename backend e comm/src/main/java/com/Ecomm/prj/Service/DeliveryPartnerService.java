
        package com.Ecomm.prj.Service;

import com.Ecomm.prj.Model.DeliveryPartner;
import com.Ecomm.prj.repository.DeliveryPartnerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeliveryPartnerService {

    private final DeliveryPartnerRepository deliveryPartnerRepository;

    public DeliveryPartnerService(
            DeliveryPartnerRepository deliveryPartnerRepository) {

        this.deliveryPartnerRepository = deliveryPartnerRepository;
    }

    public List<DeliveryPartner> getAvailablePartners() {

        return deliveryPartnerRepository.findByAvailableTrue();
    }
}

