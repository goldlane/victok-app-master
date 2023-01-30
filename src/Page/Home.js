import React from 'react';
import styled from 'styled-components';
import Headers from '../Components/Headers';
import { ColorWhite } from '../Utils/Color';
import backGround from '../Assets/images/bg.jpg';
import button from '../Assets/images/main_btn.png';
import { useNavigate } from 'react-router-dom';

// 랜딩페이지

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Headers></Headers>
      <Container>
        <Page>
          <TextBox>
            <MainText>라카 관리의 시작은</MainText>
            <MainText>빅톡에서!</MainText>
            <SubText style={{ marginTop: 20 }}>이용자 라카 사용 기간에 따라 자동으로 알림톡을 보내드립니다.</SubText>
            <SubText>번거로운 일은 저희에게 맡기세요.</SubText>
            <Button
              src={button}
              onClick={() => {
                navigate('/lockershow');
              }}
            />
          </TextBox>
        </Page>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 15%;
  @media screen and (max-width: 1500px) {
    margin-left: 10%;
  }
  @media screen and (max-width: 1200px) {
    margin-left: 9%;
  }
`;

const MainText = styled.h1`
  color: ${ColorWhite};
  font-size: 60px;
  font-weight: bold;
  margin: -10px;
  @media screen and (max-width: 1500px) {
    font-size: 53px;
  }
  @media screen and (max-width: 1200px) {
    font-size: 49px;
  }
`;

const SubText = styled.p`
  color: ${ColorWhite};
  font-size: 25px;
  margin: 0;
  @media screen and (max-width: 1500px) {
    font-size: 24px;
  }
  @media screen and (max-width: 1200px) {
    font-size: 20px;
  }
`;

const Page = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  background-image: url(${backGround});
  background-size: cover;
  aspect-ratio: 20/9;
`;
const Button = styled.img`
  width: 290px;
  height: 70px;
  margin-top: 50px;
  cursor: pointer;
  &:hover {
    filter: brightness(0.9);
  }
  transition: 0.3s ease;
  @media screen and (max-width: 1500px) {
    margin-top: 40px;
  }
`;

export default Home;
