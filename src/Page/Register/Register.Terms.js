import { Button, Checkbox, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { API } from '../../Utils/API';
import { ColorGold } from '../../Utils/Color';

// 회원가입 - 약관 동의

function RegisterTerms({ form, setStep }) {
  const [all, setAll] = useState(false);
  const [use, setUse] = useState('');
  const [privacy, setPrivacy] = useState('');

  const onInit = async () => {
    try {
      const res = await API.get('/user/terms');
      setUse(res.data[0].terms_of_use);
      setPrivacy(res.data[0].privacy_policy);
    } catch {}
  };

  useEffect(() => {
    onInit();
  }, []);

  const onSubmit = () => {
    setStep('account');
  };

  const onValueChange = (value) => {
    const agree = form.getFieldValue('agree');
    if (agree.length > 2) {
      setAll(true);
    } else {
      setAll(false);
    }
  };

  const onAll = (value) => {
    if (value.target.checked) {
      setAll(true);
      form.setFieldsValue({ agree: ['use', 'privacy', 'marketing'] });
    } else {
      setAll(false);
      form.setFieldsValue({ agree: [] });
    }
  };

  return (
    <>
      <Container>
        <Title>이용약관</Title>
        <Form
          form={form}
          style={{ display: 'flex', flexDirection: 'column', minWidth: 440, flex: 1 }}
          onFinish={onSubmit}
          onValuesChange={onValueChange}
        >
          <Wrap style={{ borderBottom: '1px solid #162D59' }}>
            <Checkbox checked={all} onChange={onAll} />
            <Label>모든 약관에 동의합니다.</Label>
          </Wrap>
          <Form.Item
            name="agree"
            style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center' }}
            rules={[
              ({ getFieldValues }) => ({
                validator(_, value) {
                  if (value && value.includes('use') && value.includes('privacy')) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('필수 약관에 동의해 주세요.'));
                },
              }),
            ]}
          >
            <Checkbox.Group>
              <Wrap>
                <Checkbox value="use" />
                <Label>빅톡 서비스 이용약관 동의합니다. (필수)</Label>
                <A href={use} target="_blank">
                  자세히
                </A>
              </Wrap>
              <Wrap>
                <Checkbox value="privacy" />
                <Label>빅톡 개인정보 수집 및 이용에 동의합니다. (필수)</Label>
                <A href={privacy} target="_blank">
                  자세히
                </A>
              </Wrap>
              <Wrap>
                <Checkbox value="marketing" />
                <Label>빅톡 마케팅 정보 수신에 동의합니다.</Label>
              </Wrap>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item style={{ margin: 0 }} noStyle>
            <Button type="primary" htmlType="submit" block style={{ height: 48, fontSize: 16, borderRadius: 4, marginBottom: 30 }}>
              동의하기
            </Button>
          </Form.Item>
        </Form>
      </Container>
    </>
  );
}

const Container = styled.div``;

const Title = styled.div`
  width: 100%;
  font-size: 24px;
  font-weight: bold;
  text-align: left;
  padding: 37px 0;
`;

const Wrap = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  padding: 15px 0;
`;

const Label = styled.div`
  display: flex;
  flex: 1;
  padding: 0 5px;
  width: 400px;
  font-size: 16px;
`;

const A = styled.a`
  color: ${ColorGold};
  text-decoration: underline;
`;
export default RegisterTerms;
