package com.Ecomm.prj.Service;

import com.Ecomm.prj.Dto.HomeResponse;
import com.Ecomm.prj.Dto.ProductDto;
import com.Ecomm.prj.Model.Product;
import com.Ecomm.prj.repository.ProductRepository;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.stream.Collectors;

@Service
public class HomeService {
    private ProductRepository repo;
    public HomeService(ProductRepository repo){
        this.repo=repo;
    }
    public HomeResponse getHomeData() {

        List<Product> products = repo.findTop6ByOrderByIdDesc();

        List<ProductDto> dtoList = products.stream()
                .map(p -> new ProductDto(
                        p.getId(),
                        p.getName(),
                        p.getPrice(),
                        p.getImageUrl(),
                        p.getCategory()
                ))
                .collect(Collectors.toList());

        return new HomeResponse(dtoList);
    }
}
