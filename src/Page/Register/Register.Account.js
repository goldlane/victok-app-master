import { Button, Form, Input } from 'antd';
import axios from 'axios';
import React from 'react';
import styled from 'styled-components';
import { API } from '../../Utils/API';
import { ColorMainBlue } from '../../Utils/Color';
import { emailReg, passwordReg } from '../../Utils/Reg';

// 회원가입 - 계정 정보

function RegisterAccount({ form, setStep }) {
  const onSubmit = () => {
    setStep('info');
  };

  const checkEmail = async () => {
    const email = form.getFieldValue('email');
    if (!emailReg.test(email)) {
      return Promise.reject(new Error('올바른 이메일 양식이 아닙니다.'));
    }
    try {
      const formdata = {
        email: email,
      };
      const req = await API.post('/user/email-check', formdata);
      return Promise.resolve();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response.data);
      }
      return Promise.reject(new Error('해당 이메일을 사용할 수 없습니다.'));
    }
  };

  const checkPw = async () => {
    const password = form.getFieldValue('password');
    if (password && password.length < 8) {
      return Promise.reject(new Error('비밀번호는 최소 8자 이상이어야 합니다.'));
    }
    if (!passwordReg.test(password)) {
      return Promise.reject(new Error('영어 대문자 또는 소문자, 숫자, 특수문자 최소 1자씩 조합해 주세요.'));
    }

    return Promise.resolve();
  };

  const doubleCheck = async () => {
    const password1 = form.getFieldValue('password');
    const password2 = form.getFieldValue('confirm');
    if (password1 !== password2) {
      return Promise.reject(new Error('비밀번호가 서로 일치하지 않습니다.'));
    }
    return Promise.resolve();
  };

  return (
    <Container>
      <Title>회원가입</Title>
      <Form form={form} layout="vertical" style={{ minWidth: 440 }} onFinish={onSubmit}>
        <Form.Item
          label="이메일"
          name="email"
          rules={[
            {
              required: true,
              message: '이메일을 입력해 주세요!',
            },
            { validator: checkEmail, validateTrigger: 'onChange' },
          ]}
          validateTrigger={['onChange']}
        >
          <Input placeholder="이메일을 입력해 주세요." />
        </Form.Item>
        <Form.Item
          label="비밀번호"
          name="password"
          extra={
            <>
              <Label>ㆍ최소 8글자</Label>
              <Label>ㆍ영어 대문자 또는 소문자, 숫자, 특수문자 최소 1자씩 조합</Label>
            </>
          }
          rules={[
            {
              required: true,
              message: '비밀번호를 입력해 주세요!',
            },
            { validator: checkPw, validateTrigger: 'onChange' },
          ]}
          validateTrigger={['onChange']}
        >
          <Input.Password placeholder="비밀번호를 입력해 주세요." />
        </Form.Item>

        <Form.Item
          label="비밀번호 확인"
          name="confirm"
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: '비밀번호를 입력해 주세요!',
            },
            { validator: doubleCheck, validateTrigger: 'onChange' },
          ]}
          validateTrigger={['onChange']}
        >
          <Input.Password placeholder="비밀번호를 입력해 주세요." />
        </Form.Item>
        <Form.Item name="submit" noStyle>
          <Button type="primary" htmlType="submit" block style={{ height: 48, fontSize: 16, borderRadius: 5, marginBottom: 30, marginTop: 10 }}>
            다음
          </Button>
        </Form.Item>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const Title = styled.div`
  width: 100%;
  font-size: 24px;
  font-weight: bold;
  text-align: left;
  padding: 37px 0;
`;

const Label = styled.div`
  color: ${ColorMainBlue};
  font-size: 12px;
`;

export default RegisterAccount;
