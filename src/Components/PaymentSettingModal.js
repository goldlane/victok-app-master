import { Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { API } from '../Utils/API';
import axios from 'axios';
import styled from 'styled-components';

function PaymentSettingModal({ visible, setVisible }) {
  const [name, setName] = useState();
  const [amount, setAmount] = useState();

  const getSettingInfo = async () => {
    try {
      const res = await API.get('/admin/payment-setting');
      setName(res.data.name);
      setAmount(res.data.amount);
      console.log('이용권 정보', res.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  const onSetting = async () => {
    try {
      const formdata = {
        name: name,
        amount: amount,
      };
      const res = await API.put('/admin/payment-setting', formdata);
      Modal.success({
        title: '이용권 정보 수정 완료',
        content: '이용권 정보가 수정되었습니다.',
        onOk: () => {
          setVisible(false);
          getSettingInfo();
        },
        okText: '확인',
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  useEffect(() => {
    getSettingInfo();
  }, []);

  return (
    <Modal
      visible={visible}
      title={'이용권 정보 설정'}
      onOk={onSetting}
      okText="저장하기"
      cancelText={'취소'}
      onCancel={() => setVisible(false)}
      bodyStyle={{ padding: '15px 20px 25px' }}
    >
      <InputWrap>
        <SubTitle>상품명</SubTitle>
        <Input placeholder="상품명 입력" value={name} onChange={(e) => setName(e.target.value)} />
      </InputWrap>
      <InputWrap>
        <SubTitle>금액</SubTitle>
        <Input placeholder="금액 입력" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </InputWrap>
    </Modal>
  );
}

const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;
const SubTitle = styled.span`
  display: block;
  margin-bottom: 5px;
`;

export default PaymentSettingModal;
