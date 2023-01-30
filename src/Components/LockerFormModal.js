import { Button, Checkbox, Divider, Form, Input, Modal, Radio } from 'antd';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { DeleteFilled } from '@ant-design/icons/lib/icons';
import { API } from '../Utils/API';
import axios from 'axios';
import { ColorGold, ColorWhite } from 'Utils/Color';
import AdModalContent from './AdModalContent';

function LockerFormModal({ visible, setVisible, getData, data, grade }) {
  const navigate = useNavigate();

  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [page, setPage] = useState(1);
  const [chargeList, setChargeList] = useState([]);
  const dday_option = [
    { label: '전날', value: 1 },
    { label: '3일 전', value: 3 },
    { label: '7일 전', value: 7 },
    { label: '15일 전', value: 15 },
    { label: '30일 전', value: 30 },
  ];
  const [periodType, setPeriodType] = useState(1);

  const onCancel = useCallback(() => {
    form1.resetFields();
    form2.resetFields();
    setPage(1);
    setVisible(false);
    setChargeList([]);
  }, []);

  const onNext = useCallback((values) => {
    setPage(2);
    form2.setFieldsValue({ talk_dday: [3], deposit: 0 });
  }, []);

  const onConfirm = async (values) => {
    if (chargeList.length === 0) {
      return Modal.error({ title: '라카 구분 등록 알림', content: `기간 및 요금을 입력해 주세요.`, okText: '확인' });
    }
    const lockerInfo = form1.getFieldsValue();
    const talk_dday = form2.getFieldValue('talk_dday');
    try {
      const formdata = {
        locker_type: lockerInfo.name,
        locker_amount: lockerInfo.max,
        start_number: lockerInfo.startNum,
        talk_dday: talk_dday,
        charge: chargeList,
      };
      const res = await API.post('/locker/locker-type', formdata);
      getData();
      onCancel();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
        Modal.error({ title: '라카 구분 등록 알림', content: `이미 동일한 이름의 라카 구분이 있습니다.`, okText: '확인' });
      }
    }
  };

  const onCheck = async () => {
    const name = form1.getFieldValue('name');
    const check = data.find((item) => item.locker_type === name);
    if (check) {
      return Promise.reject(new Error('이미 사용중인 라카 이름입니디.'));
    }
    return Promise.resolve();
  };

  const onAddCharge = () => {
    const period = Number(form2.getFieldValue('period'));
    const charge = Number(form2.getFieldValue('charge'));
    const deposit = Number(form2.getFieldValue('deposit'));
    if (chargeList.length === 6) {
      return Modal.error({ title: '요금 추가 알림', content: '요금은 최대 6개까지만 추가할 수 있습니다.', okText: '확인' });
    }
    if (!String(deposit)) {
      return Modal.error({ title: '요금 추가 알림', content: `보증금을 입력해주세요.`, okText: '확인' });
    }
    if (!period || !String(charge)) {
      return Modal.error({ title: '요금 추가 알림', content: `기간은 1일 이상이어야 하며, 금액은 100원 단위로 입력할 수 있습니다.`, okText: '확인' });
    }
    if (Number(period) === 0 || Number(charge) % 100 !== 0) {
      return Modal.error({ title: '요금 추가 알림', content: `기간은 1일 이상이어야 하며, 금액은 100원 단위로 입력할 수 있습니다.`, okText: '확인' });
    }
    const duplication = chargeList.find(
      (item) => item.period === period && item.period_type === periodType && item.charge === charge && item.deposit === deposit
    );
    console.log(duplication);
    if (!duplication) {
      const item = {
        period_type: periodType,
        period,
        charge,
        deposit,
      };
      console.log('기록', charge, item);
      setChargeList([...chargeList, item]);
      form2.setFieldsValue({ period: '', charge: '', deposit: '' });
    } else {
      Modal.error({ title: '요금 추가 알림', content: `이미 동일한 기간의 요금제가 있습니다.`, okText: '확인' });
    }
  };

  const onDeleteCharge = (value) => {
    const reCharge = chargeList.filter((item, index) => index !== value);
    setChargeList(reCharge);
  };

  const onValuesChange1 = async (value) => {
    if ('max' in value) {
      form1.setFieldsValue({ max: value.max.replace(/[^0-9]/g, '') });
    }
    if ('startNum' in value) {
      form1.setFieldsValue({ startNum: value.startNum.replace(/[^0-9]/g, '') });
    }
  };

  const onValuesChange2 = async (value) => {
    if ('period' in value) {
      form2.setFieldsValue({ period: value.period.replace(/[^0-9]/g, '') });
    }
    if ('charge' in value) {
      form2.setFieldsValue({ charge: value.charge.replace(/[^0-9]/g, '') });
    }
    if ('deposit' in value) {
      form2.setFieldsValue({ deposit: value.deposit.replace(/[^0-9]/g, '') });
    }
    if ('talk_dday' in value) {
      console.log(value.talk_dday, grade);
      if (grade === 0 && value.talk_dday.length > 1) {
        form2.setFieldsValue({ talk_dday: [3] });
        Modal.info({
          title: '유료 회원 전용 기능',
          content: <AdModalContent />,
          okText: '이용권 구매하기',
          onOk: () => {
            localStorage.setItem('myPageTab', 'payment');
            navigate('/mypage');
          },
          closable: true,
        });
      }
    }
  };

  return (
    <Modal visible={visible} title={`라카 구분 추가(${page}/2)`} onCancel={onCancel} footer={[]} maskClosable={false}>
      <div style={{ display: page === 1 ? 'flex' : 'none', flexDirection: 'column', padding: '5px 15px' }}>
        <Form form={form1} layout="vertical" name="addUser" onFinish={onNext} onValuesChange={onValuesChange1}>
          <Form.Item
            name="name"
            label="라카 이름"
            rules={[
              {
                required: true,
                message: '라카 이름을 입력해 주세요.',
              },
              { validator: onCheck, validateTrigger: 'onChange' },
            ]}
            validateTrigger={['onChange']}
          >
            <Input placeholder="라카 이름을 입력해 주세요(10자 이내)." maxLength={10} />
          </Form.Item>
          <Form.Item
            name="max"
            label="라카 수"
            rules={[
              {
                required: true,
                message: '라카 총 개수를 입력해 주세요.',
              },
            ]}
          >
            <Input placeholder="라카 총 개수를 입력해 주세요." maxLength={5} />
          </Form.Item>
          <Form.Item
            name="startNum"
            label="시작 번호"
            rules={[
              {
                required: true,
                message: '라카 시작 번호를 입력해 주세요.',
              },
            ]}
          >
            <Input placeholder="라카 시작 번호를 입력해 주세요." maxLength={5} />
          </Form.Item>
          <Form.Item noStyle>
            <Button type="primary" htmlType="submit" block style={{ borderRadius: 5, height: 40, marginTop: 20 }}>
              다음
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div style={{ display: page === 2 ? 'flex' : 'none', flexDirection: 'column' }}>
        <Form form={form2} layout="vertical" name="addPeriod" initialValues={{ paid: true }} onFinish={onConfirm} onValuesChange={onValuesChange2}>
          <Form.Item
            label="알림 주기"
            name="talk_dday"
            style={{ flex: 1, marginBottom: 0 }}
            rules={[{ required: true, message: '알림 주기를 선택해 주세요!' }]}
          >
            <Checkbox.Group>
              {dday_option.map((item) => (
                <Checkbox value={item.value} disabled={item.value === 3} key={`dday-${item.value}`}>
                  {item.label}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>
          {grade === 0 && (
            <MessageBox>
              <Icon>!</Icon>
              <Message>구독을 통해 다양한 날에 알림톡을 해주세요~!</Message>
            </MessageBox>
          )}
          <Divider />
          <Wrap style={{ marginBottom: 10 }}>
            <Radio.Group defaultValue={1} name="period_type" onChange={(e) => setPeriodType(e.target.value)} value={periodType}>
              <Radio.Button value={1} style={{ marginRight: 10 }}>
                일 단위 계산
              </Radio.Button>
              <Radio.Button value={2}>월 단위 계산</Radio.Button>
            </Radio.Group>
          </Wrap>
          <Wrap style={{ marginBottom: 10, alignItems: 'flex-end' }}>
            <Form.Item label="보증금" name="deposit" style={{ flex: 0.5, marginRight: 5, marginBottom: 0 }}>
              <Input placeholder="보증금 입력" maxLength={9} />
            </Form.Item>
            <Form.Item label="요금" name="charge" style={{ flex: 0.5, marginRight: 5, marginBottom: 0 }}>
              <Input placeholder="요금 입력" maxLength={9} />
            </Form.Item>
            <Form.Item label={`기간(${periodType === 1 ? '일' : '월'})`} name="period" style={{ flex: 1, marginBottom: 0 }}>
              <Input placeholder={`${periodType === 1 ? '일' : '월'} 단위`} maxLength={5} />
            </Form.Item>
            <Button type="primary" style={{ marginLeft: 5, borderRadius: 5 }} onClick={onAddCharge}>
              추가
            </Button>
          </Wrap>
          <Form.Item label={`이용 요금 ${chargeList.length}/6`} style={{ flex: 1, marginLeft: 5 }}>
            <Section>
              {chargeList.map((item, index) => (
                <Box key={index} style={{ borderRadius: 5 }}>
                  <Wrap style={{ justifyContent: 'space-between' }}>
                    <Label>
                      {item.deposit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원 / {item.period}
                      {item.period_type === 1 ? '일' : '개월'} / {item.charge.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                    </Label>
                    <Button type="primary" onClick={() => onDeleteCharge(index)} style={{ borderRadius: 5 }}>
                      <DeleteFilled />
                    </Button>
                  </Wrap>
                </Box>
              ))}
            </Section>
          </Form.Item>

          <Wrap>
            <Button style={{ marginRight: 5, height: 43, borderRadius: 5 }} block onClick={() => setPage(1)}>
              이전
            </Button>
            <Form.Item noStyle>
              <Button style={{ height: 43, borderRadius: 5 }} type="primary" htmlType="submit" block>
                등록하기
              </Button>
            </Form.Item>
          </Wrap>
        </Form>
      </div>
    </Modal>
  );
}

const Section = styled.div``;

const Wrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const Label = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const Box = styled.div`
  padding: 25px;
  background-color: #f5f5f5;
  margin-bottom: 5px;
`;

const MessageBox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;
const Icon = styled.span`
  display: inline-block;
  width: 18px;
  height: 18px;
  line-height: 18px;
  border-radius: 18px;
  background-color: ${ColorGold};
  color: ${ColorWhite};
  text-align: center;
  margin-right: 8px;
  font-size: 12px;
`;
const Message = styled.span`
  color: ${ColorGold};
  font-size: 14px;
`;

export default LockerFormModal;
