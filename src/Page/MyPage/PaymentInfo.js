import React, { useState, useEffect } from 'react';
import { Button, DatePicker, Modal, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { API } from '../../Utils/API';
import { ColorBlack, ColorMainBlue, ColorWhite } from '../../Utils/Color';
import dayjs from 'dayjs';

// 설정 - 결제 정보

function PaymentInfo() {
  const navigate = useNavigate();
  const today = new Date();

  const paymentHistoryCol = [
    {
      title: '빅톡 이용권',
      dataIndex: 'payment_name',
    },
    {
      title: '이용 기간',
      dataIndex: 'start_date',
      width: '100px',
      render: (data, row) => (
        <span>
          {dayjs(data).format('YYYY.MM.DD')}~{'\n'}
          {dayjs(row.end_date).format('YYYY.MM.DD')}
        </span>
      ),
    },
    {
      title: '거래 일시',
      dataIndex: 'paid_time',
      width: '120px',
      render: (data) => <span>{dayjs(data).format('YYYY.MM.DD HH:mm:ss')}</span>,
    },
    {
      title: '결제 수단',
      render: () => <span>카드</span>,
    },
    {
      title: '결제 금액',
      dataIndex: 'amount',
      render: (data) => <span>{data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>,
    },
    {
      title: '영수증',
      dataIndex: 'receipt_url',
      width: '90px',
      render: (data) => (
        <ReceiptButton href={data} target="_blank">
          영수증
        </ReceiptButton>
      ),
    },
    {
      title: '상태',
      dataIndex: 'refund_idx',
      width: '75px',
      render: (data) => <span>{data ? '취소됨' : '이용중'}</span>,
    },
  ];

  const availableTicketListCol = [
    {
      title: 'No.',
      dataIndex: 'payment_name',
      width: '50px',
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '빅톡 이용권',
      dataIndex: 'payment_name',
    },
    {
      title: '이용 기간',
      dataIndex: 'start_date',
      render: (data, row) => (
        <span>
          {dayjs(data).format('YYYY.MM.DD')}~{'\n'}
          {dayjs(row.end_date).format('YYYY.MM.DD')}
        </span>
      ),
    },
    {
      title: '다음 결제 가능일',
      dataIndex: 'end_date',
      render: (data) => (
        <span>
          {dayjs(data).subtract(1, 'month').format('YYYY.MM.DD')}~{'\n'}
          {dayjs(data).format('YYYY.MM.DD')}
        </span>
      ),
    },
    {
      title: '관리',
      dataIndex: 'end_date',
      render: (data, row) => (
        <Button
          onClick={() => {
            if (dayjs(data).subtract(1, 'month').diff(dayjs(today).format('YYYY-MM-DD'), 'day') > 0) {
              Modal.error({ title: '알림', content: '결제 가능일이 아닙니다.', okText: '확인' });
            } else {
              navigate(`/payment/1`);
            }
          }}
        >
          결제
        </Button>
      ),
    },
  ];

  const [paymentHistory, setPaymentHistory] = useState([]);
  const [availableTicketList, setAvailableTicketList] = useState([]);
  const [tab, setTab] = useState(1);
  const [refundPolicy, setRefundPolicy] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const onChangeStartDate = (date, dateString) => {
    console.log(date, dateString);
    setStartDate(dateString);
  };
  const onChangeEndDate = (date, dateString) => {
    console.log(date, dateString);
    setEndDate(dateString);
  };

  const getPaymentHistory = async () => {
    try {
      const formdata = {
        start_date: startDate,
        end_date: endDate,
      };
      const token = sessionStorage.getItem('token');
      const res = await API.get('/payment/payment', { params: formdata, headers: { Authorization: `Bearer ${token}` } });
      setPaymentHistory(res.data);
      console.log('결제 내역', res.data);
    } catch {}
  };

  const setAvailableTicket = async () => {
    try {
      const formdata = {
        start_date: null,
        end_date: null,
      };
      const token = sessionStorage.getItem('token');
      const res = await API.get('/payment/payment', { params: formdata, headers: { Authorization: `Bearer ${token}` } });

      const available = res.data.filter((item) => {
        if (!item.refund_idx) {
          const start = dayjs().diff(dayjs(item.start_date), 'day');
          const end = dayjs(item.end_date).diff(dayjs(), 'day');
          console.log(start, end);
          if (start >= 0 && end >= 0) return item;
        }
      });
      console.log('available', available);
      setAvailableTicketList(available);
    } catch {}
  };

  const getPolicy = async () => {
    try {
      const res = await API.get('/user/terms');
      setRefundPolicy(res.data[0].refund_policy);
    } catch {}
  };

  useEffect(() => {
    getPaymentHistory();
    setAvailableTicket();
    getPolicy();
  }, []);

  useEffect(() => {
    if (!startDate) {
      setEndDate('');
    }
  }, [startDate]);

  return (
    <Box>
      <Title>이용권 사용 내역</Title>
      <TabButtonWrap>
        <Button
          onClick={() => {
            setTab(1);
          }}
          type={tab === 1 ? 'primary' : null}
          style={{ marginRight: '5px', fontSize: '15px' }}
        >
          보유 현황
        </Button>
        <Button
          onClick={() => {
            setTab(2);
          }}
          type={tab === 2 ? 'primary' : null}
          style={{ fontSize: '15px' }}
        >
          결제 내역
        </Button>
        <ButtonBox onClick={() => navigate('/membershipinfo')} style={{ height: '32px', borderColor: ColorMainBlue, marginLeft: '10px' }}>
          <ButtonText style={{ color: ColorMainBlue, fontWeight: 500, lineHeight: '32px' }}>상품 정보 보러가기</ButtonText>
        </ButtonBox>
      </TabButtonWrap>
      {tab === 1 ? (
        <>
          <CountText>총 {availableTicketList.length}개</CountText>
          <Table
            columns={availableTicketListCol}
            dataSource={availableTicketList}
            style={{ borderTop: '2px solid #162D59' }}
            showSorterTooltip={false}
            pagination={false}
            locale={{
              emptyText: (
                <EmptyTextWrap>
                  <EmptyText>현재 무료 버전을 이용하고 계십니다.</EmptyText>
                  <EmptyText>이용권을 구매하시면 더 많은 서비스를 이용하실 수 있습니다.</EmptyText>
                  <ButtonWrap>
                    <ButtonBox
                      onClick={() => {
                        navigate(`/membershipinfo`);
                      }}
                      style={{ borderColor: ColorMainBlue, backgroundColor: ColorMainBlue }}
                    >
                      <ButtonText style={{ color: ColorWhite, fontWeight: 400 }}>빅톡 이용권 구매하기</ButtonText>
                    </ButtonBox>
                  </ButtonWrap>
                </EmptyTextWrap>
              ),
            }}
          />
        </>
      ) : (
        <>
          <DatePickerWrap>
            <DatePickerTitle>조회 기간</DatePickerTitle>
            <Div>
              <DatePicker onChange={onChangeStartDate} style={{ width: '160px' }} format={'YYYY'} picker="year" />
              <span style={{ margin: '0 5px' }}>~</span>
              <DatePicker onChange={onChangeEndDate} style={{ width: '160px' }} format={'YYYY'} disabled={!startDate} picker="year" />
              <Button onClick={getPaymentHistory} style={{ marginLeft: '10px' }}>
                검색
              </Button>
            </Div>
          </DatePickerWrap>
          <Table
            columns={paymentHistoryCol}
            dataSource={paymentHistory}
            style={{ borderTop: '2px solid #162D59' }}
            pagination={false}
            showSorterTooltip={false}
            rowClassName={(record) => (record.refund_idx ? 'grey' : 'white')}
          />
        </>
      )}
      <RefundPolicyLink href={refundPolicy} target="_blank">
        취소·환불 정책
      </RefundPolicyLink>
    </Box>
  );
}

const Box = styled.div`
  display: flex;
  flex-direction: column;
  margin: 50px 0;
  background-color: ${ColorWhite};
  border-radius: 10px;
  margin-top: 10px;
`;

const Title = styled.p`
  font-size: 20px;
  font-weight: 600;
`;

const TabButtonWrap = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
`;

const ButtonBox = styled.div`
  cursor: pointer;
  &:hover {
    filter: brightness(0.9);
  }
  padding: 0 15px 0 15px;
  border: 1px solid #ccc;
  height: 37px;
  border-radius: 4px;
  margin-right: 15px;
  transition: 0.3 ease;
`;

const ButtonText = styled.p`
  font-size: 14px;
  font-weight: 300;
  color: ${ColorMainBlue};
  transition: 0.3s ease;
  line-height: 37px;
  text-align: center;
  color: #ccc;
`;

const RefundPolicyLink = styled.a`
  color: #bebebe;
  text-decoration: underline;
  text-align: right;
  margin-top: 5px;
`;

const CountText = styled.p`
  font-size: 15px;
  color: ${ColorBlack};
  margin-top: 20px;
  margin-bottom: 10px;
`;

const Div = styled.div``;

const DatePickerWrap = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
`;

const DatePickerTitle = styled.span`
  margin-right: 10px;
`;

const ReceiptButton = styled.a`
  background-color: ${ColorMainBlue};
  font-size: 13px;
  color: ${ColorWhite};
  padding: 6px 10px;
  border-radius: 3px;

  &:hover {
    color: ${ColorWhite};
  }
`;

const EmptyTextWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0;
`;

const EmptyText = styled.p`
  margin: 0;
  color: ${ColorBlack};
`;

const ButtonWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 20px 0;
`;

export default PaymentInfo;
