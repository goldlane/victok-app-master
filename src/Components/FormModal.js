import { Button, Form, Input, Modal, Select, DatePicker, Checkbox } from 'antd';
import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import dayjs from 'dayjs';
import { API } from '../Utils/API';
import axios from 'axios';
const { Option } = Select;
const { TextArea } = Input;

function FormModal({ visible, setVisible, getData, getData2, getRemainData, lockerType, showType, user_idx }) {
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [page, setPage] = useState(1);
  const [selectedLockerType, setSelectedLockerType] = useState();
  const [lockerNumber, setLockerNumber] = useState([]);
  const [lockerPrice, setLockerPrice] = useState([]);
  const [resultPrice, setResultPrice] = useState(0);
  const [resultDeposit, setResultDeposit] = useState(0);
  const timer = useRef();
  const onCancel = useCallback(() => {
    form1.resetFields();
    form2.resetFields();
    setPage(1);
    setSelectedLockerType(false);
    setResultPrice(0);
    setResultDeposit(0);
    setVisible();
  }, []);

  const onNext = useCallback((values) => {
    setPage(2);
  }, []);

  const onConfirm = async (values) => {
    const lockerInfo = form1.getFieldsValue();
    const useInfo = values;
    if (dayjs().diff(dayjs(useInfo.period.end), 'day') > 0) {
      return Modal.error({
        title: '라커 등록 실패',
        content: '종료일이 현재보다 과거가 될 수 없습니다.',
        okText: '확인',
      });
    } else {
      const formdata = {
        customer_name: lockerInfo.name,
        customer_phone: lockerInfo.hp,
        memo: lockerInfo.memo,
        locker_type: lockerType.find((item) => item.idx === lockerInfo.locker_type).locker_type,
        locker_number: lockerInfo.locker_number,
        start_date: dayjs(useInfo.period.start).format('YYYY-MM-DD'),
        end_date: dayjs(useInfo.period.end).format('YYYY-MM-DD'),
        charge: useInfo.price,
        paid: useInfo.paid ? '수납' : '미수납',
        user_idx: user_idx,
      };
      console.log(formdata);
      try {
        const res = await API.post(user_idx ? 'admin/locker' : 'locker/locker', formdata);
        onCancel();
        Modal.success({
          title: '사용자 등록 완료',
          content: '사용자가 등록되었습니다.',
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
          console.log(error.response);
        }
      }
    }
  };

  const onFieldsChage = (value) => {
    if ('price' in value) {
      const locker = lockerPrice.find((item) => item.idx === value.price);
      if (locker.period_type === 1) {
        const date = dayjs(form2.getFieldValue(['period', 'start']))
          .add(locker.period - 1, 'day')
          .format('YYYY/MM/DD');
        form2.setFieldsValue({ period: { end: moment(date, 'YYYY/MM/DD') } });
      } else {
        const date = dayjs(form2.getFieldValue(['period', 'start']))
          .subtract(1, 'day')
          .add(locker.period, 'month')
          .format('YYYY/MM/DD');
        form2.setFieldsValue({ period: { end: moment(date, 'YYYY/MM/DD') } });
      }
      setResultPrice(locker.charge);
      setResultDeposit(locker.deposit);
    }
    if ('period' in value) {
      const price = form2.getFieldValue('price');
      if (price) {
        const locker = lockerPrice.find((item) => item.idx === price);
        if (locker.period_type === 1) {
          const date = dayjs(value.period.start)
            .add(locker.period - 1, 'day')
            .format('YYYY/MM/DD');
          form2.setFieldsValue({ period: { end: moment(date, 'YYYY/MM/DD') } });
        } else {
          const date = dayjs(value.period.start).subtract(1, 'day').add(locker.period, 'month').format('YYYY/MM/DD');
          form2.setFieldsValue({ period: { end: moment(date, 'YYYY/MM/DD') } });
        }
      }
    }
  };

  const checkType = async (value) => {
    if ('locker_type' in value) {
      setSelectedLockerType(false);
      try {
        const res = await API.get('locker/locker-number', { params: { locker_type_idx: value.locker_type } });
        const list = [];
        const lockerInfo = lockerType.find((item) => item.idx === value.locker_type);
        console.log('락커 정보', lockerInfo);
        const checkNum = res.data.lockerNumber;
        for (let i = lockerInfo.start_number; i < lockerInfo.locker_amount + lockerInfo.start_number; i++) {
          if (!checkNum.includes(i)) {
            list.push(i);
          }
        }
        setLockerNumber(list);
        setLockerPrice(lockerInfo.charge);
        setSelectedLockerType(true);
        form1.setFieldsValue({ locker_number: undefined });
      } catch (error) {}
    }
    if ('hp' in value) {
      form1.setFieldsValue({ hp: value.hp.replace(/[^0-9]/g, '') });
      console.log(user_idx);

      const values = form1.getFieldsValue();
      const hp = values.hp;
      const name = values.name;
      if (hp && name) {
        if (timer.current) {
          clearTimeout(timer.current);
        }
        timer.current = setTimeout(() => {
          getMemo(name, hp, user_idx);
        }, 300);
      }
    }
    if ('name' in value) {
      const values = form1.getFieldsValue();
      const hp = values.hp;
      const name = values.name;
      console.log(user_idx);
      if (hp && name) {
        if (timer.current) {
          clearTimeout(timer.current);
        }
        timer.current = setTimeout(() => {
          getMemo(name, hp, user_idx);
        }, 300);
      }
    }
  };

  const prevUser = async () => {
    const lockerInfo = form1.getFieldsValue();
    if (lockerInfo.locker_type && lockerInfo.locker_number) {
      try {
        const res = await API.get('locker/customer-prev', {
          params: { locker_type_idx: lockerInfo.locker_type, locker_number: lockerInfo.locker_number },
        });
        console.log('이전 사용자 데이터터터터터터', res.data);
        const resData = res.data;
        form1.setFieldsValue({ hp: resData.phone, name: resData.name, memo: resData.memo });
      } catch (error) {
        Modal.error({ title: '알림', content: '이전 사용 내역이 없습니다.', okText: '확인' });
      }
    } else {
      Modal.error({ title: '알림', content: '라카 구분과 라카 번호를 선택해 주세요.', okText: '확인' });
    }
  };

  const getMemo = async (name, phone, user_idx) => {
    console.log('유저', user_idx);
    try {
      const res = await API.post(user_idx ? 'admin/customer-memo' : 'locker/customer-memo', { name, phone, user_idx });
      console.log(res.data);
      form1.setFieldsValue({ memo: res.data });
    } catch (error) {
      console.log('해당유저 없음.');
    }
  };

  useEffect(() => {
    if (visible && visible.type) {
      form1.setFieldsValue({ locker_type: visible.type.idx, locker_number: visible.number });
      const check = async () => {
        try {
          const res = await API.get('locker/locker-number', { params: { locker_type_idx: visible.type.idx } });
          const list = [];
          const lockerInfo = lockerType.find((item) => item.idx === visible.type.idx);
          const checkNum = res.data.lockerNumber;
          for (let i = lockerInfo.start_number; i < lockerInfo.locker_amount + lockerInfo.start_number; i++) {
            if (!checkNum.includes(i)) {
              list.push(i);
            }
          }
          setLockerNumber(list);
          setLockerPrice(lockerInfo.charge);
          setSelectedLockerType(true);
        } catch (error) {}
      };
      check();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginRight: '30px' }}>
          <span>라카 이용자 추가({page}/2)</span>
          {page === 1 && <Button onClick={prevUser}>이전 사용자 불러오기</Button>}
        </div>
      }
      onCancel={onCancel}
      footer={[]}
      maskClosable={false}
    >
      <div style={{ display: page === 1 ? 'flex' : 'none', flexDirection: 'column', padding: '5px 15px' }}>
        <Form form={form1} layout="vertical" name="addUser" onFinish={onNext} onValuesChange={checkType}>
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
              {lockerType.map((item) => (
                <Option key={`locker_type-${item.idx}`} value={item.idx}>
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
              다음
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div style={{ display: page === 2 ? 'flex' : 'none', flexDirection: 'column' }}>
        <Form form={form2} layout="vertical" name="addPeriod" initialValues={{ paid: false }} onFinish={onConfirm} onValuesChange={onFieldsChage}>
          <Form.Item
            name="price"
            label="보증금 / 기간 / 금액 선택"
            rules={[
              {
                required: true,
                message: '사용일을 선택해 주세요.',
              },
            ]}
          >
            <Select placeholder="사용일을 선택해 주세요.">
              {lockerPrice.map((item) =>
                item.period_type === 1 ? (
                  <Option value={item.idx}>
                    {item.deposit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원 / {item.period}일 /{' '}
                    {item.charge.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                  </Option>
                ) : (
                  <Option value={item.idx}>
                    {item.deposit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원 / {item.period}개월 /{' '}
                    {item.charge.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                  </Option>
                )
              )}
            </Select>
          </Form.Item>
          <Wrap>
            <Form.Item name="period" noStyle>
              <Form.Item label="시작일" name={['period', 'start']} style={{ flex: 1, marginRight: 5 }} initialValue={moment()}>
                {/* <DatePicker style={{ width: '100%' }} format={'YYYY/MM/DD'} disabledDate={disabledDate} /> */}
                <DatePicker style={{ width: '100%' }} format={'YYYY/MM/DD'} />
              </Form.Item>
              <Form.Item label="종료일" name={['period', 'end']} style={{ flex: 1 }}>
                <DatePicker style={{ width: '100%' }} disabled={true} format={'YYYY/MM/DD'} placeholder="자동 입력" />
              </Form.Item>
            </Form.Item>
          </Wrap>
          <Wrap style={{ justifyContent: 'space-between', backgroundColor: '#F5F5F5', padding: 25, marginBottom: 20, borderRadius: 5 }}>
            <Wrap style={{ fontSize: 16, fontWeight: 'bold' }}>
              이용 금액 : {resultPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원 / 보증금 :{' '}
              {resultDeposit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
            </Wrap>
            <Form.Item name="paid" valuePropName="checked" noStyle>
              <Checkbox>수납 완료</Checkbox>
            </Form.Item>
          </Wrap>

          <Wrap>
            <Button block onClick={() => setPage(1)} style={{ height: 48, marginRight: 5, borderRadius: 5 }}>
              이전
            </Button>

            <Button type="primary" htmlType="submit" block style={{ height: 48, borderRadius: 5 }}>
              등록하기
            </Button>
          </Wrap>
        </Form>
      </div>
    </Modal>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export default FormModal;
