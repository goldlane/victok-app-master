import { Button, DatePicker, Input, Table, Divider } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ColorBlack, ColorGold, ColorMainBlue, ColorWhite } from '../../Utils/Color';
import { API } from '../../Utils/API';
import axios from 'axios';
import HeadersAdmin from '../../Components/HeadersAdmin';
import payment01 from '../../Assets/images/adm_ico1.png';
import payment02 from '../../Assets/images/adm_ico2.png';
import payment03 from '../../Assets/images/adm_ico3.png';
import payment04 from '../../Assets/images/adm_ico4.png';
import PaymentSettingModal from 'Components/PaymentSettingModal';
import RefundModal from 'Components/RefundModal';
import ExcelButtonAdmin from 'Components/ExcelButtonAdmin';
import dayjs from 'dayjs';

// 관리자 - 결제 내역

function PaymentHistory() {
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sumData, setSumData] = useState();
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [totalData, setTotalData] = useState();
  const [paymentList, setPaymentList] = useState();
  const [calculatedAmount, setCalculatedAmount] = useState();
  const [selectedIdx, setSelectedIdx] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [keyword, setKeyword] = useState();

  const initial = {
    storeType: 'initial',
    storeName: 'initial',
    userName: 'initial',
    paid_time: 'initial',
    data: 'initial',
    paymentAmount: 'initial',
    talkCount: 'initial',
    refundAmount: 'initial',
    refundMemo: 'initial',
    paymentIdx: 'initial',
  };

  const columns = [
    {
      title: '시설 유형',
      dataIndex: 'storeType',
      render: (data) => (data === 'initial' ? <span>합계</span> : data),
    },
    {
      title: '시설명',
      dataIndex: 'storeName',
      render: (data) => (data === 'initial' ? <span></span> : data),
    },
    {
      title: '대표명',
      dataIndex: 'userName',
      render: (data) => (data === 'initial' ? <span></span> : data),
    },
    {
      title: '결제 일자',
      dataIndex: 'paid_time',
      render: (data) => (data === 'initial' ? <span>-</span> : <span>{dayjs(data).format('YYYY-MM-DD')}</span>),
    },
    {
      title: '결제 수단',
      dataIndex: 'data',
      render: (data) => (data === 'initial' ? <span>-</span> : <span>카드</span>),
    },
    {
      title: '결제 금액',
      dataIndex: 'paymentAmount',
      render: (data) =>
        data === 'initial' ? (
          <span>{sumData && sumData.totalAmount ? sumData.totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '-'}</span>
        ) : (
          <span>{data ? data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '-'}</span>
        ),
    },
    {
      title: '알림톡 건수',
      dataIndex: 'talkCount',
      render: (data) =>
        data === 'initial' ? (
          <span>{sumData && sumData.totalTalk ? sumData.totalTalk.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '-'}</span>
        ) : (
          <span>{data ? data : '-'}</span>
        ),
    },
    {
      title: '취소/환불 금액',
      dataIndex: 'refundAmount',
      render: (data) =>
        data === 'initial' ? (
          <span>{sumData && sumData.totalRefund ? sumData.totalRefund.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '-'}</span>
        ) : (
          <span>{data ? data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '-'}</span>
        ),
    },

    {
      title: '취소/환불 내역',
      dataIndex: 'refundMemo',
      render: (data) => (data === 'initial' ? <span>-</span> : <span>{data ? data : '-'}</span>),
    },
    {
      title: '관리',
      dataIndex: 'paymentIdx',
      render: (data, row) =>
        data === 'initial' ? (
          <span>-</span>
        ) : (
          <Button
            onClick={() => {
              setSelectedIdx(data);
              setVisible2(true);
            }}
            // disabled={row.refundAmount}
            type="primary"
          >
            취소
          </Button>
        ),
    },
  ];

  const onChange = useCallback((pagination, filters, extra) => {
    setPage(pagination.current);
  }, []);

  const onChangeStartDate = (date, dateString) => {
    console.log(date, dateString);
    setStartDate(dateString);
  };
  const onChangeEndDate = (date, dateString) => {
    console.log(date, dateString);
    setEndDate(dateString);
  };

  const getPaymentData = async () => {
    try {
      let formdata = {};
      if (startDate && endDate) {
        formdata = {
          start_date: startDate,
          end_date: endDate,
          keyword: keyword,
          page: page,
        };
      } else {
        formdata = {
          start_date: undefined,
          end_date: undefined,
          keyword: keyword,
          page: page,
        };
      }

      const token = sessionStorage.getItem('token');
      const res = await API.get('/admin/payment', { params: formdata, headers: { Authorization: `Bearer ${token}` } });
      console.log('데이터어어어엉', res.data);
      setTotalData(res.data.totalData);
      setPaymentList(res.data.paymentList);
      setTotal(res.data.total);
      setSumData(res.data.sumData);
      setCalculatedAmount(Number(res.data.totalData.totalAmount) - Number(res.data.totalData.totalRefund));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      return getPaymentData();
    }, 300);
    return () => clearTimeout(debounce);
  }, [keyword, page]);

  useEffect(() => {
    if (!startDate) {
      setEndDate('');
    }
  }, [startDate]);

  return (
    <Div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
      <HeadersAdmin></HeadersAdmin>
      <Container>
        <Box>
          <TitleWrap>
            <Title>결제 현황</Title>
            <Button onClick={() => setVisible(true)}>이용권 정보 설정</Button>
          </TitleWrap>
          <BoxWrap>
            <Group>
              <GrayBox>
                <InnerWrap>
                  <Image src={payment01} />
                  <TextWrap>
                    <p style={{ margin: 0, color: '#3958E5', fontSize: '16px', fontWeight: 'bold' }}>결제 금액</p>
                    <p style={{ fontSize: '22px', color: ColorBlack, fontWeight: 'bold', margin: 0 }}>
                      {totalData && totalData.totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 원
                    </p>
                  </TextWrap>
                </InnerWrap>
              </GrayBox>

              <GrayBox>
                <InnerWrap>
                  <Image src={payment02} />
                  <TextWrap>
                    <p style={{ margin: 0, color: '#27B9A9', fontSize: '16px', fontWeight: 'bold' }}>결제 건수</p>
                    <p style={{ fontSize: '22px', color: ColorBlack, fontWeight: 'bold', margin: 0 }}>
                      {totalData && totalData.totalCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 건
                    </p>
                  </TextWrap>
                </InnerWrap>
              </GrayBox>
            </Group>

            <Group>
              <GrayBox>
                <InnerWrap>
                  <Image src={payment03} />
                  <TextWrap>
                    <p style={{ margin: 0, color: '#D7A35F', fontSize: '16px', fontWeight: 'bold' }}>취소/환불 금액</p>
                    <p style={{ fontSize: '22px', color: ColorBlack, fontWeight: 'bold', margin: 0 }}>
                      {totalData && totalData.totalRefund.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 원
                    </p>
                  </TextWrap>
                </InnerWrap>
              </GrayBox>
              <GrayBox style={{ marginRight: 0 }}>
                <InnerWrap>
                  <Image src={payment04} />
                  <TextWrap>
                    <p style={{ margin: 0, color: '#162D59', fontSize: '16px', fontWeight: 'bold' }}>정산 금액</p>
                    <p style={{ fontSize: '22px', color: ColorBlack, fontWeight: 'bold', margin: 0 }}>
                      {calculatedAmount && calculatedAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 원
                    </p>
                  </TextWrap>
                </InnerWrap>
              </GrayBox>
            </Group>
          </BoxWrap>
          <Divider />
          <TitleWrap>
            <Title2>결제 내역</Title2>
          </TitleWrap>
          <Div style={{ display: 'flex', marginBottom: 30, justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Div style={{ marginRight: '10px' }}>
              <DatePicker onChange={onChangeStartDate} style={{ width: '160px' }} format={'YYYY-MM-DD'} />
              <span style={{ margin: '0 5px' }}>~</span>
              <DatePicker onChange={onChangeEndDate} style={{ width: '160px' }} format={'YYYY-MM-DD'} disabled={!startDate} />
              <Button onClick={getPaymentData} style={{ marginLeft: '10px' }}>
                검색
              </Button>
            </Div>
            <ResDiv>
              <ExcelButtonAdmin start_date={startDate} end_date={endDate} keyword={keyword} />
              <Input
                value={keyword}
                onChange={(e) => {
                  setPage(1);
                  setKeyword(e.target.value);
                }}
                style={{ width: '220px' }}
                placeholder="시설명/대표명 빠른 검색"
              />
            </ResDiv>
          </Div>
          <ResultText>
            검색 결과 <NumberText>{total}건</NumberText>입니다.
          </ResultText>
          {paymentList && (
            <Table
              columns={columns}
              dataSource={[initial, ...paymentList]}
              onChange={onChange}
              style={{ borderTop: '2px solid #162D59', marginBottom: '25px' }}
              pagination={{ total: total, pageSize: 10, showSizeChanger: false }}
              showSizeChanger={false}
              showSorterTooltip={false}
              rowClassName={(record) => (record.data === 'initial' ? 'skyblue' : 'white')}
              scroll={{ x: 1400 }}
            />
          )}
        </Box>
      </Container>
      <PaymentSettingModal visible={visible} setVisible={setVisible} />
      <RefundModal selectedIdx={selectedIdx} visible2={visible2} setVisible2={setVisible2} getPaymentData={getPaymentData} />
    </Div>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  background-color: ${ColorWhite};
`;

const Group = styled.div`
  flex: 1;
  display: flex;
  min-width: 600px;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 50px 80px;
  background-color: ${ColorWhite};
`;

const Title = styled.div`
  color: ${ColorMainBlue};
  font-size: 24px;
  font-weight: bold;
  margin-right: 20px;
`;

const Div = styled.div``;
const ResDiv = styled.div`
  @media screen and (max-width: 1151px) {
    margin-top: 20px;
  }
`;

const ResultText = styled.p`
  font-size: 15px;
  font-weight: 500;
  color: ${ColorBlack};
`;
const NumberText = styled.span`
  color: ${ColorGold};
`;

const BoxWrap = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;
const GrayBox = styled.div`
  display: flex;
  flex: 1;
  border: 1px solid #e3e3e3;
  border-radius: 10px;
  align-items: center;
  padding: 30px 19px;

  @media screen and (max-width: 1589px) {
    margin-right: 10px;
    margin-bottom: 10px;
    &:last-child {
      margin-right: 0px;
      margin-bottom: 10px;
    }
  }
  @media screen and (min-width: 1590px) {
    margin-right: 10px;
  }
`;

const InnerWrap = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const Image = styled.img`
  width: 65px;
  height: 65px;
  margin-right: 16px;
`;

const TextWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleWrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Title2 = styled.div`
  color: ${ColorMainBlue};
  font-size: 24px;
  font-weight: bold;
  margin-right: 20px;
  margin-top: 10px;
`;

export default PaymentHistory;
