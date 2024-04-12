package com.elice.proteinplus.product.entity;

import com.elice.proteinplus.category.entity.Category;
//import com.elice.proteinplus.order.entity.OrderDetail;
import com.elice.proteinplus.global.entity.BaseTimeEntity;
import com.elice.proteinplus.product.dto.ProductCreateDto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "product")
@Getter
@Setter
public class Product extends BaseTimeEntity {

    @Id
    @Column(name = "product_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @OneToOne
    @JoinColumn(name = "category_id")
    private Category category;

//    //order_detail에서 product랑 ManyToOne
//    @OneToMany(mappedBy = "product")
//    private Set<OrderDetail> orderDetails = new HashSet<>();

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    //  판매가능, (품절임박), 품절
    @Column(name = "product_status", nullable = false, length = 50)
    private String productStatus;

    @Column(name = "price", nullable = false)
    private int price;  //원가


//    @Column(name = "final_price", nullable = false)
//    private int finalPrice;     //최종 가격      -> 다른 서비스단에서 계산을 구현하고 entity에 포함하지 않기로 했었어요!

//    @Column(nullable = false)
//    private String description; //상품 대표설명   -> 기존 erd에는 없던 내용인데 필요하다면 주석 해제하고 db에 잘 저장 되었는지 확인 부탁드려요!

    @Lob
    @Column(name = "content")
    private String content; //상품 상세설명

    //상품등록일
    @Column(name ="upload_date")
    private LocalDateTime uploadDate;

    @Column(name = "hits")
    private Integer hits;

    @Column(name = "discount_rate")
    private Integer  discountRate;

    @Column(nullable = false)
    private int stock;

//    public void calculateFinalPrice(){
//        if(discountRate == null){
//            finalPrice = price;
//        } else{
//            double discountFactor = 1.0 - (double) discountRate / 100; // 할인율 계산
//            double discountedPrice = price * discountFactor; // 할인된 가격 계산
//            finalPrice = (int) Math.round(discountedPrice);
//        }
//    }

    public void updateProduct(ProductCreateDto productCreateDto){
        this.name = productCreateDto.getName();
        this.price = productCreateDto.getPrice();
//        this.description = productCreateDto.getDescription();
        this.stock = productCreateDto.getStock();
        this.discountRate = productCreateDto.getDiscountRate();
        this.productStatus = productCreateDto.getProductStatus();
//        calculateFinalPrice();
    }

    //주문 수량(count)만큼 재고 감소
//    public void decreaseStock(int count){
//        if (this.stock >= count){
//            this.stock = this.stock - count;
//            if(this.stock == 0){
//                this.productStatus = "soldOut";
//            }
//        } else{
//            throw new IllegalArgumentException("재고가 부족합니다.");
//        }
//    }

    //주문 취소하면 재고 돌려놔
//    public void increaseStock(int count){
//        this.stock = this.stock + count;
//        if(this.stock > 0 && this.productStatus.equals("soldOut")){
//            this.productStatus = "sell";
//        }
//    }

//    public void updateStock(){
//        if(this.stock == 0){
//            this.productStatus = "soldOut";
//        }else{
//            this.productStatus = "sell";
//        }
//    }

}
