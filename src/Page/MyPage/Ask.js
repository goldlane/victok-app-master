import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ColorBlack, ColorMainBlue, ColorWhite } from '../../Utils/Color';
import Headers from '../../Components/Headers';
import { useNavigate } from 'react-router-dom';
import ask01 from '../../Assets/images/ico_faq.png';
import ask02 from '../../Assets/images/ico_kakaoch.png';
import ask03 from '../../Assets/images/ico_call.png';
import { API } from '../../Utils/API';

// 문의 페이지

function Ask() {
  const navigate = useNavigate();
  const [faq, setFaq] = useState('');
  const [chat, setChat] = useState('');

  const onInit = async () => {
    try {
      const res = await API.get('/user/terms');
      setFaq(res.data[0].faq);
      setChat(res.data[0].channel_talk);
    } catch {}
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) navigate('/');
  }, []);

  useEffect(() => {
    onInit();
  }, []);

  return (
    <>
      <Headers></Headers>
      <Container>
        <Box>
          <Title>문의</Title>
          <SubTitle>궁금한 점이 있으시면 친절하게 상담해 드립니다.</SubTitle>
          <Wrap>
            <Button href={faq} target="_blank">
              <ButtonImg src={ask01} />
              <ButtonText>자주 하는 질문</ButtonText>
            </Button>
            <Button href={chat} target="_blank">
              <ButtonImg src={ask02} />
              <ButtonText>1:1 채팅 상담</ButtonText>
            </Button>
            <ButtonGray>
              <ButtonImg src={ask03} />
              <ButtonText>문의 전화 : 010 – 5766 - 0915</ButtonText>
            </ButtonGray>
          </Wrap>
        </Box>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
`;

const Box = styled.div`
  display: flex;
  width: 700px;
  border-radius: 10px;
  flex-direction: column;
  margin-top: 70px;
  margin-bottom: 70px;
  padding: 74px 80px 90px;
  background-color: ${ColorWhite};
`;

const Wrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const Title = styled.p`
  font-size: 22px;
  font-weight: bold;
  color: ${ColorBlack};
  margin-bottom: 6px;
`;
const SubTitle = styled.p`
  font-size: 18px;
  font-weight: 100;
  color: ${ColorBlack};
  margin-bottom: 30px;
`;

const Button = styled.a`
  flex: 1;
  height: 59px;
  border: 1px solid ${ColorMainBlue};
  border-radius: 5px;
  padding-left: 24px;
  margin-bottom: 11px;
  flex-direction: row;
`;

const ButtonGray = styled.div`
  flex: 1;
  height: 59px;
  border-radius: 5px;
  padding-left: 24px;
  margin-bottom: 11px;
  flex-direction: row;
  background-color: #f5f5f5;
`;

const ButtonImg = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 20px;
`;

const ButtonText = styled.span`
  font-size: 16px;
  color: ${ColorMainBlue};
  line-height: 59px;
`;
export default Ask;
