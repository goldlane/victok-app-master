import { Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ColorMainBlue, ColorWhite } from '../../Utils/Color';
import { API } from '../../Utils/API';
import axios from 'axios';
import HeadersAdmin from '../../Components/HeadersAdmin';

// 관리자 - 알림톡 내역

const columns = [
  {
    title: '구분',
    dataIndex: 'type',
  },
  {
    title: '시설명',
    dataIndex: 'store_name',
  },
  {
    title: '고객명',
    dataIndex: 'customer_name',
  },
  {
    title: '휴대폰 번호',
    dataIndex: 'customer_phone',
  },
  {
    title: '라카 구분',
    dataIndex: 'locker_type',
  },
  {
    title: '라카 번호',
    dataIndex: 'locker_number',
  },
  {
    title: '만료일',
    dataIndex: 'end_date',
  },
  {
    title: '발송일',
    dataIndex: 'created_time',
  },
];
function LockerHistory() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [amount, setAmount] = useState(10);

  const onChange = useCallback((pagination, filters, extra) => {
    setPage(pagination.current);
  }, []);

  const getData = async () => {
    try {
      const formdata = {
        page: page,
        amount: amount,
      };
      const token = sessionStorage.getItem('token');
      const res = await API.get('/admin/talk-log', { params: formdata, headers: { Authorization: `Bearer ${token}` } });
      const result = res.data.list;
      setData(result);
      setTotal(res.data.total);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      return getData();
    }, 300);
    return () => clearTimeout(debounce);
  }, [page, amount, search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
      <HeadersAdmin></HeadersAdmin>
      <Container>
        <Box>
          <Wrap style={{ marginBottom: 30, justifyContent: 'space-between' }}>
            <Wrap>
              <Title>알림톡 내역</Title>
            </Wrap>
          </Wrap>
          <Table
            columns={columns}
            dataSource={data}
            onChange={onChange}
            style={{ borderTop: '2px solid #162D59' }}
            pagination={{ total: total, pageSize: 10, showSizeChanger: false }}
            showSizeChanger={false}
            showSorterTooltip={false}
            scroll={{ x: 1300 }}
          />
        </Box>
      </Container>
    </div>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  background-color: ${ColorWhite};
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 50px 80px;
  background-color: ${ColorWhite};
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Title = styled.div`
  color: ${ColorMainBlue};
  font-size: 24px;
  font-weight: bold;
`;

export default LockerHistory;
