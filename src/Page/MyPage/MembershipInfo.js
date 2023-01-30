import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Headers from '../../Components/Headers';
import { API } from '../../Utils/API';
import { ColorBlack, ColorGold, ColorMainBlue, ColorWhite } from '../../Utils/Color';
import check01 from '../../Assets/images/ico_check_b-1.png';
import check02 from '../../Assets/images/ico_check_b.png';
import axios from 'axios';

// 구독 정보 페이지

function MembershipInfo() {
  const navigate = useNavigate();
  const [grade, setGrade] = useState();
  const [productName, setProductName] = useState();
  const [amount, setAmount] = useState();

  const getGrade = async () => {
    try {
      const res = await API.get('/user/grade');
      setGrade(res.data.grade);
    } catch {}
  };

  const getSettingInfo = async () => {
    try {
      const res = await API.get('/admin/payment-setting');
      setProductName(res.data.name);
      setAmount(res.data.amount);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  useEffect(() => {
    getGrade();
    getSettingInfo();
  }, []);

  return (
    <>
      <Headers></Headers>
      <Container>
        <Title>나에게 맞는 서비스를 선택해 이용해 보세요!</Title>
        <SubTitle>고객도 나도 편리한, 슬기로운 볼링장을 응원합니다.</SubTitle>
        <Wrap>
          <GrayBox>
            <GrayBoxTitle>무료</GrayBoxTitle>
            <AmountText>0원</AmountText>
            <BoxSubTitle>
              라카이용 만료 3일 전에 <br></br> 알림톡으로 알려드립니다.
            </BoxSubTitle>
            <GrayBoxButton
              onClick={() => {
                grade === 0
                  ? navigate('/lockershow')
                  : Modal.info({
                      title: '알림',
                      content: '유료 버전을 이용 중인 회원입니다.',
                      okText: '확인',
                    });
              }}
            >
              <BoxButtonText>무료버전 이용하기</BoxButtonText>
            </GrayBoxButton>
            <BoxTextWrap>
              <Image src={check01} />
              <BoxText>라카관리 프로그램</BoxText>
            </BoxTextWrap>
            <BoxTextWrap>
              <Image src={check01} />
              <BoxText>이용자 무제한 추가</BoxText>
            </BoxTextWrap>
            <BoxTextWrap>
              <Image src={check01} />
              <BoxText>3일 전 자동 알림톡 전송</BoxText>
            </BoxTextWrap>
          </GrayBox>
          <GoldBox>
            <GoldBoxTitle>{productName}</GoldBoxTitle>
            <AmountText>{amount && amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원 / 1년</AmountText>
            <BoxSubTitle>
              다양한 기간에 알림톡으로 <br></br> 안내가 가능합니다.
            </BoxSubTitle>
            <GoldBoxButton
              onClick={() => {
                grade === 0
                  ? Modal.info({
                      title: '알림',
                      content: '이용권을 구매하시겠습니까?',
                      okText: '결제하기',
                      closable: true,
                      onOk: () => {
                        navigate(`/payment/0`);
                      },
                    })
                  : Modal.info({
                      title: '알림',
                      content: '이미 이용권을 보유하고 있습니다.',
                      okText: '확인',
                    });
              }}
            >
              <BoxButtonText>이용권 구매하기</BoxButtonText>
            </GoldBoxButton>
            <BoxTextWrap>
              <Image src={check02} />
              <BoxText>무료버전 기능</BoxText>
            </BoxTextWrap>
            <BoxTextWrap>
              <Image src={check02} />
              <BoxText>알림톡 기간 최대 5개까지 선택 가능</BoxText>
            </BoxTextWrap>
            <BoxTextWrap>
              <Image src={check02} />
              <BoxText>지공차트 관리 프로그램</BoxText>
            </BoxTextWrap>
          </GoldBox>
        </Wrap>
        <BackButton
          onClick={() => {
            localStorage.setItem('myPageTab', 'payment');
            navigate('/mypage');
          }}
        >
          <BackButtonText>돌아가기</BackButtonText>
        </BackButton>
        <BottomText>판매 서비스 책임자: (주)골드레인 대표 김도현 / 연락처: 033-818-0337</BottomText>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: bold;
  color: ${ColorBlack};
  margin-top: 90px;
`;

const SubTitle = styled.div`
  font-size: 30px;
  font-weight: 200;
  color: ${ColorBlack};
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 50px;
`;

const GrayBox = styled.div`
  width: 400px;
  border: 2px solid #e3e3e3;
  border-radius: 10px;
  padding: 40px;
  background-color: ${ColorWhite};
  margin-right: 40px;
`;

const GoldBox = styled.div`
  width: 400px;
  border: 2px solid ${ColorGold};
  border-radius: 10px;
  padding: 40px;
  background-color: ${ColorWhite};
`;

const GrayBoxTitle = styled.p`
  margin: 0;
  font-size: 35px;
  font-weight: bold;
  color: ${ColorMainBlue};
  text-align: center;
`;
const AmountText = styled.p`
  margin: 0;
  font-size: 23px;
  margin-bottom: 15px;
  font-weight: 700;
  color: ${ColorBlack};
  text-align: center;
`;

const GoldBoxTitle = styled.p`
  margin: 0;
  font-size: 35px;
  font-weight: bold;
  color: ${ColorGold};
  text-align: center;
`;

const BoxSubTitle = styled.p`
  margin: 10px 0 15px;
  font-size: 16px;
  line-height: 22px;
  font-weight: 200;
  color: ${ColorBlack};
  text-align: center;
`;

const GrayBoxButton = styled.div`
  width: '100%';
  height: 48px;
  background-color: ${ColorMainBlue};
  border-radius: 50px;
  text-align: center;
  margin-bottom: 20px;
  cursor: pointer;
`;

const GoldBoxButton = styled.div`
  width: '100%';
  height: 48px;
  background-color: ${ColorGold};
  border-radius: 50px;
  text-align: center;
  margin-bottom: 20px;
  cursor: pointer;
`;

const BoxButtonText = styled.span`
  font-size: 17px;
  line-height: 48px;
  font-weight: 500;
  color: ${ColorWhite};
`;

const BoxTextWrap = styled.div`
  margin: 5px 0;
  display: flex;
`;

const Image = styled.img`
  width: 22px;
  height: 22px;
  margin-right: 7px;
`;

const BoxText = styled.span`
  font-size: 15px;
  font-weight: 300;
  color: ${ColorBlack};
`;

const BackButton = styled.div`
  width: 400px;
  height: 48px;
  border: 1px solid #e3e3e3;
  border-radius: 4px;
  background-color: ${ColorWhite};
  margin-top: 50px;
  cursor: pointer;
`;

const BackButtonText = styled.p`
  margin: 0;
  line-height: 48px;
  font-size: 17px;
  font-weight: 500;
  color: ${ColorBlack};
  text-align: center;
`;

const BottomText = styled.p`
  width: 400px;
  text-align: center;
  margin: 15px 0;
  font-size: 13px;
  font-weight: 300;
  color: #a6a6a6;
  margin-bottom: 100px;
`;

export default MembershipInfo;
