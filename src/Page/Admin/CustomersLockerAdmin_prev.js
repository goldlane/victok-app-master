import { Button, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ColorMainBlue, ColorWhite } from '../../Utils/Color';
import { API } from '../../Utils/API';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import HeadersAdmin from '../../Components/HeadersAdmin';

// 관리자 - 이용자 현황 상세

function CustomersLockerAdmin() {
  const columns = [
    {
      title: '회원 이름',
      dataIndex: 'customer_name',
    },
    {
      title: '휴대폰 번호',
      dataIndex: 'phone',
    },
    {
      title: '시설 구분',
      dataIndex: 'type',
    },
    {
      title: '시설명',
      dataIndex: 'store_name',
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
      title: '금액',
      dataIndex: 'charge',
    },
    {
      title: '수납 여부',
      dataIndex: 'paid',
    },
    {
      title: '시작일',
      dataIndex: 'start_date',
    },
    {
      title: '종료일',
      dataIndex: 'end_date',
    },
    {
      title: '사용 기간',
      dataIndex: 'used',
    },

    {
      title: '남은 기간',
      dataIndex: 'remain',
    },
  ];
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [customerName, setCustomerName] = useState('');
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const onChange = useCallback((pagination, filters, extra) => {
    setPage(pagination.current);
  }, []);

  const getData = async () => {
    try {
      const formdata = {
        customer_idx: id,
        page: String(page),
        amount: '10',
      };
      const token = sessionStorage.getItem('token');
      const res = await API.get('/admin/customer-locker-list', { params: formdata, headers: { Authorization: `Bearer ${token}` } });
      const result = res.data.list.map((item) => ({
        ...item,
        charge: item.charge.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      }));
      setData(result);
      setTotal(res.data.total);
      setCustomerName(res.data.customerName);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  useEffect(() => {
    getData();
  }, [id, page]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <HeadersAdmin></HeadersAdmin>
      <Container>
        <Box>
          <Wrap style={{ marginBottom: 30, justifyContent: 'space-between' }}>
            <Title>{customerName} - 라카 상세</Title>
            <Button onClick={() => navigate(-1)}>목록</Button>
          </Wrap>
          <Table
            current={page}
            columns={columns}
            dataSource={data}
            onChange={onChange}
            style={{ borderTop: '2px solid #162D59' }}
            pagination={{ total: total, pageSize: 10, showSizeChanger: false }}
            showSorterTooltip={false}
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

  align-items: center;
`;

const Box = styled.div`
  display: flex;
  width: 1400px;
  min-width: 1000px;
  flex-direction: column;
  margin-top: 70px;
  margin-bottom: 10px;
  padding: 35px 80px;
  background-color: ${ColorWhite};
  & + & {
    margin-top: 10px;
    margin-bottom: 70px;
  }
  border-radius: 10px;
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

export default CustomersLockerAdmin;
