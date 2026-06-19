package com.Ecomm.prj.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HomeResponse {
   private List<com.Ecomm.prj.Dto.ProductDto> trendings;
}
