import { Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { API } from '../Utils/API';
import axios from 'axios';
import styled from 'styled-components';

function RefundModal({ visible2, setVisible2, selectedIdx, getPaymentData }) {
  const [amount, setAmount] = useState();
  const [memo, setMemo] = useState('');

  const onRefund = async () => {
    if (!amount)
      return Modal.error({
        title: '알림',
        content: '취소/환불 금액을 입력해 주세요.',
        okText: '확인',
      });
    try {
      const formdata = {
        payment_idx: selectedIdx,
        amount: amount,
        memo: memo,
      };
      const res = await API.put('/admin/payment', formdata);
      Modal.success({
        title: '결제 취소/환불 처리 완료',
        content: '취소/환불 처리가 완료되었습니다.',
        onOk: () => {
          setVisible2(false);
          getPaymentData();
          setAmount('');
          setMemo('');
        },
        okText: '확인',
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  useEffect(() => {}, []);

  return (
    <Modal
      visible={visible2}
      title={'결제 취소/환불'}
      onOk={onRefund}
      okText="적용하기"
      cancelText={'취소'}
      onCancel={() => setVisible2(false)}
      bodyStyle={{ padding: '15px 20px 25px' }}
    >
      <InputWrap>
        <SubTitle>취소/환불 금액</SubTitle>
        <Input placeholder="금액 입력" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </InputWrap>
      <InputWrap>
        <SubTitle>메모</SubTitle>
        <Input placeholder="메모 입력" value={memo} onChange={(e) => setMemo(e.target.value)} />
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

export default RefundModal;
