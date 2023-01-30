import { Table, Input } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ColorMainBlue, ColorWhite } from '../../Utils/Color';
import { API } from '../../Utils/API';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HeadersAdmin from '../../Components/HeadersAdmin';
import { useLocation } from 'react-router';

// 관리자 - 전체 회원

function AllCustomers() {
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [amount, setAmount] = useState(10);

  const columns = [
    {
      title: '회원 이름',
      dataIndex: 'name',
    },
    {
      title: '휴대폰 번호',
      dataIndex: 'phone',
    },
    {
      title: '라카 사용 유무',
      dataIndex: 'locker',
      render: (data) => <span>{data > 0 ? 'O' : 'X'}</span>,
    },
    {
      title: '이용중인 라카 수',
      dataIndex: 'locker',
    },
    {
      title: '지공차트 유무',
      dataIndex: 'drilling_chart',
      render: (data) => <span>{data > 0 ? 'O' : 'X'}</span>,
    },
    {
      title: '이용 시설',
      dataIndex: 'store',
    },
  ];

  const onChange = useCallback((pagination, filters, extra) => {
    setPage(pagination.current);
  }, []);

  const getData = async () => {
    try {
      const formdata = {
        keyword: search,
        page: page,
        amount: amount,
      };
      const token = sessionStorage.getItem('token');
      const res = await API.get('/admin/customer-list', { params: formdata, headers: { Authorization: `Bearer ${token}` } });
      setData(res.data.list);
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
  }, [page, amount, search]);

  useEffect(() => {
    if (location.state) {
      setPage(location.state.page);
      setSearch(location.state.search);
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <HeadersAdmin></HeadersAdmin>
      <Container>
        <Box>
          <Wrap style={{ marginBottom: 30, justifyContent: 'space-between' }}>
            <Wrap>
              <Title>회원 현황</Title>
            </Wrap>
            <Wrap>
              <Input
                style={{ width: 250, marginLeft: '5px' }}
                name="search"
                placeholder="이름/연락처 빠른 검색"
                value={search}
                onChange={onKeyword}
                onSubmit={getData}
              />
            </Wrap>
          </Wrap>
          <Table
            columns={columns}
            dataSource={data}
            onChange={onChange}
            style={{ borderTop: '2px solid #162D59', cursor: 'pointer' }}
            pagination={{ total: total, pageSize: 10, showSizeChanger: false, current: page }}
            showSorterTooltip={false}
            onRow={(record) => {
              return {
                onClick: () => {
                  navigate('/allcustomers', { replace: true, state: { page: page, search: search } });
                  navigate(`/allcustomerslocker/${record.name}/${record.phone}`);
                },
              };
            }}
            scroll={{ x: 1200 }}
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

export default AllCustomers;
