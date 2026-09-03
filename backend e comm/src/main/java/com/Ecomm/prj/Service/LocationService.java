
        package com.Ecomm.prj.Service;

import com.Ecomm.prj.Dto.LocationCoordinates;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
public class LocationService {

    private final RestClient restClient;

    public LocationService(RestClient.Builder builder) {
        this.restClient = builder
                .baseUrl("https://nominatim.openstreetmap.org")
                .build();
    }

    public LocationCoordinates getCoordinates(String address) {

        if (address == null || address.isBlank()) {
            throw new RuntimeException("Address cannot be empty");
        }

        List<NominatimResponse> results =
                restClient.get()
                        .uri(uriBuilder -> uriBuilder
                                .path("/search")
                                .queryParam("q", address + ", India")
                                .queryParam("format", "json")
                                .queryParam("limit", 1)
                                .build())
                        .header(
                                "User-Agent",
                                "Vastra-Ecommerce-Application"
                        )
                        .accept(MediaType.APPLICATION_JSON)
                        .retrieve()
                        .body(new org.springframework.core.ParameterizedTypeReference<>() {});

        if (results == null || results.isEmpty()) {
            throw new RuntimeException(
                    "Location not found for address: " + address
            );
        }

        NominatimResponse result = results.get(0);

        return new LocationCoordinates(
                Double.parseDouble(result.lat()),
                Double.parseDouble(result.lon())
        );
    }

    private record NominatimResponse(
            String lat,
            String lon
    ) {
    }
}

