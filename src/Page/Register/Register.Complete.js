import React from 'react';
import styled from 'styled-components';
import { ColorBlack } from '../../Utils/Color';
import img_join from '../../Assets/images/ico_join.png';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

// 회원가입 완료

function RegisterComplete() {
  const navigate = useNavigate();

  return (
    <Container>
      <Wrap style={{ marginBottom: 50 }}>
        <Title style={{ fontWeight: 500, color: ColorBlack }}>
          회원가입이
          <br />
          완료<span style={{ fontWeight: 100 }}>되었습니다.</span>
          <SubTitle>이제 편리하게 관리해 보세요.</SubTitle>
        </Title>
        <Image src={img_join} />
      </Wrap>
      <Button type="primary" block onClick={() => navigate('/login')} style={{ height: 48, fontSize: 16, borderRadius: 4 }}>
        로그인 하러 가기
      </Button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  padding: 50px 0;
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: row;
`;

const Image = styled.img`
  padding: 10px;
`;

const Title = styled.div`
  font-size: 40px;
`;

const SubTitle = styled.div`
  font-size: 18px;
  font-weight: 200;
  color: #a8a8a8;
`;
export default RegisterComplete;
