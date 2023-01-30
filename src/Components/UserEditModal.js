import { Button, Form, Input, Modal, Select } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { API } from '../Utils/API';
import axios from 'axios';
const { Option } = Select;
const { TextArea } = Input;

function UserEditModal({ visible, setVisible, getData, getData2, getRemainData, lockerTypeInfo, showType, admin, user_idx }) {
  const [form] = Form.useForm();
  const [selectedLockerType, setSelectedLockerType] = useState(false);
  const [lockerNumber, setLockerNumber] = useState([]);
  const onCancel = useCallback(() => {
    form.resetFields();
    setVisible(false);
  }, []);

  const onConfirm = async (values) => {
    const formdata = {
      locker_idx: visible.idx,
      customer_name: values.name,
      customer_phone: values.hp,
      locker_type: lockerTypeInfo.find((item) => item.locker_type === values.locker_type).locker_type,
      locker_number: values.locker_number,
      memo: values.memo,
      admin: admin ?? false,
      user_idx: user_idx,
    };
    console.log('formdata', formdata);
    try {
      const res = await API.put('locker/locker', formdata);
      onCancel();
      Modal.success({
        title: '라카 이용자 수정 완료',
        content: '라카 이용자가 수정되었습니다.',
        okText: '확인',
        onOk: () => {
          if (showType === 'list') getData();
          else getData2();
          if (getRemainData) getRemainData();
        },
      });
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response.status === 409) {
          return Modal.error({
            title: '라카 이용자 수정 실패',
            content: error.response.data.message,
            okText: '확인',
          });
        }
        console.log(error.response);
      }
    }
  };

  const checkType = async (value) => {
    if ('locker_type' in value) {
      setSelectedLockerType(false);
      try {
        const locker = lockerTypeInfo.find((item) => item.locker_type === value.locker_type);
        const res = await API.get('locker/locker-number', { params: { locker_type_idx: locker.idx } });
        const list = [];
        const lockerInfo = lockerTypeInfo.find((item) => item.locker_type === value.locker_type);
        const checkNum = res.data.lockerNumber;
        for (let i = lockerInfo.start_number; i < lockerInfo.locker_amount + lockerInfo.start_number; i++) {
          if (!checkNum.includes(i)) {
            list.push(i);
          }
        }
        setLockerNumber(list);
        setSelectedLockerType(true);
        form.setFieldsValue({ locker_number: undefined });
      } catch (error) {}
    }
    if ('hp' in value) {
      form.setFieldsValue({ hp: value.hp.replace(/[^0-9]/g, '') });
    }
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        name: visible.name,
        hp: visible.phone,
        memo: visible.memo,
        locker_type: visible.locker_type,
        locker_number: visible.locker_number,
      });
      const check = async () => {
        try {
          setSelectedLockerType(false);
          const lockerInfo = lockerTypeInfo.find((item) => item.locker_type === visible.locker_type);
          const res = await API.get('locker/locker-number', { params: { locker_type_idx: lockerInfo.idx } });
          const list = [];
          const checkNum = res.data.lockerNumber;
          for (let i = lockerInfo.start_number; i < lockerInfo.locker_amount + lockerInfo.start_number; i++) {
            if (!checkNum.includes(i)) {
              list.push(i);
            }
          }
          setLockerNumber(list);
          setSelectedLockerType(true);
        } catch (error) {}
      };
      check();
    }
  }, [visible]);

  return (
    <Modal visible={visible} title={`라카 이용자 정보 수정`} onCancel={onCancel} footer={[]} maskClosable={false}>
      <Form form={form} layout="vertical" name="addUser" onFinish={onConfirm} onValuesChange={checkType}>
        <Form.Item
          name="locker_type"
          label="라카 구분"
          rules={[
            {
              required: true,
              message: '라카 구분을 선택해 주세요.',
            },
          ]}
        >
          <Select placeholder="라카 구분을 선택해 주세요.">
            {lockerTypeInfo.map((item, index) => (
              <Option key={`lcokerType-${index}`} value={item.locker_type}>
                {item.locker_type}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="locker_number"
          label="라카 번호"
          rules={[
            {
              required: true,
              message: '라카 번호를 선택해 주세요.',
            },
          ]}
        >
          <Select placeholder="라카 번호를 선택해 주세요." disabled={!selectedLockerType}>
            {lockerNumber.map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
        </Form.Item>
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
            style={{ height: '160px', paddingTop: '7px' }}
          />
        </Form.Item>
        <Form.Item noStyle>
          <Button type="primary" htmlType="submit" block style={{ borderRadius: 5, height: 40, marginTop: 20 }}>
            수정하기
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default UserEditModal;
