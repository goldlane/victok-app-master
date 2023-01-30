import { Button, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ColorMainBlue, ColorWhite } from '../../Utils/Color';
import { API } from '../../Utils/API';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import HeadersAdmin from '../../Components/HeadersAdmin';
import dayjs from 'dayjs';

// 관리자 - 전체 회원 상세

function AllCustomersLocker() {
  const { id, name, phone } = useParams();
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [total, setTotal] = useState();
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState(1);
  const [sort, setSort] = useState({ column: 'none', order: '' });

  const navigate = useNavigate();

  const columns = [
    {
      title: '회원 이름',
      dataIndex: 'customer_name',
      // sorter: true,
    },
    {
      title: '휴대폰 번호',
      dataIndex: 'phone',
      // sorter: true,
    },
    {
      title: '시설 구분',
      dataIndex: 'type',
      sorter: true,
    },
    {
      title: '시설명',
      dataIndex: 'store_name',
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
      title: '기간',
      dataIndex: 'period',
    },
    {
      title: '보증금',
      dataIndex: 'deposit',
      sorter: true,
    },
    {
      title: '수납 여부',
      dataIndex: 'paid',
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
    {
      title: '사용 기간',
      dataIndex: 'used',
      sorter: true,
    },

    {
      title: '남은 기간',
      dataIndex: 'remain',
      sorter: true,
      render: (text, row) => <span>{Number(text) < 0 ? 0 : row.deleted_time ? 0 : text}</span>,
    },
    {
      title: '상태',
      dataIndex: 'remain',
      sorter: true,

      render: (text, row) => <span>{row.deleted_time ? '삭제됨' : row.remain < 0 ? '만료됨' : '-'}</span>,
    },
  ];

  const columns2 = [
    {
      title: '날짜',
      width: '150px',
      dataIndex: 'updated_time',
      render: (data) => <span>{dayjs(data).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '제목',
      width: '160px',
      dataIndex: 'chart_name',
    },
    {
      title: '공이름',
      dataIndex: 'ball_name',
    },
    {
      title: '무게(lbs)',
      width: '120px',
      dataIndex: 'weight',
      render: (data) => <span>{`${data} lbs`}</span>,
    },
    {
      title: '레이아웃',
      dataIndex: 'layout',
      render: (data, row) => <span>{`${data ? data : '-'} / ${row.pin === 'up' ? '핀업' : '핀다운'}`}</span>,
    },
    {
      title: '시설 구분',
      width: '130px',
      dataIndex: 'type',
    },
    {
      title: '시설명',
      width: '180px',
      dataIndex: 'name',
    },
    {
      title: '지공사',
      dataIndex: 'driller',
    },
    {
      title: '상담 내용',
      dataIndex: 'memo',
      render: (data) => (
        <div style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{data ? data : '-'}</div>
      ),
    },
  ];

  const onChange = useCallback((pagination, filters, extra) => {
    setPage(pagination.current);
    if (extra.order) {
      setSort({ column: extra.field, order: extra.order === 'ascend' ? 'asc' : 'desc' });
    } else {
      setSort({ column: 'none', order: '' });
    }
  }, []);

  const convertColumn = (value) => {
    switch (value) {
      case 'customer_idx':
        return 'customer.idx';
      case 'customer_name':
        return 'customer.name';
      case 'phone':
        return `customer.${value}`;
      case 'type':
        return `store.${value}`;
      case 'store_name':
        return 'store.name';
      case 'charge':
        return `charge.${value}`;
      case 'deposit':
        return `charge.${value}`;
      case 'none':
        return `none`;
      default:
        return `locker.${value}`;
    }
  };

  const getData = async () => {
    try {
      const formdata = {
        column: convertColumn(sort.column),
        order: sort.order,
        name: name,
        phone: phone,
      };
      const token = sessionStorage.getItem('token');
      const res = await API.get('/admin/all-customer-locker-list', { params: formdata, headers: { Authorization: `Bearer ${token}` } });
      const result = res.data.map((item) => ({
        ...item,
        charge: item.charge.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        period: item.period_type === 1 ? item.period + '일' : item.period + '개월',
        deposit: item.deposit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      }));
      setData(result);
      setTotal(res.data.total);
      console.log('라커데이터', res.data);
    } catch (error) {
      console.log('실패', error);
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  const getDrillingChartData = async () => {
    try {
      const formdata = {
        name: name,
        phone: phone,
      };
      const token = sessionStorage.getItem('token');
      const res = await API.get('/admin/drilling-chart-list', { params: formdata, headers: { Authorization: `Bearer ${token}` } });
      const data = res.data;
      console.log('지공차트 데이터', data);
      setData2(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  useEffect(() => {
    getDrillingChartData();
    getData();
  }, [sort]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <HeadersAdmin></HeadersAdmin>
      <Container>
        <Box>
          <Wrap style={{ justifyContent: 'space-between' }}>
            <Title>
              {name} - {tab === 1 ? '지공차트' : '라카 상세'}
            </Title>
            <Button onClick={() => navigate(-1)}>목록</Button>
          </Wrap>
          <Wrap>
            <Button type={tab === 1 ? 'primary' : null} style={{ width: 140, height: 40 }} onClick={() => setTab(1)}>
              지공차트
            </Button>
            <Button type={tab === 2 ? 'primary' : null} style={{ marginLeft: 5, width: 140, height: 40 }} onClick={() => setTab(2)}>
              라카 상세
            </Button>
          </Wrap>
          {tab === 1 ? (
            <Table
              columns={columns2}
              dataSource={data2}
              style={{ borderTop: '2px solid #162D59', cursor: 'pointer' }}
              showSorterTooltip={false}
              onRow={(record) => {
                return {
                  onClick: () => navigate(`/chartdetails/${record.idx}`),
                };
              }}
              scroll={{ x: 1400 }}
            />
          ) : (
            <Table
              current={page}
              columns={columns}
              dataSource={data}
              onChange={onChange}
              style={{ borderTop: '2px solid #162D59' }}
              pagination={{ total: total, pageSize: 10, showSizeChanger: false }}
              showSorterTooltip={false}
              rowClassName={(record, index) => (record.remain < 0 || record.deleted_time ? 'grey' : 'white')}
              scroll={{ x: 1800 }}
            />
          )}
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
  margin-bottom: 30px;
`;

const Title = styled.div`
  color: ${ColorMainBlue};
  font-size: 24px;
  font-weight: bold;
`;

export default AllCustomersLocker;
