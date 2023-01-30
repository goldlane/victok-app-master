import { Button, Form, Modal, Select, DatePicker, Checkbox, Input } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { API } from '../Utils/API';
import axios from 'axios';
import dayjs from 'dayjs';
import moment from 'moment';
const { Option } = Select;

function PeriodEditModal({ visible, setVisible, getData, getData2, getRemainData, lockerTypeInfo, showType, admin }) {
  const [form] = Form.useForm();
  const [lockerPrice, setLockerPrice] = useState([]);
  const [resultPrice, setResultPrice] = useState(0);
  const [resultDeposit, setResultDeposit] = useState(0);

  const onCancel = useCallback(() => {
    form.resetFields();
    setVisible();
    setLockerPrice([]);
    setResultPrice(0);
    setResultDeposit(0);
  }, []);

  const onConfirm = async (values) => {
    if (dayjs().diff(dayjs(values.period.end), 'day') > 0) {
      return Modal.error({
        title: '라커 등록 실패',
        content: '종료일이 현재보다 과거가 될 수 없습니다.',
        okText: '확인',
      });
    } else {
      const formdata = {
        locker_idx: visible.idx,
        end_date: dayjs(values.period.end).format('YYYY-MM-DD'),
        charge: values.price,
        paid: values.paid ? '수납' : '미수납',
        admin: admin ?? false,
      };
      console.log(formdata);
      try {
        const res = await API.put('/locker/locker-extend', formdata);
        Modal.success({
          title: '라카 기간 연장 완료',
          content: '라카 기간 연장이 완료되었습니다.',
          okText: '확인',
          onOk: () => {
            if (showType === 'list') getData();
            else getData2();
            if (getRemainData) getRemainData();
            onCancel();
          },
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response);
          return Modal.error({
            title: '라커 연장 실패',
            content: error.response.data.msg,
            okText: '확인',
          });
        }
      }
    }
  };
  const onFieldsChage = (value) => {
    if ('price' in value) {
      const locker = lockerPrice.find((item) => item.idx === value.price);
      console.log(locker);
      const date = dayjs(form.getFieldValue(['period', 'start']))
        .subtract(1, 'day')
        .add(locker.period, locker.period_type === 1 ? 'day' : 'month')
        .format('YYYY/MM/DD');
      form.setFieldsValue({ period: { end: moment(date, 'YYYY/MM/DD') } });
      setResultPrice(locker.charge);
      setResultDeposit(locker.deposit);
    }
  };

  useEffect(() => {
    if (visible) {
      const chargeList = lockerTypeInfo.find((item) => item.locker_type === visible.locker_type).charge;
      console.log(chargeList);
      setLockerPrice(chargeList);
      form.setFieldsValue({ period: { start: moment(visible.end_date).add(1, 'day') } });
    }
  }, [visible]);

  return (
    <Modal visible={visible} title={'라카 이용자 기간 연장'} onCancel={onCancel} footer={[]} maskClosable={false}>
      <Form form={form} layout="vertical" name="addPeriod" initialValues={{ paid: true }} onFinish={onConfirm} onValuesChange={onFieldsChage}>
        <PrevInfoWrap>
          <PrevInfoTitle>이전 이용 금액</PrevInfoTitle>
          {visible && (
            <PrevInfoBox>{`보증금: ${visible.deposit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원 / 이용 금액: ${visible.locker_charge
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원 / 기간: ${
              visible.period_type === 1 ? visible.period + '일' : visible.period + '개월'
            } `}</PrevInfoBox>
          )}
        </PrevInfoWrap>
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
                  {item.deposit ? item.deposit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0}원 / {item.period}일 /{' '}
                  {item.charge ? item.charge.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0}원
                </Option>
              ) : (
                <Option value={item.idx}>
                  {item.deposit ? item.deposit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0}원 / {item.period}개월 /{' '}
                  {item.charge ? item.charge.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0}원
                </Option>
              )
            )}
          </Select>
        </Form.Item>
        <Wrap>
          <Form.Item name="period" noStyle>
            <Form.Item label="시작일" name={['period', 'start']} style={{ flex: 1, marginRight: 5 }}>
              <DatePicker style={{ width: '100%' }} format={'YYYY/MM/DD'} disabled={true} />
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
            <Checkbox>수납완료</Checkbox>
          </Form.Item>
        </Wrap>

        <Wrap>
          <Button type="primary" htmlType="submit" block style={{ height: 48, borderRadius: 5 }}>
            연장하기
          </Button>
        </Wrap>
      </Form>
    </Modal>
  );
}

const Wrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const PrevInfoWrap = styled.div`
  margin-bottom: 20px;
`;
const PrevInfoTitle = styled.p`
  margin-bottom: 8px;
`;
const PrevInfoBox = styled.div`
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  padding: 4px 11px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  line-height: 1.5715;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
`;

export default PeriodEditModal;
