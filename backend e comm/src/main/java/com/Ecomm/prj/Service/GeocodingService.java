
        package com.Ecomm.prj.Service;

import com.Ecomm.prj.Dto.LocationCoordinates;

public interface GeocodingService {

    LocationCoordinates getCoordinates(String address);
}

