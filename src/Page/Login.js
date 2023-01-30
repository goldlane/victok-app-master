import { Button, Checkbox, Form, Input, Modal } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import img_logo from '../Assets/images/login_txt.png';
import Headers from '../Components/Headers';
import { API } from '../Utils/API';
import { ColorBlack, ColorGold, ColorWhite } from '../Utils/Color';
import jwt_decode from 'jwt-decode';
import AdModalContent from 'Components/AdModalContent';

// 로그인

function Login() {
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
      const loginTime = res.data.userInfo.login_time;
      console.log('LoginData', res.data);
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      sessionStorage.setItem('token', token);
      if (check) {
        localStorage.setItem('token', token);
      }
      const userIdx = jwt_decode(token);
      if (userIdx.idx === 1) {
        navigate('/store');
      } else {
        if (!loginTime) {
          Modal.info({
            title: '알림',
            content: <AdModalContent />,
            okText: '이용권 구매하기',
            onOk: () => {
              localStorage.setItem('myPageTab', 'payment');
              navigate('/mypage');
            },
            closable: true,
          });
        }
        navigate('/lockershow');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Modal.error({ title: '로그인 오류', content: error.response.data.message });
      }
    }
  };
  return (
    <>
      <Headers></Headers>
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
                <Input placeholder="이메일을 입력해 주세요." style={{ flex: 1, height: 43, fontSize: 14, borderRadius: 4 }} />
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

          <Wrap style={{ width: '100%', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Wrap>
              <Checkbox onChange={(e) => setCheck(e.target.checked)} value={check} />
              <Label style={{ marginLeft: 5 }}>자동로그인</Label>
            </Wrap>

            <Link to={'/findpw'}>
              <Label>비밀번호가 기억나지 않으신가요?</Label>
            </Link>
          </Wrap>
          <Wrap style={{ width: '100%', alignItems: 'flex-end', justifyContent: 'center', marginTop: 60 }}>
            <Label>VICTOK을 처음 시작하시나요?</Label>
            <Link to={'/register'}>
              <Label style={{ color: ColorGold, textDecoration: 'underline', marginLeft: 5 }}>회원가입</Label>
            </Link>
          </Wrap>
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
  min-width: 440px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 70px;
  padding: 70px 80px;
  background-color: ${ColorWhite};
  border-radius: 10px;
`;

const Logo = styled.img`
  width: 238px;
  height: 61px;
  margin-bottom: 60px;
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Label = styled.span`
  color: ${ColorBlack};
  font-size: 16px;
`;

export default Login;
