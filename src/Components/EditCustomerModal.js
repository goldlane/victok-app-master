import { Button, Form, Input, Modal } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { API } from '../Utils/API';
import axios from 'axios';
const { TextArea } = Input;

function EditCustomerModal({ visible, setVisible, getData, user_idx }) {
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
    const formdata = {
      user_idx: user_idx,
      customer_idx: visible.idx,
      name: values.name,
      phone: values.hp,
      memo: values.memo,
    };
    try {
      const res = await API.put('customer/customer-info', formdata);
      onCancel();
      Modal.success({
        title: '회원 정보 수정 완료',
        content: '회원 정보가 수정되었습니다.',
        okText: '확인',
        onOk: () => {
          getData();
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

  useEffect(() => {
    if (visible)
      form1.setFieldsValue({
        name: visible.name,
        hp: visible.phone,
        memo: visible.memo,
      });
  });

  return (
    <Modal visible={visible} title={`회원 정보 수정`} onCancel={onCancel} footer={[]} maskClosable={false}>
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

export default EditCustomerModal;
