import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ColorBlack, ColorMainBlue, ColorWhite } from '../../Utils/Color';
import HeadersAdmin from '../../Components/HeadersAdmin';
import { Button, Input, Modal } from 'antd';
import { API } from '../../Utils/API';
import axios from 'axios';

// 관리자 - 약관 관리

function Setting() {
  const [use, setUse] = useState('');
  const [privacy, setPrivacy] = useState('');
  const [faq, setFaq] = useState('');
  const [refund, setRefund] = useState('');

  const onInit = async () => {
    try {
      const res = await API.get('/user/terms');
      setUse(res.data[0].terms_of_use);
      setPrivacy(res.data[0].privacy_policy);
      setFaq(res.data[0].faq);
      setRefund(res.data[0].refund_policy);
    } catch {}
  };

  const onChange = (e) => {
    if (e.target.name === 'use') {
      setUse(e.target.value);
    } else if (e.target.name === 'privacy') {
      setPrivacy(e.target.value);
    } else if (e.target.name === 'faq') {
      setFaq(e.target.value);
    } else if (e.target.name === 'refund') {
      setRefund(e.target.value);
    }
  };

  const onSetting = async () => {
    try {
      const formdata = {
        link1: use,
        link2: privacy,
        link3: faq,
        link4: refund,
      };
      const res = await API.put('/admin/terms', formdata);
      Modal.success({ title: '링크 수정 완료', content: '링크가 수정되었습니다.', onOk: () => onInit(), okText: '확인' });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  useEffect(() => {
    onInit();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <HeadersAdmin></HeadersAdmin>
      <Container>
        <Box>
          <Wrap style={{ width: '600px' }}>
            <div style={{ width: '100%' }}>
              <Title>링크 관리</Title>
              <SubTitle>서비스 이용약관 / 개인정보 처리방침 / 자주하는 질문 / 취소·환불 정책 링크에 적용됩니다.</SubTitle>
            </div>
            <Menu>
              <MenuText>서비스 이용약관</MenuText>
              <Input
                name="use"
                style={{ width: '100%', height: 35, borderRadius: 4, borderColor: '#E3E3E3' }}
                placeholder="서비스 이용약관 주소를 입력해 주세요."
                value={use}
                onChange={onChange}
              />
            </Menu>
            <Menu>
              <MenuText>개인정보 처리방침</MenuText>
              <Input
                name="privacy"
                style={{ width: '100%', height: 35, borderRadius: 4, borderColor: '#E3E3E3' }}
                placeholder="개인정보 처리방침 주소를 입력해 주세요."
                value={privacy}
                onChange={onChange}
              />
            </Menu>
            <Menu>
              <MenuText>자주하는 질문 (FAQ)</MenuText>
              <Input
                name="faq"
                style={{ width: '100%', height: 35, borderRadius: 4, borderColor: '#E3E3E3' }}
                placeholder="서비스 이용약관 주소를 입력해 주세요."
                value={faq}
                onChange={onChange}
              />
            </Menu>
            <Menu>
              <MenuText>취소·환불 정책</MenuText>
              <Input
                name="refund"
                style={{ width: '100%', height: 35, borderRadius: 4, borderColor: '#E3E3E3' }}
                placeholder="취소·환불 정책 주소를 입력해 주세요."
                value={refund}
                onChange={onChange}
              />
            </Menu>
            <Button style={{ height: 50, fontSize: 16, borderRadius: 4, marginTop: 40 }} type="primary" onClick={onSetting}>
              저장
            </Button>
          </Wrap>
        </Box>
      </Container>
    </div>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 50px 80px;
  background-color: ${ColorWhite};
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.p`
  color: ${ColorMainBlue};
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Menu = styled.div`
  margin-top: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  &:hover {
    color: #d7a35f;
    cursor: pointer;
  }
  transition: 0.3s ease;
`;

const MenuText = styled.div`
  color: ${ColorBlack};
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const SubTitle = styled.p`
  font-weight: 200;
  font-size: 16px;
  padding: 0;
  margin-bottom: 20px;
`;

export default Setting;
