import React, {useEffect, useState} from 'react';
import '../../styles/order/css/OrderDetail.scoped.css';
import MypageFrame from '../../components/MypageFrame';
import axios from "axios";

export default function CancelList() {
    const [cancelListData, setCancelListData] = useState([]);

    async function getCancelList() {
        try {
            const Spring_Server_Ip = process.env.REACT_APP_Spring_Server_Ip;
            const response = await axios.get(`${Spring_Server_Ip}/api/user/mypage/cancellist`);
            setCancelListData(response.data.content);
        } catch (error) {
            console.error('취소 내역을 불러오는 중 오류가 발생했습니다:', error);
        }
    }

    useEffect(() => {
        // 취소 내역 조회 함수 호출
        getCancelList();
    }, []);

    const renderOrderListItems = () => {
        if (cancelListData.length === 0) {
            return (
                <div>
                    <div className="menu-title-area">
                        <h3 className="title-menu">취소내역</h3>
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
                                                   placeholder="취소 상품명 검색" value=""/>
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
                                    취소내역이 없습니다.
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
                    <h3 className="title-menu">취소내역</h3>
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
                                               placeholder="취소 상품명 검색" value=""/>
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
                        {cancelListData.map((item) => (
                            <li key={item.orderId}>
                                {/* 주문 목록 */}
                                <div className="order-list-head">
                                    <strong className="date">{item.orderDate}</strong>
                                    <div className="right">
                                        <span className="order-item-id">{item.orderId}</span>
                                    </div>
                                </div>
                                <div className="order-content-box">
                                    <ul className="order-div-list">
                                        <li className="order-div-item">
                                            <div className="prd-info-area">
                                                <div className="inner">
                                                    <div className="column img">
                                                        <img src={item.orderDetailDtoList[0].mainImageUrl} alt="상품이미지"/>
                                                    </div>
                                                    <div className="column tit">
                                                        <div className="prd-state-row">
                                                            <strong className="prd-state-head">{item.orderStatus}</strong>
                                                        </div>
                                                        <div className="tit">
                                                            <a href="javascript:void(0);">{item.orderDetailDtoList[0].productName}</a>
                                                        </div>
                                                    </div>
                                                    <div className="price-item">
                                                        <div className="dlv-nmr">
                                                            <p className="dlv-nmr-price">
                                                                <span className="num">{item.orderDetailDtoList[0].price}</span>원
                                                            </p>
                                                            <p className="dlv-nmr-cnt">
                                                                <span className="num">{item.orderDetailDtoList[0].count}</span>개
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                    <div className="addr-info-line">
                                        <p><i className="ico-bl-home2"></i>주소</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    };

    return <MypageFrame>{renderOrderListItems()}</MypageFrame>;
}

