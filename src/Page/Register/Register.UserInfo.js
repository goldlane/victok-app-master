import { Button, Form, Input, Modal } from 'antd';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { API } from '../../Utils/API';
import { ColorMainBlue, ColorWhite } from '../../Utils/Color';
import { phoneNumReg } from '../../Utils/Reg';

// 회원가입 - 개인 정보

function RegisterUserInfo({ form, step, setStep }) {
  const [send, setSend] = useState(true);
  const [auth, setAuth] = useState(true);

  const checkNick = useCallback(async () => {
    const nickname = form.getFieldValue('nickname');
    if (nickname && nickname.length > 10) {
      return Promise.reject(new Error('닉네임은 10자 이내로 입력해 주세요.'));
    }
    try {
      const formdata = {
        nickname: nickname,
      };
      const req = await API.post('/user/nickname-check', formdata);
      return Promise.resolve();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response.data);
      }
      return Promise.reject(new Error('사용할 수 없는 닉네임입니다.'));
    }
  }, []);

  const onSend = async () => {
    const phoneNum = form.getFieldValue(['auth', 'phoneNum']);
    const check = phoneNumReg.test(phoneNum);
    if (check) {
      try {
        const res = await API.post('/user/auth-send', { phone_number: phoneNum });
        Modal.success({ title: '인증번호 발송', content: '입력하신 휴대폰 번호로 인증번호가 발송되었습니다.', okText: '확인' });
        setSend(false);
      } catch (error) {
        console.log(error);
        Modal.error({
          title: '핸드폰 인증 실패!',
          content: '이미 가입된 번호입니다.',
          okText: '확인',
        });
      }
    } else {
      Modal.error({
        title: '핸드폰 인증 실패!',
        content: '핸드폰 번호를 올바르게 입력해 주세요.',
      });
    }
  };

  const onAuth = async () => {
    const phoneAuth = form.getFieldValue(['auth', 'phoneAuth']);
    const phoneNum = form.getFieldValue(['auth', 'phoneNum']);

    try {
      const res = await API.post('/user/auth', { phone_number: phoneNum, auth_number: phoneAuth });
      Modal.success({ title: '인증번호 확인 완료', content: '휴대폰 인증이 완료되었습니다.', okText: '확인' });
      setAuth(false);
    } catch (error) {
      console.log(error);
      Modal.error({ title: '인증번호 확인 실패', content: '인증번호가 올바르지 않습니다.', okText: '확인' });
    }
  };

  const onSubmit = (values) => {
    if (!auth) setStep('facility');
    else {
      Modal.error({ title: '휴대폰 인증 오류', content: '휴대폰 인증을 완료해 주세요.', okText: '확인' });
    }
  };

  useEffect(() => {
    if (step === 'info') {
      setAuth(true);
      setSend(true);
      const phoneNum = form.getFieldValue(['auth', 'phoneNum']) ?? '';
      if (phoneNum) form.setFieldsValue({ auth: { phoneNum: '', phoneAuth: '' } });
    }
  }, [step]);

  return (
    <Container>
      <Title>기본 정보</Title>
      <Form form={form} layout="vertical" style={{ minWidth: 440 }} onFinish={onSubmit}>
        <Wrap style={{ flex: 1 }}>
          <Section style={{ flex: 1 }}>
            <Form.Item label="대표자 이름" name="name" rules={[{ required: true, message: '이름을 입력해 주세요!' }]}>
              <Input placeholder="이름을 입력해 주세요." />
            </Form.Item>
            <Form.Item
              label="닉네임"
              name="nickname"
              rules={[
                { required: true, message: '닉네임을 입력해 주세요!' },
                { validator: checkNick, validateTrigger: 'onBlur' },
              ]}
              validateTrigger={['onBlur']}
            >
              <Input placeholder="10자 이내" />
            </Form.Item>
            <Form.Item label="이메일" name="email" rules={[{ required: true, message: '이메일을 입력해 주세요!' }]}>
              <Input placeholder="이메일을 입력해 주세요." disabled={true} />
            </Form.Item>
            <Form.Item
              label="휴대폰 번호"
              name="auth"
              dependencies={['phoneNum', 'phoneAuth']}
              rules={[{ required: true, message: '휴대폰 인증을 완료해 주세요!' }]}
            >
              <Wrap style={{ marginBottom: 5 }}>
                <Form.Item name={['auth', 'phoneNum']} noStyle rules={[{ required: true, message: '휴대폰 번호를 입력해 주세요!' }]}>
                  <Input placeholder="휴대폰 번호" style={{ marginRight: 5 }} disabled={!auth} maxLength={11} />
                </Form.Item>
                <Button type="primary" style={{ width: 170 }} onClick={onSend} disabled={!auth}>
                  {send ? '인증번호 요청' : '재전송'}
                </Button>
              </Wrap>
              <Wrap>
                <Form.Item name={['auth', 'phoneAuth']} noStyle>
                  <Input placeholder="인증 번호" style={{ marginRight: 5 }} disabled={!auth} />
                </Form.Item>
                <Button type="primary" style={{ width: 170 }} disabled={!auth} onClick={onAuth}>
                  확인
                </Button>
              </Wrap>
            </Form.Item>
          </Section>
        </Wrap>
        <Wrap style={{ marginTop: 10, marginBottom: 10 }}>
          <Form.Item noStyle>
            <Button
              onClick={() => setStep('account')}
              block
              style={{
                height: 48,
                fontSize: 16,
                borderRadius: 4,
                backgroundColor: ColorWhite,
                color: ColorMainBlue,
                boxSizing: 'border-box',
                borderColor: ColorMainBlue,
                marginRight: 3,
              }}
            >
              이전
            </Button>
          </Form.Item>
          <Form.Item noStyle>
            <Button type="primary" htmlType="submit" block style={{ height: 48, fontSize: 16, borderRadius: 4, marginLeft: 3 }}>
              다음
            </Button>
          </Form.Item>
        </Wrap>
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

const Wrap = styled.div`
  display: flex;
  flex-direction: row;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
`;

export default RegisterUserInfo;
