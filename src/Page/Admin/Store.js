import { Table, Input } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ColorMainBlue, ColorWhite } from '../../Utils/Color';
import { API } from '../../Utils/API';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import HeadersAdmin from '../../Components/HeadersAdmin';
import dayjs from 'dayjs';

// 관리자 - 가맹점 현황(가맹점 관리)

function Store() {
  const columns = [
    {
      title: '대표자',
      dataIndex: 'user_name',
      sorter: true,
    },
    {
      title: '휴대폰 번호',
      dataIndex: 'phone',
      sorter: true,
    },
    {
      title: '회원 구분',
      dataIndex: 'grade',
      sorter: true,
      render: (data) => <span>{data === 0 ? '무료' : data === 1 ? ticketName : '-'}</span>,
    },
    {
      title: '이메일',
      dataIndex: 'email',
      sorter: true,
    },
    {
      title: '시설 유형',
      dataIndex: 'type',
      sorter: true,
    },
    {
      title: '시설명',
      dataIndex: 'store_name',
      sorter: true,
    },
    {
      title: '주소',
      dataIndex: 'address1',
      sorter: true,
    },
    {
      title: '상세 주소',
      dataIndex: 'address2',
      sorter: true,
    },
    {
      title: '시설 연락처',
      dataIndex: 'contact',
      sorter: true,
    },
    {
      title: '알림 주기',
      dataIndex: 'dday',
      sorter: false,
      render: (data) => <span>{data ? data : '-'}</span>,
    },
    {
      title: '누적 금액',
      dataIndex: 'amount',
      sorter: true,
      render: (data) => <span>{data ? data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '-'}</span>,
    },
    {
      title: '가입일',
      dataIndex: 'created_time',
      sorter: true,
      render: (data) => <span>{dayjs(data).format('YYYY-MM-DD')}</span>,
    },
  ];
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [amount, setAmount] = useState(10);
  const [sort, setSort] = useState({ column: 'user_idx', order: 'desc' });
  const [ticketName, setTicketName] = useState();
  const [countMembership, setCountMemberhship] = useState();
  const [countFree, setCountFree] = useState();

  const convertColumn = (value) => {
    switch (value) {
      case 'user_name':
        return 'user.name';
      case 'phone':
        return `user.${value}`;
      case 'grade':
        return `user.${value}`;
      case 'email':
        return `user.${value}`;
      case 'store_name':
        return 'store.name';
      case 'amount':
        return 'amount';
      default:
        return `store.${value}`;
    }
  };

  const onChange1 = useCallback((pagination, filters, extra) => {
    setPage(pagination.current);
    if (extra.order) {
      setSort({ column: extra.field, order: extra.order === 'ascend' ? 'asc' : 'desc' });
    } else {
      setSort({ column: 'user_idx', order: 'desc' });
    }
  }, []);

  const getSettingInfo = async () => {
    try {
      const res = await API.get('/admin/payment-setting');
      console.log('이용권 정보', res.data);
      setTicketName(res.data.name);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
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
      const res = await API.get('/admin/store-list', { params: formdata, headers: { Authorization: `Bearer ${token}` } });
      const result = res.data.list.map((item) => ({ ...item, use: item.count > 0 ? 'O' : 'X' }));
      setData(result);
      setTotal(res.data.total);
      setCountMemberhship(res.data.countMembership);
      setCountFree(res.data.countFree);
      console.log('유료 회원 수', res.data.countMembership);
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

  useEffect(() => {
    getSettingInfo();
    console.log('location', location.state);
    if (location.state) {
      setPage(location.state.page);
      setSearch(location.state.search);
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', width: '100vw' }}>
      <HeadersAdmin></HeadersAdmin>
      <Container>
        <Box>
          <Wrap style={{ marginBottom: 30, justifyContent: 'space-between' }}>
            <Wrap>
              <Title>
                가맹점 관리{' '}
                <SubTitle>
                  ( {ticketName} {countMembership}명 / 무료 {countFree}명 )
                </SubTitle>
              </Title>
            </Wrap>

            <Wrap>
              <Input
                style={{ width: 250 }}
                name="search"
                placeholder="이름/연락처/시설명 빠른 검색"
                value={search}
                onChange={onKeyword}
                onSubmit={getData}
              />
            </Wrap>
          </Wrap>
          <Table
            columns={columns}
            dataSource={data}
            onChange={onChange1}
            style={{ borderTop: '2px solid #162D59', cursor: 'pointer' }}
            pagination={{ total: total, pageSize: 10, showSizeChanger: false, current: page }}
            showSorterTooltip={false}
            onRow={(record) => {
              return {
                onClick: () => {
                  navigate('/store', { replace: true, state: { page: page, search: search } });
                  navigate(`/lockersetting-admin/${record.user_idx}`);
                },
              };
            }}
            scroll={{ x: 1900 }}
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

const SubTitle = styled.span`
  color: ${ColorMainBlue};
  font-size: 21px;
  font-weight: 600;
`;

export default Store;
