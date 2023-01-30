import { Button, Form, Input, Modal } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { API } from '../../Utils/API';
import { ColorWhite } from '../../Utils/Color';
import { phoneNumReg } from '../../Utils/Reg';

// 설정 - 개인 정보 수정

function EditUserInfo() {
  const [form] = Form.useForm();
  const [send, setSend] = useState(true);
  const [auth, setAuth] = useState(true);

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

  const getInfo = async () => {
    try {
      const res = await API.get('/user/info');
      form.setFieldsValue({
        name: res.data.user_name,
        nickname: res.data.nickname,
      });
    } catch {}
  };

  const onModify = async (values) => {
    const phoneNum = values.auth ? values.auth.phoneNum : '';
    if (phoneNum && auth) return Modal.error({ title: '개인 정보 수정 실패!', content: '핸드폰 번호 인증을 완료해 주세요.', okText: '확인' });
    try {
      const res = await API.put('/user/user-info', { name: values.name, nickname: values.nickname, phone: phoneNum });
      Modal.success({
        title: '개인 정보 수정 완료!',
        content: '개인 정보가 수정되었습니다.',
        okText: '확인',
        onOk: () => {
          setAuth(true);
          setSend(true);
          form.setFieldsValue({ auth: undefined });
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Modal.error({ title: '개인 정보 수정 실패!', content: error.response.data.meessage, okText: '확인' });
      }
    }
  };

  const checkNick = async () => {
    const nickname = form.getFieldValue('nickname');
    if (nickname) {
      if (nickname.length > 10) {
        return Promise.reject(new Error('닉네임은 10자 이내로 입력해 주세요.'));
      }
      try {
        const formdata = {
          nickname: nickname,
        };
        const req = await API.post('/user/nickname-check-edit', formdata);
        return Promise.resolve();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(error.response.data);
        }
        return Promise.reject(new Error('사용할 수 없는 닉네임입니다.'));
      }
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <Box>
      <div style={{ alignItems: 'flex-start', width: '100%' }}>
        <Title>개인 정보 수정</Title>
      </div>
      <Form form={form} layout="vertical" onFinish={onModify} style={{ width: '100%' }}>
        <Form.Item
          label="이름"
          name="name"
          style={{ marginBottom: 10 }}
          rules={[
            {
              required: true,
              message: '이름을 입력해 주세요!',
            },
          ]}
          validateTrigger={['onBlur']}
        >
          <Input placeholder="이름을 입력해 주세요." style={{ marginRight: 5, borderRadius: 4 }} />
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
        <Form.Item label="휴대폰 번호" name="auth" dependencies={['phoneNum', 'phoneAuth']}>
          <Wrap style={{ marginBottom: 5 }}>
            <Form.Item name={['auth', 'phoneNum']} noStyle>
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
        <Button type="primary" htmlType="submit" block style={{ height: 48, fontSize: 16, borderRadius: 4, marginTop: 20 }}>
          수정
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

const Wrap = styled.div`
  display: flex;
  flex-direction: row;
`;

export default EditUserInfo;
