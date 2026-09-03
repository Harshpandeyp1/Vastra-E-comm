package com.Ecomm.prj.Service;

import com.Ecomm.prj.Dto.LocationCoordinates;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
public class NominatimGeocodingService implements GeocodingService {

    private final RestClient restClient;

    public NominatimGeocodingService(RestClient.Builder builder) {

        this.restClient = builder
                .baseUrl("https://nominatim.openstreetmap.org")
                .build();
    }

    @Override
    public LocationCoordinates getCoordinates(String address) {

        if (address == null || address.isBlank()) {
            throw new IllegalArgumentException(
                    "Address cannot be empty"
            );
        }

        // Remove extra "India" if it is already present
        String searchAddress = address.trim();

        if (!searchAddress.toLowerCase().endsWith("india")) {
            searchAddress = searchAddress + ", India";
        }

        String finalSearchAddress = searchAddress;
        List<NominatimResponse> results =
                restClient.get()
                        .uri(uriBuilder -> uriBuilder
                                .path("/search")
                                .queryParam("q", finalSearchAddress)
                                .queryParam("format", "jsonv2")
                                .queryParam("limit", 1)
                                .queryParam("countrycodes", "in")
                                .build()
                        )
                        .header(
                                "User-Agent",
                                "Vastra-Ecommerce/1.0"
                        )
                        .accept(MediaType.APPLICATION_JSON)
                        .retrieve()
                        .body(
                                new ParameterizedTypeReference<
                                        List<NominatimResponse>
                                        >() {}
                        );

        if (results == null || results.isEmpty()) {

            throw new IllegalArgumentException(
                    "Location not found for address: "
                            + address
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