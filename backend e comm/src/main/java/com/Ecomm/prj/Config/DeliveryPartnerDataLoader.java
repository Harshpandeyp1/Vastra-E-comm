
        package com.Ecomm.prj.Config;

import com.Ecomm.prj.Model.DeliveryPartner;
import com.Ecomm.prj.repository.DeliveryPartnerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DeliveryPartnerDataLoader {

    @Bean
    CommandLineRunner loadDeliveryPartners(
            DeliveryPartnerRepository repository) {

        return args -> {

            if (repository.count() > 0) {
                return;
            }

            DeliveryPartner delhivery = new DeliveryPartner();

            delhivery.setName("Delhivery");
            delhivery.setBaseCost(BigDecimal.valueOf(40));
            delhivery.setCostPerKm(BigDecimal.valueOf(8));
            delhivery.setEstimatedDays(2);
            delhivery.setReliabilityScore(94.0);
            delhivery.setAvailable(true);

            repository.save(delhivery);


            DeliveryPartner shiprocket = new DeliveryPartner();

            shiprocket.setName("Shiprocket");
            shiprocket.setBaseCost(BigDecimal.valueOf(35));
            shiprocket.setCostPerKm(BigDecimal.valueOf(7));
            shiprocket.setEstimatedDays(3);
            shiprocket.setReliabilityScore(91.0);
            shiprocket.setAvailable(true);

            repository.save(shiprocket);


            DeliveryPartner ekart = new DeliveryPartner();

            ekart.setName("Ekart");
            ekart.setBaseCost(BigDecimal.valueOf(45));
            ekart.setCostPerKm(BigDecimal.valueOf(10));
            ekart.setEstimatedDays(1);
            ekart.setReliabilityScore(97.0);
            ekart.setAvailable(true);

            repository.save(ekart);
        };
    }
}
