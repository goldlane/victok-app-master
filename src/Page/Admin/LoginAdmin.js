import { Button, Form, Input, Modal } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import img_logo from '../../Assets/images/login_txt.png';
import { API } from '../../Utils/API';
import { ColorWhite } from '../../Utils/Color';
import jwt_decode from 'jwt-decode';

// 관리자 - 로그인

function LoginAdmin() {
  const navigate = useNavigate();
  const [check, setCheck] = useState(false);

  const onLogin = async (values) => {
    try {
      const formdata = {
        email: values.id,
        password: values.password,
      };
      const res = await API.post('/user/sign-in', formdata);
      const token = res.data.token;
      sessionStorage.setItem('token', token);
      if (check) {
        localStorage.setItem('token', token);
      }
      const userIdx = jwt_decode(token).idx;
      const userId = res.data.userInfo.email;
      console.log(userIdx, userId);
      if (userIdx === 1 || userIdx === 100055) {
        navigate('/store');
      } else {
        Modal.error({ title: '로그인 오류', content: '아이디 또는 비밀번호를 확인해 주세요.' });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Modal.error({ title: '로그인 오류', content: error.response.data.message });
      }
    }
  };
  return (
    <Container>
      <Box>
        <Logo src={img_logo} />
        <Form layout="vertical" onFinish={onLogin}>
          <Form.Item
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!getFieldValue('id') || !getFieldValue('password')) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('아이디 및 비밀번호를 확인해 주세요.'));
                },
              }),
            ]}
            style={{ flex: 1, width: 440, marginBottom: 0 }}
          >
            <Form.Item name="id" style={{ marginBottom: 5 }}>
              <Input placeholder="관리자 아이디를 입력해 주세요." style={{ flex: 1, height: 43, fontSize: 14, borderRadius: 4 }} />
            </Form.Item>
            <Form.Item name="password">
              <Input placeholder="비밀번호를 입력해 주세요." type="password" style={{ flex: 1, height: 43, fontSize: 14, borderRadius: 4 }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block style={{ height: 48, fontSize: 16, borderRadius: 4 }}>
                로그인
              </Button>
            </Form.Item>
          </Form.Item>
        </Form>
      </Box>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 180px);
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 70px 80px;
  background-color: ${ColorWhite};
  border-radius: 10px;
`;

const Logo = styled.img`
  width: 238px;
  height: 61px;
  margin-bottom: 60px;
`;

export default LoginAdmin;
