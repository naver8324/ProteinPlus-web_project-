import React, {useEffect, useState} from 'react';
import '../../styles/order/css/Order.scoped.css';
import Header from '../../components/Header'; // frame.js에서 Header 함수 import
import Footer from '../../components/Footer'; // frame.js에서 Footer 함수 import
import axios from "axios";
import Select from "react-select";
import {useDaumPostcodePopup} from 'react-daum-postcode';


export default function Order(){

    const tempProductData = [
        {
            id: 1,
            name: '[맛있닭] 닭가슴살 스테이크',
            imageUrl: 'https://file.rankingdak.com/image/RANK/PRODUCT/PRD001/20240109/IMG1704AEO777787343_330_330.jpg',
            salePercent: 29,
            price: '17,900',
            originalPrice: '24,900',
            rating: '★4.9',
            totalRating: '(82,648)',
        }
        ]


    const  options = [
        { value: "메세지를 선택해 주세요.", label: "메세지를 선택해 주세요." },
        { value: "직접입력", label: "직접입력" },
        { value: "배송전, 연락 부탁드립니다.", label: "배송전, 연락 부탁드립니다." },
        { value: "부재시, 전화 또는 문자 주세요.", label: "부재시, 전화 또는 문자 주세요." },
        { value: "부재시, 경비(관리)실에 맡겨주세요.", label: "부재시, 경비(관리)실에 맡겨주세요." }
    ]

    const  phoneOptions = [
        { value: "010", label: "010"},
        { value: "011", label: "011"},
        { value: "016", label: "016"},
        { value: "017", label: "017"},
        { value: "018", label: "018"},
        { value: "019", label: "019"}
    ]

    const [selectOption, setSelectOption] = useState(options[0]); // 셀렉박스 선택
    const [selectphoneOptions, setSelectphoneOptions] = useState(phoneOptions[0]);

    const [isChecked, setIsChecked] = useState(false); // 체크박스의 상태를 관리하는 useState

    const [barPosition, setBarPosition] = useState(0);

    const [deliveryReq, setDeliveryReq] = useState(''); // 배송 요청 사항
    const [receiverName, setReceiverName] = useState('');
    const [receiverPhoneNumber, setReceiverPhoneNumber] = useState('');

    const open = useDaumPostcodePopup('https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js');
    const [receiverPost, setReceiverPost] = useState('');
    const [receiverAddr, setReceiverAddr] = useState('');
    const [receiverAddrDtl, setReceiverAddrDtl] = useState('');

    const [orderSuccess, setOrderSuccess] = useState(false);

    const [orderItems, setOrderItems] = useState([]);


    // 숫자만
    const numberOnly = (event) => {
        event = event || window.event;
        const keyID = event.which || event.keyCode;
        if (
            (keyID >= 48 && keyID <= 57) ||
            (keyID >= 96 && keyID <= 105) ||
            keyID === 8 ||
            keyID === 46 ||
            keyID === 37 ||
            keyID === 39
        ) {
            return;
        } else {
            event.preventDefault();
        }
    };

    // 문자 삭제
    const removeChar = (event) => {
        event = event || window.event;
        const keyID = event.which || event.keyCode;
        if (!(keyID === 8 || keyID === 46 || keyID === 37 || keyID === 39)) {
            setReceiverPhoneNumber(event.target.value.replace(/[^0-9]/g, ""));
        }
    };

    // daum 주소 가져오기
    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }

        console.log(fullAddress); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
        setReceiverPost(data.zonecode);
        setReceiverAddr(data.roadAddress);
    };

    const handleClick = () => {
        open({ onComplete: handleComplete });
    };

    // 오른쪽 사이드 박스 스크롤 내릴 때 따라 움직이게 하는 함수
    const handleScroll = () => {
        const position = 450 < window.scrollY ? 400 : window.scrollY;
        setBarPosition(position);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // 체크박스 클릭 시 상태를 변경하는 핸들러 함수
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked); // 상태를 반전시킴
    };

    // 카트에서 주문한 상품 정보 가져오기
    async function getOrderItems() {
        // 서버로부터 상품 정보를 가져오는 요청
        const Spring_Server_Ip = process.env.REACT_APP_Spring_Server_Ip;
        const response = await axios.post(`${Spring_Server_Ip}/api/order/orderItems`);

        // 서버로부터 받은 상품 정보를 상태에 설정
        setOrderItems(response.data);
    }


    // 최종 결제 금액 계산 함수
    const calculateTotalPrice = () => {
        // 상품들의 총 가격 계산
        const subtotal = orderItems.reduce((total, item) => total + item.price * item.count, 0);

        // 배송비 (여기서는 고정 배송비로 처리)
        const shippingFee = 0; // 예시로 3000원으로 설정

        // 최종 결제 금액 계산 (상품 총 가격 + 배송비)
        return subtotal + shippingFee;
    };

    // 총 상품 금액을 계산하는 함수
    const calculateTotalProductPrice = () => {
        // 상품들의 총 가격 계산
        return orderItems.reduce((total, item) => total + item.price * item.count, 0);
    };


    // 주문 생성
    const handleOrder = async () => {
        try {
            const Spring_Server_Ip = process.env.REACT_APP_Spring_Server_Ip;

            // 주문을 생성할 때 필요한 상품 정보들을 추출합니다.
            const orderItemsInfo = orderItems.map(item => ({
                productId: item.product_id,
                count: item.count,
                orderPrice: item.price
            }));

            const response = await axios.post(
                `${Spring_Server_Ip}/api/order/order`, // userId를 어떻게 얻을지에 따라 수정해야 합니다.
                {
                    orderDto: orderItemsInfo,
                    deliveryDto: {
                        receiverName,
                        receiverPhoneNumber,
                        deliveryReq,
                        address: {
                            city: receiverPost,
                            zipcode: receiverAddr,
                            addressDetail: receiverAddrDtl
                        }
                    }
                }
            );
            console.log('주문이 생성되었습니다. 주문 ID:', response.data);
            // 주문 성공 시 처리
            setOrderSuccess(true);
        } catch (error) {
            console.error('주문 생성 중 오류가 발생했습니다:', error);
            // 주문 생성에 실패했을 때 처리할 코드를 작성합니다.
        }
    };



    return (
        <div className="wrap main">
            <Header />
            {/* ========== 컨텐츠 영역 :: container ========== */}
            <section id="contents" className="container">
                <div className="content-wrap frame-sm">
                    <div className="page-title-area">
                        <h2 className="title-page">주문/결제</h2>
                    </div>
                    <div className="order-payment-area">
                        <form id="ordFrm" name="ordFrm" action="/order/order" method="post">
                            <div className="order-info" id="orderUserInfalehfo">
                                <div className="list-head-sub">
                                    <h3 className="title-list">배송지 정보</h3>
                                </div>
                                    <div className="lineless-table type2">
                                        <table>
                                            <caption>정보 입력</caption>
                                            <colgroup>
                                                <col style={{width: "100px"}}/>
                                            </colgroup>
                                            <tbody>
                                            <tr>
                                                <th scope="row">받는분</th>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="receiverName"
                                                        title=""
                                                        className="input-text w-full removeEmoji"
                                                        value={receiverName}
                                                        onChange={(e) => setReceiverName(e.target.value)}
                                                    />
                                                </td>
                                            </tr>
                                            <tr className="row-th-top">
                                                <th scope="row">주소</th>
                                                <td>
                                                    <div className="input-group-wrap box-type">
                                                        <div className="input-group">
                                                            <div className="input-group-cell w160">
                                                                <input
                                                                    type="text"
                                                                    id="receiverZipcode"
                                                                    name="receiverPost"
                                                                    title=""
                                                                    className="input-text"
                                                                    placeholder="우편번호"
                                                                    value={receiverPost}
                                                                    readOnly
                                                                />
                                                            </div>
                                                            <div className="input-group-cell">
                                                                <input
                                                                    type="text"
                                                                    id="receiverAddr"
                                                                    name="receiverAddr"
                                                                    title=""
                                                                    className="input-text"
                                                                    placeholder="기본주소"
                                                                    value={receiverAddr}
                                                                    readOnly
                                                                />
                                                            </div>
                                                            <span className="input-group-btn">
                                                                <button className="btn-ex-white" type='button' onClick={handleClick}>
                                                                  우편번호 검색
                                                                </button>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="receiverAddrDtl"
                                                        title=""
                                                        className="input-text w-full removeEmoji"
                                                        placeholder="상세주소"
                                                        value={receiverAddrDtl}
                                                        onChange={(e) => setReceiverAddrDtl(e.target.value)}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row">휴대전화</th>
                                                <td>
                                                    <div className="input-group w-full">
                                                        <div className="input-group-form">
                                                            <div className="ui-select select-box w135" data-value="010"
                                                                 id="receiverCell1">
                                                                <Select options={phoneOptions}
                                                                        onChange={setSelectphoneOptions}
                                                                        defaultValue={phoneOptions[0]}/>
                                                            </div>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="setReceiverPhoneNumber"
                                                            value={receiverPhoneNumber}
                                                            title=""
                                                            className="input-text"
                                                            maxLength="8"
                                                            onKeyDown={numberOnly}
                                                            onKeyUp={removeChar}
                                                            onChange={(e) => setReceiverPhoneNumber(e.target.value)}
                                                        />
                                                        <input type="hidden" name="setReceiverPhoneNumber" value={receiverPhoneNumber}/>
                                                    </div>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                            </div>
                            <div className="order-info">
                                <div className="order-item-box">
                                    <div id="userOrderList">
                                        <div className="delivery-state normal">
                                            <h4 className="tit">일반배송 1개</h4>
                                            <div className="right-dlv-info">
                                                <i className="ico-bl-box2"></i>
                                                <p className="txt">
                                                    <span id="dlvPrice">무료배송</span>
                                                </p>
                                            </div>
                                        </div>
                                        <ul className="cart-list">
                                            {tempProductData.map(item => (
                                                <li key={item.product_id}>
                                                    <div className="prd-info-area ">
                                                        <div className="inner">
                                                            <div className="column img">
                                                                <a href={`/product/view?productCd=${item.product_id}`}>
                                                                    <img src={item.image} alt="상품이미지"/>
                                                                </a>
                                                            </div>
                                                            <div className="column tit">
                                                                <p className="tit"><a
                                                                    href={`/product/view?productCd=${item.product_id}`}>{item.name}</a>
                                                                </p>
                                                                <p className="desc">{item.option}</p>
                                                                <ul className="price-item">
                                                                    <li><span className="num">{item.price}</span>원</li>
                                                                    <li><span className="num">{item.count}</span>개
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <div className="column price w70">
                                                                <span className="num">{item.price}</span>원
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>

                                    </div>
                                </div>
                                <div className="dlv-request-box">
                                    <div className="inner-div">
                                        <div className="request-tit"><h5>배송 요청사항</h5></div>
                                        <div className="request-detail">
                                            <div className="ui-select select-box w-full">
                                                <Select options={options} //위에서 만든 배열을 select로 넣기
                                                        onChange={setSelectOption} //값이 바뀌면 setState되게
                                                        defaultValue={options[0]}/>

                                            </div>
                                            {selectOption.value === '직접입력' && (
                                                <div id="direct-item-nor" className="ui-direct-input">
                                                    <input
                                                        type="text"
                                                        value={deliveryReq}
                                                        className="input-text w-full deliveryComment removeEmoji"
                                                        id="customRequest"
                                                        name="dlv_memo"
                                                        onChange={(e) => setDeliveryReq(e.target.value)}
                                                        placeholder="배송 요청 사항을 입력하세요"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="side-fix-area fixed" style={{top: barPosition}}>
                                <div className="payment-info-box ui-box-fix">
                                    <h3 className="tit">주문결제 금액</h3>
                                    <div className="order-price">
                                        <ul className="div-price">
                                            <li>
                                                <div className="list-inner">
                                                    <span className="tit">상품금액</span>
                                                    <p className="price"><strong className="num resetOrderPaySide"
                                                                                 id="txt_tot_price">{calculateTotalProductPrice()}</strong> 원
                                                    </p>
                                                    <input type="hidden" name="tot_price" className="resetOrderPaySide"
                                                           value="가격"/>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="list-inner">
                                                    <span className="tit">배송비</span>
                                                    <p className="price">
                                                        <strong className="num resetOrderPaySide"
                                                                id="txt_tot_dlv_price">0</strong> 원
                                                    </p>
                                                    <input type="hidden" name="tot_dlv_price"
                                                           className="resetOrderPaySide" value="0"/>
                                                </div>
                                            </li>
                                        </ul>
                                        <div className="total-price">
                                            <div className="list-inner">
                                                <span className="tit">최종 결제금액</span>
                                                <div className="price">
                                                    <strong className="num text-primary resetOrderPaySide"
                                                            id="txt_tot_pg_price">{calculateTotalPrice()}</strong> 원
                                                    <input type="hidden" name="tot_pg_price"
                                                           className="resetOrderPaySide" value="가격"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <ul className="terms-view">
                                        <li>
                                            <a href="" className="ui-open-pop">
                                                <span className="txt">처리위탁 및 3자 제공 동의</span>
                                                <span className="view">내용보기<i className="ico-arrfill-right"></i></span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="" className="ui-open-pop">
                                                <span className="txt">결제대행서비스 이용 동의</span>
                                                <span className="view">내용보기<i className="ico-arrfill-right"></i></span>
                                            </a>
                                        </li>

                                        <li>
                                            <a href="" className="ui-open-pop">
                                                <span className="txt">개인정보 수집 및 이용 동의</span>
                                                <span className="view">내용보기<i className="ico-arrfill-right"></i></span>
                                            </a>
                                        </li>
                                    </ul>
                                    <div className="check-area">
                                        <div className="custom-checkbox">
                                            <input type="checkbox" id="checkTerms" className="checkbox"
                                                   name="check_terms" data-nonmember-yn="N"
                                                   checked={isChecked}
                                                   onChange={handleCheckboxChange}/>
                                            <label htmlFor="checkTerms">상기 필수약관을 확인하였으며<br/>결제에 동의합니다.</label>
                                        </div>
                                    </div>
                                    {/* 주문 성공 팝업 */}
                                    {orderSuccess && <div className="success-message">주문이 성공적으로 완료되었습니다!</div>}
                                    <button type="button" className="btn-basic-xlg btn-primary" onClick={handleOrder}>
                                        <span className="num"><span id="txt_btn_payment"
                                                                    className="resetOrderPaySide">가격</span>원 결제하기</span>
                                    </button>
                                </div>
                            </div>
                            <div className="order-info">
                                <div className="list-head">
                                    <h3 className="title-list">결제방법</h3>
                                </div>
                                {/* list-head */}

                                <div className="payment-select">
                                    <div className="grid-area">
                                        <div className="colum col12">
                                            <ul className="radio-grid-span4">
                                                <li>
                                                    <div className="custom-radio">
                                                        <input type="radio" id="radio-grid-1" className="radio-box-grid"
                                                               name="payType" value="CARD" data-card-type="GE"
                                                               checked=""/>
                                                        <label htmlFor="radio-grid-1"><em className="txt"><i
                                                            className="ico-pay-creditcard"></i>신용카드</em></label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="custom-radio">
                                                        <input type="radio" id="radio-grid-2" className="radio-box-grid"
                                                               name="payType" value="VBANK"/>
                                                        <label htmlFor="radio-grid-2"><em className="txt"><i
                                                            className="ico-pay-vbank"></i>무통장입금</em></label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="custom-radio">
                                                        <input type="radio" id="radio-grid-3" className="radio-box-grid"
                                                               name="payType" value="BANK"/>
                                                        <label htmlFor="radio-grid-3"><em className="txt"><i
                                                            className="ico-pay-bank"></i>실시간계좌이체</em></label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="custom-radio">
                                                        <input type="radio" id="radio-grid-4" className="radio-box-grid"
                                                               name="payType" value="MOBILE"/>
                                                        <label htmlFor="radio-grid-4"><em className="txt"><i
                                                            className="ico-pay-mobile"></i>휴대폰결제</em></label>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                {/* payment-select */}
                            </div>

                        </form>
                    </div>
                </div>
            </section>

            {/* ========== 컨텐츠 영역 :: container ========== */}
            <Footer/>
        </div>
    );
};
