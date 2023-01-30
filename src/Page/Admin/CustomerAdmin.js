import { Table, Input, Button, Modal } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ColorMainBlue, ColorWhite, ColorGold, ColorRed } from '../../Utils/Color';
import { API } from '../../Utils/API';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ResisterCustomerModal from 'Components/ResisterCustomerModal';
import EditCustomerModal from 'Components/EditCustomerModal';
import HeadersAdmin from 'Components/HeadersAdmin';

// 관리자 - 전체 회원(이용자) 목록 (가맹점관리 - 전체회원)

function CustomerAdmin() {
  const { state } = useLocation();
  const { user_idx } = useParams();
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

  const getData = async () => {
    try {
      const formdata = {
        user_idx: user_idx,
        keyword: search,
        page: String(page),
        amount: String(amount),
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
    console.log('토큰', token);
    if (!token) navigate('/');
    if (location.state) {
      if (location.state.page) {
        setPage(location.state.page);
      }
      if (location.state.search) {
        setSearch(location.state.search);
      }
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <HeadersAdmin></HeadersAdmin>
      <Container>
        <Box>
          <Wrap style={{ marginBottom: 30, justifyContent: 'space-between' }}>
            <Wrap>
              <Title>{state.storeName} - 전체 회원</Title>
            </Wrap>
            <Wrap>
              <Button onClick={() => navigate(`/lockersetting-admin/${user_idx}`)} style={{ marginRight: '5px' }}>
                라카 구분
              </Button>
              <Button onClick={() => setShowModal(true)}>회원 등록</Button>
              <Input
                style={{ width: 250, marginLeft: '5px' }}
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
                  navigate(`/customer-admin/${user_idx}`, { replace: true, state: { storeName: state.storeName, page: page, search: search } });
                  navigate(`/customerslocker-admin/${user_idx}/${record.idx}`);
                },
              };
            }}
            rowSelection={rowSelection}
            scroll={{ x: 900 }}
          />
        </Box>
        <ResisterCustomerModal visible={showModal} setVisible={setShowModal} getData={getData} user_idx={user_idx} />
        <EditCustomerModal visible={selectedCustomerInfo} setVisible={setSelectedCustomerInfo} getData={getData} user_idx={user_idx} />
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

export default CustomerAdmin;
