import { Button, Form, Input, Modal } from 'antd';
import React, { useCallback } from 'react';
import { API } from '../Utils/API';
import axios from 'axios';
const { TextArea } = Input;

function ResisterCustomerModal({ visible, setVisible, user_idx, getData }) {
  const [form1] = Form.useForm();

  const onCancel = useCallback(() => {
    form1.resetFields();
    setVisible();
  }, []);

  const checkType = async (value) => {
    if ('hp' in value) {
      form1.setFieldsValue({ hp: value.hp.replace(/[^0-9]/g, '') });
    }
  };

  const onConfirm = async (values) => {
    const lockerInfo = form1.getFieldsValue();
    const formdata = {
      customer_name: lockerInfo.name,
      customer_phone: lockerInfo.hp,
      memo: lockerInfo.memo ? lockerInfo.memo : '',
      user_idx: user_idx,
    };
    try {
      const res = await API.post('/customer/customer', formdata);
      onCancel();
      Modal.success({
        title: '사용자 등록 완료',
        content: '사용자가 등록되었습니다.',
        okText: '확인',
        onOk: () => {
          getData();
          onCancel();
        },
      });
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response.status === 409) {
          return Modal.error({
            title: '회원 등록 실패',
            content: '해당 정보로 등록된 회원이 존재합니다.',
            okText: '확인',
          });
        }
        console.log(error.response);
      }
    }
  };

  return (
    <Modal visible={visible} title={`회원 등록`} onCancel={onCancel} footer={[]} maskClosable={false}>
      <div style={{ flexDirection: 'column', padding: '5px 15px' }}>
        <Form form={form1} layout="vertical" name="addUser" onFinish={onConfirm} onValuesChange={checkType}>
          <Form.Item
            name="name"
            label="회원 이름"
            rules={[
              {
                required: true,
                message: '이름을 입력해 주세요.',
              },
            ]}
          >
            <Input placeholder="이름을 입력해 주세요." />
          </Form.Item>
          <Form.Item
            name="hp"
            label="휴대폰 번호"
            rules={[
              {
                required: true,
                message: '휴대폰 번호를 입력해 주세요.',
              },
            ]}
          >
            <Input placeholder="휴대폰 번호를 입력해 주세요." />
          </Form.Item>

          <Form.Item name="memo" label="메모">
            <TextArea
              placeholder="이용자에 대한 자세한 내용을 자유롭게 남겨주세요☺
검색이 용이해집니다.
ex) 가나다 클럽, 3개월 무료 사용"
              style={{ height: '180px' }}
            />
          </Form.Item>

          <Form.Item noStyle>
            <Button type="primary" htmlType="submit" block style={{ borderRadius: 5, height: 40, marginTop: 20 }}>
              등록
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}

export default ResisterCustomerModal;
