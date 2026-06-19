package com.Ecomm.prj.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDto {
  private long id;
  private String name;
  private Double price;
  private String imageUrl;
  private String category;
}
