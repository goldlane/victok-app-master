import { Button, Modal, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import LockerFormModal from '../../Components/LockerFormModal';
import { ColorMainBlue, ColorRed, ColorWhite } from '../../Utils/Color';
import { API } from '../../Utils/API';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Headers from '../../Components/Headers';
import './table.css';
import dayjs from 'dayjs';
import AdModalContent from 'Components/AdModalContent';

// 전체회원 라커 상세

function CustomersLocker() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [total2, setTotal2] = useState();
  const [name, setName] = useState('');
  const [sort, setSort] = useState({ column: 'start_date', order: 'desc' });
  const [page, setPage] = useState(1);
  const [page2, setPage2] = useState(1);

  const [data2, setData2] = useState([]);
  const [tab, setTab] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [grade, setGrade] = useState();

  const columns = [
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
      title: '남은 기간',
      dataIndex: 'remain',
      sorter: true,
      render: (text, row) => <span>{Number(text) < 0 ? 0 : row.deleted_time ? 0 : text}</span>,
    },
    {
      title: '금액',
      dataIndex: 'charge',
      sorter: true,
    },
    {
      title: '수납 여부',
      dataIndex: 'paid',
      sorter: true,
    },
    {
      title: '상태',
      render: (text, row) => <span>{row.deleted_time ? '삭제됨' : row.remain < 0 ? '만료됨' : '-'}</span>,
    },
  ];

  const columns2 = [
    {
      title: '날짜',
      width: '140px',
      dataIndex: 'updated_time',
      render: (data) => <span>{dayjs(data).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '제목',
      width: '140px',
      dataIndex: 'chart_name',
    },
    {
      title: '공이름',
      dataIndex: 'ball_name',
    },
    {
      title: '무게(lbs)',
      width: '110px',
      dataIndex: 'weight',
      render: (data) => <span>{`${data} lbs`}</span>,
    },
    {
      title: '레이아웃',
      dataIndex: 'layout',
      render: (data, row) => <span>{`${data ? data : '-'} / ${row.pin === 'up' ? '핀업' : '핀다운'}`}</span>,
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

  const convertColumn = (value) => {
    switch (value) {
      case 'charge':
        return 'charge.charge';
      default:
        return `locker.${value}`;
    }
  };

  const getGrade = async () => {
    try {
      const res = await API.get('/user/grade');
      setGrade(res.data.grade);
      if (res.data.grade === 0) {
        setTab(2);
      } else {
        setTab(1);
      }
    } catch {}
  };

  const getData = async () => {
    try {
      const formdata = {
        column: convertColumn(sort.column),
        order: sort.order,
        customer_idx: id,
        page: page,
      };
      const token = sessionStorage.getItem('token');
      const res = await API.get('/locker/customer-locker', { params: formdata, headers: { Authorization: `Bearer ${token}` } });
      const result = res.data.list.map((item) => ({
        ...item,
        charge: item.charge.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      }));
      setData(result);
      setTotal(res.data.total);
      setName(res.data.customerName);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  const getDrillingChartData = async () => {
    try {
      const formdata = {
        customer_idx: id,
        page: page2,
      };
      const token = sessionStorage.getItem('token');
      const res = await API.get('/customer/drilling-chart-list', { params: formdata, headers: { Authorization: `Bearer ${token}` } });
      const data = res.data.chartList;
      console.log('drilling', data);
      setData2(data.map((item) => ({ ...item, key: item.idx })));
      setTotal2(res.data.total);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  const onChange1 = useCallback((pagination, filters, extra) => {
    setPage(pagination.current);
    if (extra.order) {
      setSort({ column: extra.field, order: extra.order === 'ascend' ? 'asc' : 'desc' });
    } else {
      setSort({ column: 'start_date', order: 'desc' });
    }
  }, []);

  const onChange2 = useCallback((pagination, filters, extra) => {
    setPage2(pagination.current);
  }, []);

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onDelete = async () => {
    try {
      const res = await API.post('/customer/drilling-chart-delete', { idx: selectedRowKeys });
      Modal.success({
        title: '지공차트 삭제 완료',
        content: '선택한 지공차트가 삭제되었습니다.',
        okText: '확인',
        onOk: () => {
          getDrillingChartData();
          setSelectedRowKeys([]);
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    getDrillingChartData();
    getData();
  }, [id]);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) navigate('/');
    getGrade();
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      return getData();
    }, 300);
    return () => clearTimeout(debounce);
  }, [page, sort]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      return getDrillingChartData();
    }, 300);
    return () => clearTimeout(debounce);
  }, [page2]);

  return (
    <>
      <Headers></Headers>
      <Container>
        <Box>
          <Wrap style={{ justifyContent: 'space-between' }}>
            <Title>
              {name && name} - {tab === 1 ? '지공차트' : '라카 상세'}
            </Title>
            <Div>
              {tab === 1 && selectedRowKeys.length !== 0 && (
                <Button
                  style={{ color: ColorRed, marginRight: 10 }}
                  onClick={() =>
                    Modal.confirm({
                      title: '지공차트 삭제',
                      content: '선택한 지공차트를 삭제하시겠습니까?',
                      okText: '삭제',
                      onOk: () => onDelete(),
                      cancelText: '취소',
                      onCancel: () => console.log('취소'),
                    })
                  }
                >
                  선택 삭제
                </Button>
              )}
              {tab === 1 && (
                <Button onClick={() => navigate(`/registerchart/${id}`)} style={{ marginRight: 10 }}>
                  등록하기
                </Button>
              )}

              <Button onClick={() => navigate(-1)}>목록</Button>
            </Div>
          </Wrap>
          <Wrap>
            <Button
              type={tab === 1 ? 'primary' : null}
              style={{ width: 140, height: 40 }}
              onClick={() => {
                if (grade === 0) {
                  Modal.info({
                    title: '유료 회원 전용 기능',
                    content: <AdModalContent />,
                    okText: '이용권 구매하기',
                    onOk: () => {
                      localStorage.setItem('myPageTab', 'payment');
                      navigate('/mypage');
                    },
                    closable: true,
                  });
                } else {
                  setTab(1);
                }
              }}
            >
              지공차트
            </Button>
            <Button type={tab === 2 ? 'primary' : null} style={{ marginLeft: 5, width: 140, height: 40 }} onClick={() => setTab(2)}>
              라카 상세
            </Button>
          </Wrap>
          {tab === 1 ? (
            <Table
              // current={page2}
              columns={columns2}
              dataSource={data2}
              onChange={onChange2}
              rowSelection={rowSelection}
              style={{ borderTop: '2px solid #162D59', cursor: 'pointer' }}
              pagination={{ total: total2, pageSize: 10, showSizeChanger: false, current: page2 }}
              showSorterTooltip={false}
              onRow={(record) => {
                return {
                  onClick: () => navigate(`/editchart/${id}/${record.idx}`),
                };
              }}
              scroll={{ x: 1100 }}
            />
          ) : (
            <Table
              columns={columns}
              dataSource={data}
              style={{ borderTop: '2px solid #162D59' }}
              pagination={{ total: total, pageSize: 10, showSizeChanger: false, current: page }}
              onChange={onChange1}
              rowClassName={(record, index) => (record.remain < 0 || record.deleted_time ? 'grey' : 'white')}
              showSorterTooltip={false}
              scroll={{ x: 1200 }}
            />
          )}
        </Box>
        <LockerFormModal visible={showModal} setVisible={setShowModal} />
      </Container>
    </>
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
  min-width: 1000px;
  flex-direction: column;
  margin-top: 70px;
  margin-bottom: 70px;
  padding: 35px 80px;
  background-color: ${ColorWhite};
  & + & {
    margin-top: 10px;
    margin-bottom: 70px;
  }
  width: 1400px;
  border-radius: 10px;
  @media screen and (max-width: 1400px) {
    width: 100%;
  }
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: ${ColorMainBlue};
`;

const Div = styled.div``;

export default CustomersLocker;
