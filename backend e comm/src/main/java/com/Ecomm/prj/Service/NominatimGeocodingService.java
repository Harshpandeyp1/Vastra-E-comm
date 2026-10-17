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
            throw new IllegalArgumentException("Address cannot be empty");
        }

        // 1. Try the complete address
        LocationCoordinates coordinates = searchLocation(address);

        if (coordinates != null) {
            return coordinates;
        }

        // 2. Try cleaned address
        String cleanedAddress = cleanAddress(address);

        coordinates = searchLocation(cleanedAddress);

        if (coordinates != null) {
            return coordinates;
        }

        // 3. Try PIN code
        String pinCode = extractPinCode(address);

        if (pinCode != null) {

            coordinates = searchLocation(
                    pinCode + ", India"
            );

            if (coordinates != null) {
                return coordinates;
            }
        }

        throw new IllegalArgumentException(
                "Location not found for address: " + address
        );
    }
    private LocationCoordinates searchLocation(String address) {

        String searchAddress = address.trim();

        if (!searchAddress
                .toLowerCase()
                .endsWith("india")) {

            searchAddress = searchAddress + ", India";
        }

        String finalSearchAddress = searchAddress;

        try {

            List<NominatimResponse> results =
                    restClient.get()
                            .uri(uriBuilder -> uriBuilder
                                    .path("/search")
                                    .queryParam(
                                            "q",
                                            finalSearchAddress
                                    )
                                    .queryParam(
                                            "format",
                                            "jsonv2"
                                    )
                                    .queryParam(
                                            "limit",
                                            1
                                    )
                                    .queryParam(
                                            "countrycodes",
                                            "in"
                                    )
                                    .build()
                            )
                            .header(
                                    "User-Agent",
                                    "Vastra-Ecommerce/1.0"
                            )
                            .accept(
                                    MediaType.APPLICATION_JSON
                            )
                            .retrieve()
                            .body(
                                    new ParameterizedTypeReference<
                                            List<NominatimResponse>
                                            >() {}
                            );

            if (results == null || results.isEmpty()) {
                return null;
            }

            NominatimResponse result =
                    results.get(0);

            return new LocationCoordinates(
                    Double.parseDouble(result.lat()),
                    Double.parseDouble(result.lon())
            );

        } catch (Exception e) {

            // External geocoding service failed.
            // Return null so that fallback can be attempted.
            return null;
        }
    }

    private String simplifyAddress(String address) {

        String simplified = address;

        // Remove customer name and phone number
        if (simplified.contains("|")) {

            String[] parts =
                    simplified.split("\\|");

            // Usually the actual address is after
            // the name/phone sections.
            if (parts.length >= 3) {

                simplified =
                        parts[parts.length - 1].trim();
            }
        }

        // Remove "PIN:" label
        simplified =
                simplified.replace(
                        "PIN:",
                        ""
                ).trim();

        // Remove duplicate commas/spaces
        simplified =
                simplified.replaceAll(
                        "\\s+",
                        " "
                );

        return simplified;
    }

    private record NominatimResponse(
            String lat,
            String lon
    ) {
    }

    private String cleanAddress(String address) {

        String cleaned = address.trim();

        // Remove everything before the actual address
        // Example:
        // Harsh kumar (HOME) | Ph: 700... | nildih...
        if (cleaned.contains("|")) {

            String[] parts = cleaned.split("\\|");

            if (parts.length >= 3) {
                cleaned = parts[parts.length - 1].trim();
            }
        }

        cleaned = cleaned
                .replace("PIN:", "")
                .replaceAll("\\s+", " ")
                .trim();

        return cleaned;
    }
    private String extractPinCode(String address) {

        java.util.regex.Pattern pattern =
                java.util.regex.Pattern.compile("\\b\\d{6}\\b");

        java.util.regex.Matcher matcher =
                pattern.matcher(address);

        if (matcher.find()) {
            return matcher.group();
        }

        return null;
    }
}