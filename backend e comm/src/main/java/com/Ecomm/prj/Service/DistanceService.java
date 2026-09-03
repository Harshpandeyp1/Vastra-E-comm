
        package com.Ecomm.prj.Service;

import org.springframework.stereotype.Service;

@Service
public class DistanceService {

    private static final double EARTH_RADIUS_KM = 6371.0;

    public double calculateDistance(
            double latitude1,
            double longitude1,
            double latitude2,
            double longitude2) {

        // Convert degrees to radians
        double lat1 = Math.toRadians(latitude1);
        double lat2 = Math.toRadians(latitude2);

        double deltaLat =
                Math.toRadians(latitude2 - latitude1);

        double deltaLon =
                Math.toRadians(longitude2 - longitude1);

        // Haversine formula
        double a =
                Math.sin(deltaLat / 2) *
                        Math.sin(deltaLat / 2)
                        +
                        Math.cos(lat1) *
                                Math.cos(lat2) *
                                Math.sin(deltaLon / 2) *
                                Math.sin(deltaLon / 2);

        double c =
                2 * Math.atan2(
                        Math.sqrt(a),
                        Math.sqrt(1 - a)
                );

        return EARTH_RADIUS_KM * c;
    }
}

