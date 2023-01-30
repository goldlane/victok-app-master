import { Button, Form, Input, Modal } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { API } from '../../Utils/API';
import { ColorMainBlue, ColorWhite } from '../../Utils/Color';
import { passwordReg, phoneNumReg } from '../../Utils/Reg';
import Headers from '../../Components/Headers';

// 비밀번호 재설정

function FindPw() {
  const navigate = useNavigate();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [send, setSend] = useState(true);
  const [auth, setAuth] = useState(true);
  const [next, setNext] = useState(1);
  const [userIdx, setUserIdx] = useState();

  const onSend = async () => {
    const phoneNum = form1.getFieldValue(['auth', 'phoneNum']);
    const check = phoneNumReg.test(phoneNum);
    if (check) {
      try {
        const res = await API.post('/user/auth-send-pw', { phone_number: phoneNum });
        Modal.success({
          title: '인증번호 발송',
          content: '입력하신 휴대폰 번호로 인증번호가 발송되었습니다.',
          okText: '확인',
        });
        setSend(false);
      } catch (error) {
        Modal.error({
          title: '핸드폰 인증 실패!',
          content: '가입 되어있는 번호가 아닙니다.',
          okText: '확인',
        });
      }
    } else {
      Modal.error({
        title: '핸드폰 인증 실패!',
        content: '핸드폰 번호를 올바르게 입력해 주세요.',
        okText: '확인',
      });
    }
  };

  const onAuth = async () => {
    const phoneAuth = form1.getFieldValue(['auth', 'phoneAuth']);
    const phoneNum = form1.getFieldValue(['auth', 'phoneNum']);
    try {
      const res = await API.post('/user/auth', { phone_number: phoneNum, auth_number: phoneAuth });
      Modal.success({ title: '인증번호 확인 완료', content: '휴대폰 인증이 완료되었습니다.', okText: '확인' });
      setAuth(false);
      setUserIdx(res.data.user_idx);
    } catch (error) {
      console.log(error);
      Modal.error({ title: '인증번호 확인 실패', content: '인증번호가 올바르지 않습니다.', okText: '확인' });
    }
  };

  const onCheck = async (values) => {
    if (auth) {
      return Modal.error({ title: '휴대폰 인증 오류', content: '휴대폰 인증을 완료해 주세요.', okText: '확인' });
    }
    try {
      setNext(2);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response);
      }
    }
  };

  const checkPw = async () => {
    const password = form2.getFieldValue('password');
    if (password && password.length < 8) {
      return Promise.reject(new Error('비밀번호는 최소 8자 이상이어야 합니다.'));
    }
    if (password && !passwordReg.test(password)) {
      return Promise.reject(new Error('영어 대문자 또는 소문자, 숫자, 특수문자 최소 1자씩 조합해 주세요.'));
    }

    return Promise.resolve();
  };

  const onModify = async (values) => {
    try {
      const res = await API.put('/user/password', { idx: userIdx, new_password: values.password });
      Modal.success({
        title: '비밀번호 변경 완료',
        content: '비밀번호 변경이 완료되었습니다. 새 비밀번호로 로그인해 주세요.',
        okText: '확인',
        onOk: () => navigate('/login'),
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
      }
    }
  };

  const doubleCheck = async () => {
    const password1 = form2.getFieldValue('password');
    const password2 = form2.getFieldValue('confirm');
    if (password1 !== password2) {
      return Promise.reject(new Error('비밀번호가 서로 일치하지 않습니다.'));
    }
    return Promise.resolve();
  };
  return (
    <>
      <Headers></Headers>
      <Container>
        <Box>
          <div
            style={{
              display: next === 1 ? 'flex' : 'none',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <div style={{ alignItems: 'flex-start', width: '100%' }}>
              <Title>비밀번호 재설정</Title>
              <SubTitle>
                가입 시 등록한 휴대폰 번호를 입력해 주세요.
                <br />
                인증 후 비밀번호 재설정이 가능합니다.
              </SubTitle>
            </div>
            <Form form={form1} layout="vertical" onFinish={onCheck} style={{ width: '100%' }}>
              <Form.Item label="휴대폰 번호" name="auth" dependencies={['phoneNum', 'phoneAuth']}>
                <Wrap style={{ marginBottom: 5 }}>
                  <Form.Item name={['auth', 'phoneNum']} noStyle rules={[{ required: send, message: '휴대폰 번호를 입력해 주세요!' }]}>
                    <Input placeholder="휴대폰 번호" style={{ marginRight: 5, borderRadius: 4 }} disabled={!auth} />
                  </Form.Item>
                  <Button type="primary" style={{ width: 170, borderRadius: 4 }} onClick={onSend} disabled={!auth}>
                    {send ? '인증번호 요청' : '재전송'}
                  </Button>
                </Wrap>
                <Wrap>
                  <Form.Item name={['auth', 'phoneAuth']} noStyle>
                    <Input placeholder="인증 번호" style={{ marginRight: 5, borderRadius: 4 }} disabled={!auth} />
                  </Form.Item>
                  <Button type="primary" style={{ width: 170, borderRadius: 4 }} disabled={!auth} onClick={onAuth}>
                    확인
                  </Button>
                </Wrap>
              </Form.Item>
              <Form.Item noStyle>
                <Button type="primary" htmlType="submit" block style={{ height: 48, fontSize: 16, borderRadius: 4 }}>
                  다음
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div
            style={{
              display: next === 2 ? 'flex' : 'none',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <div style={{ alignItems: 'flex-start', width: '100%' }}>
              <Title>비밀번호 재설정</Title>
              <SubTitle>
                새로운 비밀번호를 입력해 주세요!
                <br />
                비밀번호 변경 후 새 비밀번호로 로그인해 주세요.
              </SubTitle>
            </div>
            <Form form={form2} layout="vertical" onFinish={onModify} style={{ width: '100%' }}>
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
              <Form.Item noStyle>
                <Button type="primary" htmlType="submit" block style={{ height: 48, fontSize: 16, borderRadius: 4 }}>
                  비밀번호 재설정
                </Button>
              </Form.Item>
            </Form>
          </div>
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
  min-width: 600px;
  height: 466px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 70px;
  padding: 80px;
  background-color: ${ColorWhite};
  border-radius: 10px;
`;

const Title = styled.p`
  font-size: 24px;
  font-weight: bold;
`;

const SubTitle = styled.p`
  font-weight: 200;
  font-size: 16px;
  padding: 0;
  margin-bottom: 30px;
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Label = styled.span`
  color: ${ColorMainBlue};
  font-size: 12px;
`;

export default FindPw;
