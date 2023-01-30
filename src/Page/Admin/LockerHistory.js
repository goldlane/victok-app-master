import { Table, Input } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ColorMainBlue, ColorWhite } from '../../Utils/Color';
import { API } from '../../Utils/API';
import axios from 'axios';
import HeadersAdmin from '../../Components/HeadersAdmin';

// 관리자 - 라커 관리 내역

const columns = [
  {
    title: '처리 내용',
    dataIndex: 'type',
    sorter: true,
  },
  {
    title: '처리일',
    dataIndex: 'handled_time',
    sorter: true,
  },
  {
    title: '시설 유형',
    dataIndex: 'store_type',
    sorter: true,
  },
  {
    title: '시설명',
    dataIndex: 'store_name',
    sorter: true,
  },
  {
    title: '회원 이름',
    dataIndex: 'customer_name',
    sorter: true,
  },
  {
    title: '휴대폰 번호',
    dataIndex: 'customer_phone',
    sorter: true,
  },
  {
    title: '라카 구분',
    dataIndex: 'locker_type',
    sorter: true,
  },
  {
    title: '라카 번호',
    dataIndex: 'locker_number',
    sorter: true,
  },
  {
    title: '금액',
    dataIndex: 'charge',
    sorter: true,
  },
  {
    title: '시작일',
    dataIndex: 'start_date',
    sorter: true,
  },
  {
    title: '종료일',
    dataIndex: 'end_date',
    sorter: true,
  },
];
function LockerHistory() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [amount, setAmount] = useState(10);
  const [sort, setSort] = useState({ column: 'handled_time', order: 'desc' });

  const onChange1 = useCallback((pagination, filters, extra) => {
    setPage(pagination.current);
    if (extra.order) {
      setSort({ column: extra.field, order: extra.order === 'ascend' ? 'asc' : 'desc' });
    } else {
      setSort({ column: 'handled_time', order: 'desc' });
    }
  }, []);

  const convertColumn = (value) => {
    switch (value) {
      case 'customer_name':
        return 'customer.name';
      case 'customer_phone':
        return 'customer.phone';
      case 'store_type':
        return 'store.type';
      case 'store_name':
        return 'store.name';
      default:
        return `locker_log.${value}`;
    }
  };

  const getData = async () => {
    try {
      const formdata = {
        column: convertColumn(sort.column),
        order: sort.order,
        keyword: search,
        page: page,
        amount: amount,
      };
      const token = sessionStorage.getItem('token');
      const res = await API.get('/admin/locker-log', { params: formdata, headers: { Authorization: `Bearer ${token}` } });
      const result = res.data.list.map((item) => ({
        ...item,
        charge: item.charge.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      }));
      setData(result);
      setTotal(res.data.total);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  const onKeyword = (e) => {
    setPage(1);
    setSearch(e.target.value);
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      return getData();
    }, 300);
    return () => clearTimeout(debounce);
  }, [page, amount, search, sort]);

  return (
    <div style={{ display: 'flex', flex: 1 }}>
      <HeadersAdmin></HeadersAdmin>
      <Container>
        <Box>
          <Wrap style={{ marginBottom: 30, justifyContent: 'space-between' }}>
            <Title>라카 관리 내역</Title>
            <Input
              style={{ width: 250 }}
              name="search"
              placeholder="이름/연락처/시설명 빠른 검색"
              value={search}
              onChange={onKeyword}
              onSubmit={getData}
            />
          </Wrap>
          <Table
            columns={columns}
            dataSource={data}
            onChange={onChange1}
            style={{ borderTop: '2px solid #162D59' }}
            pagination={{ total: total, pageSize: 10, showSizeChanger: false }}
            showSizeChanger={false}
            showSorterTooltip={false}
            scroll={{ x: 1600 }}
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
