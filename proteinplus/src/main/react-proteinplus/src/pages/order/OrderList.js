import React, {useEffect, useState} from 'react';
import '../../styles/order/css/OrderDetail.scoped.css';
import MypageFrame from '../../components/MypageFrame';
import axios from "axios";

export default function OrderList(){
    const tempProductData = [
        {
            id: 1,
            name: '[맛있닭] 닭가슴살 스테이크',
            imageUrl: 'https://file.rankingdak.com/image/RANK/PRODUCT/PRD001/20240109/IMG1704AEO777787343_330_330.jpg',
            salePercent: 29,
            price: '17,900',
            originalPrice: '24,900',
            rating: '★4.9',
            totalRating: '(82,648)'
        }
    ];

    const [orderListData, setOrderListData] = useState([]);

    async function getOrderList() { // Axios 방식 사용
        const Spring_Server_Ip = process.env.REACT_APP_Spring_Server_Ip;
        const response = await axios.get(`${Spring_Server_Ip}/api/user/mypage/orderlist`);
        setOrderListData(response.data);
    }

    useEffect(() => {
        // 카테고리 전체 조회 함수 호출
        getOrderList();
    }, []);

    const handleCancelOrder = async (orderId) => {
        try {
            const Spring_Server_Ip = process.env.REACT_APP_Spring_Server_Ip;
            await axios.post(`${Spring_Server_Ip}/api/user/mypage/orderlist/${orderId}`);
            // 주문 취소 성공 시 화면 갱신 또는 사용자에게 알림
        } catch (error) {
            // 오류 처리
            console.error('주문 취소 중 오류가 발생했습니다:', error);
        }
    };

    const renderOrderListItems = () => {
        if (tempProductData.length === 0) {
            return (
                <div>
                    <div className="menu-title-area">
                        <h3 className="title-menu">주문내역</h3>
                    </div>
                    {/* menu-title-area */}
                    <div className="search-box">
                        <div className="search-detail">
                            <fieldset>
                                <legend>상세 검색</legend>
                                <div className="search-detail-top">
                                    <div className="search-detail-date-itemname">
                                        <div className="input-group w-full">
                                            <label for="item1-1" className="blind">검색</label>
                                            <input type="text" id="item1-1" name="srchProductNm" className="input-text"
                                                   placeholder="주문 상품명 검색" value=""/>
                                            <span className="input-group-btn">
                                                <button type="submit" className="btn-icon-search search-word"
                                                        title=""><i className="ico-btn-search"></i>
                                                    <span className="blind">검색하기</span>
                                                </button>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                        {/* search-detail*/}
                    </div>
                    {/* search-box */}
                    <div className="order-list-area">
                        <ul className="order-list-inner">
                            <div className = "no-data">
                                <p className = "message">
                                    주문내역이 없습니다.
                                </p>
                            </div>
                        </ul>
                    </div>
                </div>
            );
        }

        return (
            <div>
                <div className="menu-title-area">
                    <h3 className="title-menu">주문내역</h3>
                </div>
                {/* menu-title-area */}
                <div className="search-box">
                    <div className="search-detail">
                        <fieldset>
                            <legend>상세 검색</legend>
                            <div className="search-detail-top">
                                <div className="search-detail-date-itemname">
                                    <div className="input-group w-full">
                                        <label for="item1-1" className="blind">검색</label>
                                        <input type="text" id="item1-1" name="srchProductNm" className="input-text"
                                               placeholder="주문 상품명 검색" value=""/>
                                        <span className="input-group-btn">
                                            <button type="submit" className="btn-icon-search search-word" title=""><i
                                                className="ico-btn-search"></i>
                                                <span className="blind">검색하기</span>
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {/* search-detail*/}
                </div>
                {/* search-box */}
                <div className="order-list-area">
                    <ul className="order-list-inner">
                        <li>
                            {/* 주문 목록 */}
                            <div className="order-list-head">
                                <strong className="date">주문날짜</strong>
                                <div className="right">
                                    <span className="order-item-id">주문번호</span>
                                </div>
                            </div>
                            <div className="order-content-box">
                                <ul className="order-div-list">
                                    {tempProductData.map(item => (
                                        <li key={item.id} className="order-div-item">
                                            <div className="prd-info-area">
                                                <div className="inner">
                                                    <div className="column img">
                                                        <a href="javascript:void(0);">
                                                            <img src={item.imageUrl} alt="상품이미지"/>
                                                        </a>
                                                    </div>
                                                    <div className="column tit">
                                                        <div className="prd-state-row">
                                                            <strong className="prd-state-head">배송상태표시</strong>
                                                        </div>
                                                        <div className="tit">
                                                            <a href="javascript:void(0);">{item.name}</a>
                                                        </div>
                                                        <p className="desc">상품옵션</p>
                                                    </div>
                                                    <div className="column col-btn-group">
                                                        <div className="col-btn-group-inn">
                                                            <button onClick={() => handleCancelOrder(item.id)}
                                                                    className="prd-control-btn">
                                                                <span>취소</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="price-item">
                                                        <div className="dlv-nmr">
                                                            <p className="dlv-nmr-price">
                                                                <span className="num">{item.price}</span>원
                                                            </p>
                                                            <p className="dlv-nmr-cnt">
                                                                <span className="num">상품개수</span>개
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="addr-info-line">
                                    <p><i className="ico-bl-home2"></i>주소</p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    };

    return <MypageFrame>{renderOrderListItems()}</MypageFrame>;
}

