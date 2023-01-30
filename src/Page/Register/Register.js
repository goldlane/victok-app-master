import { Form } from 'antd';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ColorWhite } from '../../Utils/Color';
import RegisterAccount from './Register.Account';
import RegisterTerms from './Register.Terms';
import RegisterUserInfo from './Register.UserInfo';
import RegisterStoreInfo from './Register.StoreInfo';
import RegisterComplete from './Register.Complete';
import { API } from '../../Utils/API';
import axios from 'axios';
import Headers from '../../Components/Headers';

// 회원가입

function Register() {
  const [step, setStep] = useState('terms');
  const [temrsForm] = Form.useForm();
  const [accountForm] = Form.useForm();
  const [infoForm] = Form.useForm();
  const [storeForm] = Form.useForm();

  const onSubmit = async () => {
    const terms = temrsForm.getFieldsValue();
    const account = accountForm.getFieldsValue();
    const info = infoForm.getFieldsValue();
    const store = storeForm.getFieldsValue();
    const formdata = new FormData();
    formdata.append('email', account.email);
    formdata.append('password', account.password);
    formdata.append('name', info.name);
    formdata.append('nickname', info.nickname);
    formdata.append('phone', info.auth.phoneNum);
    formdata.append('agree_marketing', terms.agree.includes('marketing') ? 1 : 0);
    formdata.append('type', store.type);
    formdata.append('store_name', store.storeName);
    formdata.append('zip_code', store.address.zip);
    formdata.append('address1', store.address.addr);
    formdata.append('address2', store.address.detail);
    formdata.append('contact', store.hp);
    try {
      const req = await API.post('/user/account', formdata, { headers: { 'content-type': 'multipart/form-data' } });
      setStep('complete');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response);
      }
    }
  };

  useEffect(() => {
    if (step === 'info') {
      infoForm.setFieldsValue({ email: accountForm.getFieldValue('email') });
    }
  }, [step]);

  return (
    <>
      <Headers></Headers>
      <Container>
        <Box style={{ display: step === 'terms' ? 'flex' : 'none' }}>
          <RegisterTerms form={temrsForm} setStep={setStep} />
        </Box>
        <Box style={{ display: step === 'account' ? 'flex' : 'none' }}>
          <RegisterAccount form={accountForm} setStep={setStep} />
        </Box>
        <Box style={{ display: step === 'info' ? 'flex' : 'none' }}>
          <RegisterUserInfo form={infoForm} setStep={setStep} step={step} />
        </Box>
        <Box style={{ display: step === 'facility' ? 'flex' : 'none' }}>
          <RegisterStoreInfo form={storeForm} onSubmit={onSubmit} setStep={setStep} />
        </Box>
        <Box style={{ display: step === 'complete' ? 'flex' : 'none' }}>
          <RegisterComplete />
        </Box>
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

const Box = styled.div`
  display: flex;
  border-radius: 10px;
  min-width: 400px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 70px;
  padding: 30px 80px;
  background-color: ${ColorWhite};
`;

export default Register;
