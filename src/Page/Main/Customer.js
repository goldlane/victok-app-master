import { Table, Input, Button, Modal } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ColorBlack, ColorMainBlue, ColorWhite, ColorGold, ColorRed } from '../../Utils/Color';
import { API } from '../../Utils/API';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Headers from '../../Components/Headers';
import ResisterCustomerModal from 'Components/ResisterCustomerModal';
import EditCustomerModal from 'Components/EditCustomerModal';

// 전체 회원

function Customer() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [amount, setAmount] = useState(10);
  const [selectedCustomerInfo, setSelectedCustomerInfo] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [adData, setAdData] = useState({
    customer: { 1: { link: '', image: null, show: 1 }, 2: { link: '', image: null, show: 1 } },
  });

  const columns = [
    {
      title: '회원 이름',
      dataIndex: 'name',
      render: (name, row) => {
        return (
          <UserNameButton
            onClick={(event) => {
              getSelectedCustomerInfo(row.idx);
              event.stopPropagation();
            }}
          >
            {name}
          </UserNameButton>
        );
      },
    },
    {
      title: '휴대폰 번호',
      dataIndex: 'phone',
    },
    {
      title: '라카 사용 유무',
      dataIndex: 'use',
    },
    {
      title: '이용중인 라카 수',
      dataIndex: 'count',
    },
    {
      title: '지공차트 유무',
      dataIndex: 'chartCount',
      render: (data) => <span>{data > 0 ? 'O' : 'X'}</span>,
    },
    {
      title: '메모',
      dataIndex: 'memo',
      render: (data) => (
        <div style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{data ? data : '-'}</div>
      ),
    },
  ];

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onChange = useCallback((pagination, filters, extra) => {
    setPage(pagination.current);
  }, []);

  const getAdData = async () => {
    const res = await API.get('/admin/banner');
    const resData = res.data;
    let data = {};
    const types = ['locker', 'customer', 'setting'];
    for (const type of types) {
      data = { ...data, [type]: { ...adData[type], ...resData[type] } };
    }
    setAdData(data);
    console.log('광고 데이터', data);
  };

  const getData = async () => {
    try {
      const formdata = {
        keyword: search,
        page: page,
        amount: amount,
      };
      const token = sessionStorage.getItem('token');
      const res = await API.get('/locker/customer-list', { params: formdata, headers: { Authorization: `Bearer ${token}` } });
      const result = res.data.list.map((item) => ({ ...item, key: item.idx, use: item.count > 0 ? 'O' : 'X' }));
      console.log('회원', result);
      setData(result);
      setTotal(res.data.total);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  const getSelectedCustomerInfo = async (idx) => {
    try {
      const res = await API.get('/customer/customer-info', { params: { customer_idx: idx } });
      setSelectedCustomerInfo(res.data);
      console.log('회원 정보', res.data);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  const onDelete = async () => {
    try {
      const res = await API.post('/customer/customer-delete', { idx: selectedRowKeys.join(',') });
      Modal.success({
        title: '회원 삭제 완료',
        content: '선택하신 회원이 삭제되었습니다.',
        okText: '확인',
        onOk: () => {
          getData();
          setSelectedRowKeys([]);
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
        Modal.error({
          title: '회원 삭제 실패',
          content:
            '라카를 이용 중이거나, 라카 만료 상태이며 연장 가능한 상태인 회원은 삭제할 수 없습니다. (연장 가능 상태인 만료된 라카 삭제 후 회원 삭제 가능)',
          okText: '확인',
        });
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
    const token = sessionStorage.getItem('token');
    if (!token) navigate('/');
    getAdData();
  }, []);

  useEffect(() => {
    console.log('location', location.state);
    if (location.state) {
      setPage(location.state.page);
      setSearch(location.state.search);
    }
  }, []);

  return (
    <>
      <Headers></Headers>
      <Container>
        <EmptyBox></EmptyBox>
        <Box>
          <Wrap style={{ marginBottom: 30, justifyContent: 'space-between' }}>
            <Wrap>
              <Title>전체 회원</Title>
            </Wrap>

            <Wrap>
              <Button onClick={() => setShowModal(true)}>회원 등록</Button>
              <Input
                style={{ width: 250, marginLeft: '10px' }}
                name="search"
                placeholder="이름/연락처/메모 빠른 검색"
                value={search}
                onChange={onKeyword}
                onSubmit={getData}
              />
              {selectedRowKeys.length !== 0 && (
                <Button
                  style={{ color: ColorRed, marginLeft: '5px' }}
                  onClick={() =>
                    Modal.confirm({
                      title: '회원 삭제',
                      content: '선택하신 회원을 삭제하시겠습니까?',
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
            </Wrap>
          </Wrap>
          <Table
            columns={columns}
            dataSource={data}
            onChange={onChange}
            style={{ borderTop: '2px solid #162D59', cursor: 'pointer' }}
            showSorterTooltip={false}
            pagination={{ total: total, pageSize: 10, showSizeChanger: false, current: page }}
            onRow={(record) => {
              return {
                onClick: () => {
                  navigate('/customer', { replace: true, state: { page: page, search: search } });
                  navigate(`/customerslocker/${record.idx}`);
                },
              };
            }}
            rowSelection={rowSelection}
            scroll={{ x: 900 }}
          />
        </Box>
        <AdWrap>
          {adData.customer[1].show === 1 && adData.customer[1].image && (
            <AdLink href={adData.customer[1].link} target="_blank">
              <AdImage src={adData.customer[1].image} alt="banner"></AdImage>
            </AdLink>
          )}
          {adData.customer[2].show === 1 && adData.customer[2].image && (
            <AdLink href={adData.customer[2].link} target="_blank">
              <AdImage src={adData.customer[2].image} alt="banner"></AdImage>
            </AdLink>
          )}
        </AdWrap>
      </Container>
      <ResisterCustomerModal visible={showModal} setVisible={setShowModal} getData={getData} />
      <EditCustomerModal visible={selectedCustomerInfo} setVisible={setSelectedCustomerInfo} getData={getData} />
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
`;

const Box = styled.div`
  display: flex;
  flex: 1;
  border-radius: 10px;
  flex-direction: column;
  margin-top: 70px;
  margin-bottom: 70px;
  padding: 35px 80px;
  background-color: ${ColorWhite};
  overflow: scroll;
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: ${ColorBlack};
`;

const AdWrap = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 2;
  width: 160px;
  height: 610px;
  margin: 70px 20px;
  @media screen and (max-width: 1200px) {
    display: none;
  }
  align-self: center;
`;

const AdLink = styled.a`
  width: 160px;
  height: 300px;
  &:first-child {
    margin-bottom: 10px;
  }
`;

const AdImage = styled.img`
  width: 160px;
  height: 300px;
`;

const EmptyBox = styled.div`
  display: flex;
  flex-shrink: 2;
  width: 160px;
  height: 600px;
  margin: 70px 20px;
  box-sizing: content-box;
  margin-top: 70px;
  @media screen and (max-width: 1200px) {
    display: none;
  }
`;

const UserNameButton = styled.span`
  border-bottom: 1px solid ${ColorMainBlue};
  padding-bottom: 2px;
  color: ${ColorMainBlue};
  cursor: pointer;
  &:hover {
    color: ${ColorGold};
    border-bottom: 1px solid ${ColorGold};
  }
`;

export default Customer;
