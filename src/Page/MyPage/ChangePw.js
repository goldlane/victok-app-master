import { Button, Form, Input, Modal } from 'antd';
import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { API } from '../../Utils/API';
import { ColorWhite } from '../../Utils/Color';
import { passwordReg } from '../../Utils/Reg';

// 설정 - 비밀번호 재설정

function ChangePw() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onModify = async (values) => {
    try {
      const res = await API.put('/user/my-password', { new_password: values.newPassword });
      Modal.success({
        title: '비밀번호 변경 완료!',
        content: '비밀번호가 변경되었습니다. 변경된 비밀번호로 다시 로그인해 주세요.',
        okText: '확인',
        onOk: () => {
          sessionStorage.clear();
          localStorage.clear();
          navigate('/login');
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Modal.error({ title: '비밀번호 변경 실패!', content: error.response.data.meessage, okText: '확인' });
      }
    }
  };

  const checkPw = async () => {
    const password = form.getFieldValue('newPassword');
    if (password && password.length < 8) {
      return Promise.reject(new Error('비밀번호는 최소 8자 이상이어야 합니다.'));
    }
    if (password && !passwordReg.test(password)) {
      return Promise.reject(new Error('영어 대문자 또는 소문자, 숫자, 특수문자 최소 1자씩 조합해 주세요.'));
    }
    return Promise.resolve();
  };

  const doubleCheck = async () => {
    const password1 = form.getFieldValue('newPassword');
    const password2 = form.getFieldValue('checkPassword');
    if (password1 !== password2) {
      return Promise.reject(new Error('비밀번호가 서로 일치하지 않습니다.'));
    }
    return Promise.resolve();
  };

  const rightCheck = async () => {
    const password = form.getFieldValue('nowPassword');
    if (password) {
      try {
        const res = await API.post('/user/my-password-auth', { password });
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(new Error('기존 비밀번호와 일치하지 않습니다.'));
      }
    }
  };

  return (
    <Box>
      <div style={{ alignItems: 'flex-start', width: '100%' }}>
        <Title>비밀번호 재설정</Title>
        <SubTitle>비밀번호 확인 후 재설정이 가능합니다.</SubTitle>
      </div>
      <Form form={form} layout="vertical" onFinish={onModify} style={{ width: '100%' }}>
        <Form.Item
          label="기존 비밀번호"
          name="nowPassword"
          style={{ marginBottom: 10 }}
          rules={[
            {
              required: true,
              message: '기존 비밀번호를 입력해 주세요!',
            },
            { validator: rightCheck, validateTrigger: 'onBlur' },
          ]}
          validateTrigger={['onBlur']}
        >
          <Input.Password placeholder="기존 비밀번호" style={{ marginRight: 5, borderRadius: 4 }} />
        </Form.Item>
        <Form.Item
          label="새로운 비밀번호"
          name="newPassword"
          style={{ marginBottom: 10 }}
          rules={[
            {
              required: true,
              message: '새 비밀번호를 입력해 주세요!',
            },
            { validator: checkPw, validateTrigger: 'onChange' },
          ]}
          validateTrigger={['onChange']}
        >
          <Input.Password placeholder="새로운 비밀번호" style={{ marginRight: 5, borderRadius: 4 }} />
        </Form.Item>
        <Form.Item
          label="비밀번호 확인"
          name="checkPassword"
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: '새 비밀번호를 입력해 주세요!',
            },
            { validator: doubleCheck, validateTrigger: 'onChange' },
          ]}
          validateTrigger={['onChange']}
        >
          <Input.Password placeholder="새로운 비밀번호 재입력" style={{ borderRadius: 4 }} />
        </Form.Item>
        <Button type="primary" htmlType="submit" block style={{ height: 48, fontSize: 16, borderRadius: 4, marginTop: 10 }}>
          비밀번호 재설정
        </Button>
      </Form>
    </Box>
  );
}

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 50px auto;
  width: 450px;
  background-color: ${ColorWhite};
  border-radius: 10px;
  margin-top: 10px;
`;

const Title = styled.p`
  font-size: 20px;
  font-weight: 600;
`;

const SubTitle = styled.p`
  font-weight: 200;
  font-size: 15px;
  padding: 0;
  margin-bottom: 20px;
`;

export default ChangePw;
