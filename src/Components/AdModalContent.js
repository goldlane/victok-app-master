import React from 'react';
import styled from 'styled-components';
import { ColorBlack, ColorMainBlue } from 'Utils/Color';

function AdModalContent() {
  return (
    <ModalBox>
      <ModalText>보다 확실한 라카 관리를 위해</ModalText>
      <ModalText> 기본 제공되는 알림 외에</ModalText>
      <ModalText>
        <TextBlue>추가 알림</TextBlue>을 설정해 보세요!
      </ModalText>
      <ModalText>
        고객의 <TextBlue>지공표 관리</TextBlue>도 가능해요!
      </ModalText>
    </ModalBox>
  );
}

const ModalBox = styled.div`
  padding-top: 15px;
`;

const ModalText = styled.p`
  margin-bottom: 5px;
  font-size: 14px;
  color: ${ColorBlack};
`;
const TextBlue = styled.span`
  color: ${ColorMainBlue};
  font-weight: 600;
`;

export default AdModalContent;
