package com.Ecomm.prj.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class orderDto {
    private int userId;
    private String address;
}
