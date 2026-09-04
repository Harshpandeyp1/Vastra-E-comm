package com.Ecomm.prj.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductCatalogResponse {
    private List<ProductDto> menProducts;
    private List<ProductDto> womenProducts;
    private List<ProductDto> kidsProducts;
    private List<ProductDto> trendingProducts;
}
