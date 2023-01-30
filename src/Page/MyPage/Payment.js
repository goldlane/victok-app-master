import { Modal } from 'antd';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Headers from '../../Components/Headers';
import { API } from '../../Utils/API';
import axios from 'axios';
import { ColorMainBlue } from 'Utils/Color';

// 결제 페이지

function Payment() {
  const navigate = useNavigate();
  const { value } = useParams();
  const isExtension = value === '1' ? true : false;
  console.log('isExtension', isExtension);

  const getSettingInfo = async () => {
    try {
      const res = await API.get('/admin/payment-setting');
      console.log('이용권 정보', res.data);
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  const getUserInfo = async () => {
    try {
      const res = await API.get('/payment/store');
      console.log('유저&스토어 정보', res.data);
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  const insertPaymentInfo = async (rsp) => {
    const form = {
      isExtension: isExtension,
      imp_uid: rsp.imp_uid,
      merchant_uid: rsp.merchant_uid,
      payment_name: rsp.name,
      amount: rsp.paid_amount,
      card_name: rsp.card_name,
      card_number: rsp.card_number,
      receipt_url: rsp.receipt_url,
    };
    try {
      const res = await API.post('/payment/payment', form);
      console.log(res);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  function requestPay(values) {
    const [product, user] = values;
    console.log(product, user);
    const IMP = window.IMP;
    IMP.init('imp98333624');
    IMP.request_pay(
      {
        pg: 'html5_inicis',
        pay_method: 'card',
        name: product.name,
        amount: product.amount,
        merchant_uid: `mid_${new Date().getTime()}`,
        buyer_email: user.email,
        buyer_name: user.user_name,
        buyer_tel: user.phone,
        buyer_addr: user.address1,
        buyer_postcode: user.zip_code,
      },
      function (rsp) {
        // callback
        if (rsp.success) {
          console.log('결제 성공', rsp);
          insertPaymentInfo(rsp);
          Modal.success({
            title: '결제 완료',
            content: '이용권 결제가 완료되었습니다.',
            okText: '확인',
            onOk: () => {
              localStorage.setItem('myPageTab', 'payment');
              navigate('/mypage');
            },
          });
        } else {
          console.log('결제 실패', rsp);
          localStorage.setItem('myPageTab', 'payment');
          navigate('/mypage');
        }
      }
    );
  }

  useEffect(() => {
    Promise.all([getSettingInfo(), getUserInfo()]).then((values) => requestPay(values));
  }, []);

  return (
    <Box>
      <Headers></Headers>
      <Container>
        <Text>이용권 결제 진행 중</Text>
      </Container>
    </Box>
  );
}

const Box = styled.div`
  height: 100vh;
  width: 100%;
`;
const Container = styled.div`
  height: 100vh;
  width: 100%;
`;
const Text = styled.p`
  font-size: 20px;
  color: ${ColorMainBlue};
  margin-top: 200px;
  text-align: center;
`;

export default Payment;
