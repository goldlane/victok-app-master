import { Button, Form, Input, Modal, Select } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PostModal from '../../Components/PostModal';
import { API } from '../../Utils/API';
import { ColorWhite } from '../../Utils/Color';

// 설정 - 시설 정보 수정

const { Option } = Select;
function EditUserInfo() {
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const [storeIdx, setStoreIdx] = useState();

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const onAddress = (value) => {
    form.setFieldsValue({ address: { zip: value.zonecode, addr: value.address } });
  };

  const getInfo = async () => {
    try {
      const res = await API.get('/user/info');
      setStoreIdx(res.data.store_idx);
      form.setFieldsValue({
        name: res.data.store_name,
        type: res.data.type,
        address: { zip: res.data.zip_code, addr: res.data.address1, detail: res.data.address2 },
        hp: res.data.contact,
      });
    } catch {}
  };

  const onFinish = async (values) => {
    try {
      const res = await API.put('/user/store-info', {
        store_idx: storeIdx,
        type: values.type,
        name: values.name,
        zip_code: values.address.zip,
        address1: values.address.addr,
        address2: values.address.detail,
        contact: values.hp,
      });
      Modal.success({ title: '시설 정보 변경 완료!', content: '시설 정보가 변경되었습니다.', okText: '확인' });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Modal.error({ title: '시설 정보 변경 실패!', content: error.response.data.messsage, okText: '확인' });
      }
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <Box>
      <div style={{ alignItems: 'flex-start', width: '100%' }}>
        <Title>시설 정보 수정</Title>
      </div>
      <Form form={form} layout="vertical" onFinish={onFinish} style={{ width: '100%' }}>
        <Form.Item label="시설 유형" name="type" rules={[{ required: true, message: '시설 유형을 선택해 주세요!' }]} style={{ flex: 1 }}>
          <Select placeholder="선택해 주세요." onChange={onChange} style={{ minWidth: 220 }}>
            <Option value="볼링장">볼링장</Option>
            <Option value="기타">기타</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="시설 이름"
          name="name"
          style={{ marginBottom: 10 }}
          rules={[
            {
              required: true,
              message: '시설 이름을 입력해 주세요!',
            },
          ]}
        >
          <Input placeholder="시설 이름을 입력해 주세요." style={{ marginRight: 5, borderRadius: 4 }} />
        </Form.Item>
        <Form.Item label="시설 주소" name="address" style={{ flex: 1 }} rules={[{ required: true }]}>
          <Wrap>
            <Form.Item
              name={['address', 'zip']}
              style={{ flex: 1, marginRight: 5, marginBottom: 0 }}
              rules={[{ required: true, message: '주소를 입력해 주세요!' }]}
            >
              <Input placeholder="우편번호" disabled={true} />
            </Form.Item>
            <Button type="primary" onClick={() => setShowModal(true)}>
              우편번호 검색
            </Button>
          </Wrap>
          <Form.Item name={['address', 'addr']} style={{ marginTop: 5, marginBottom: 5 }}>
            <Input placeholder="주소" style={{ flex: 1 }} disabled={true} />
          </Form.Item>
          <Form.Item name={['address', 'detail']} noStyle rules={[{ required: true, message: '상세주소를 입력해 주세요!' }]}>
            <Input placeholder="상세주소를 입력해 주세요." style={{ flex: 1 }} />
          </Form.Item>
        </Form.Item>
        <Form.Item label="시설 연락처" name="hp" style={{ flex: 1 }} rules={[{ required: true, message: '시설 연락처를 입력해 주세요!' }]}>
          <Input placeholder="시설 연락처를 입력해 주세요." style={{ flex: 1 }} />
        </Form.Item>
        <Button type="primary" htmlType="submit" block style={{ height: 48, fontSize: 16, borderRadius: 4, marginTop: 20 }}>
          수정
        </Button>
      </Form>
      <PostModal visible={showModal} setVisible={setShowModal} setAddress={onAddress} />
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
