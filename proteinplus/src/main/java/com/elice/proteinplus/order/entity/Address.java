package com.elice.proteinplus.order.entity;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
public class Address {
    private String zipcode; //서울시
    private String address; //--시 --구 도로명주소
    private String addressDetail; //상세주소

}
