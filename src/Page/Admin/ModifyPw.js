import { Button, Form, Input, Modal } from 'antd';
import React from 'react';
import styled from 'styled-components';
import HeadersAdmin from '../../Components/HeadersAdmin';
import { API } from '../../Utils/API';
import { ColorMainBlue, ColorWhite } from '../../Utils/Color';
import { passwordReg } from '../../Utils/Reg';

// 관리자 - 비밀번호 재설정

function ModifyPw() {
  const [form1] = Form.useForm();

  const onModify = async (values) => {
    try {
      const res = await API.put('/admin/password', { new_password: values.password });
      Modal.success({
        title: '비밀번호 변경 완료.',
        content: '비밀번호가 변경되었습니다. 다음 로그인 시 새 비밀번호로 로그인해 주세요.',
      });
      form1.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  const checkPw = async () => {
    const password = form1.getFieldValue('password');
    if (password && password.length < 8) {
      return Promise.reject(new Error('비밀번호는 최소 8자 이상이어야 합니다.'));
    }
    if (password && !passwordReg.test(password)) {
      return Promise.reject(new Error('영어 대문자 또는 소문자, 숫자, 특수문자 최소 1자씩 조합해 주세요.'));
    }

    return Promise.resolve();
  };

  const doubleCheck = async () => {
    const password1 = form1.getFieldValue('password');
    const password2 = form1.getFieldValue('confirm');
    if (password1 !== password2) {
      return Promise.reject(new Error('비밀번호가 서로 일치하지 않습니다.'));
    }
    return Promise.resolve();
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <HeadersAdmin></HeadersAdmin>
      <Container>
        <Box>
          <div style={{ width: '550px' }}>
            <div style={{ width: '100%' }}>
              <Title>비밀번호 재설정</Title>
              <SubTitle>
                새로운 비밀번호를 입력해 주세요!
                <br />
                비밀번호 변경 후 새 비밀번호로 로그인해 주세요.
              </SubTitle>
            </div>
            <Form form={form1} layout="vertical" onFinish={onModify} style={{ width: '100%' }}>
              <Form.Item
                label="새 비밀번호"
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
                <Input.Password placeholder="비밀번호를 입력해 주세요." style={{ borderRadius: 4, borderColor: '#E3E3E3' }} />
              </Form.Item>

              <Form.Item
                label="새 비밀번호 확인"
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
                <Input.Password placeholder="비밀번호를 입력해 주세요." style={{ borderRadius: 4, borderColor: '#E3E3E3' }} />
              </Form.Item>
              <Form.Item noStyle>
                <Button type="primary" htmlType="submit" block style={{ height: 50, fontSize: 16, borderRadius: 4, marginTop: 20 }}>
                  비밀번호 재설정
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Box>
      </Container>
    </div>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 50px 80px;
  background-color: ${ColorWhite};
`;

const Title = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: ${ColorMainBlue};
`;

const SubTitle = styled.p`
  font-weight: 200;
  font-size: 16px;
  padding: 0;
  margin-bottom: 30px;
`;

const Label = styled.span`
  color: ${ColorMainBlue};
  font-size: 12px;
`;

export default ModifyPw;
