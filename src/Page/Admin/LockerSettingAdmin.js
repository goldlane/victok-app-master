import { Button, Table, Modal } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ColorGold, ColorMainBlue, ColorRed, ColorWhite } from '../../Utils/Color';
import { API } from '../../Utils/API';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import HeadersAdmin from '../../Components/HeadersAdmin';
import LockerFormModalAdmin from '../../Components/LockerFormModalAdmin';
import LockerFormEditModal from '../../Components/LockerFormEditModal';

// 관리자 - 가맹점 현황(가맹점 관리) -> 라커 구분

const initPrice = ['-', '-', '-', '-', '-', '-'];

function LockerSettingAdmin() {
  const columns = [
    {
      title: '라카 구분',
      dataIndex: 'locker_type',
      render: (name, row) => <LockerTypeButton onClick={() => getSelectLockerType(row.idx)}>{name}</LockerTypeButton>,
    },
    {
      title: '라카 개수',
      dataIndex: 'locker_amount',
    },
    {
      title: '시작 번호',
      dataIndex: 'start_number',
    },
    {
      title: '요금1',
      dataIndex: '0',
    },
    {
      title: '요금2',
      dataIndex: '1',
    },
    {
      title: '요금3',
      dataIndex: '2',
    },
    {
      title: '요금4',
      dataIndex: '3',
    },
    {
      title: '요금5',
      dataIndex: '4',
    },
    {
      title: '요금6',
      dataIndex: '5',
    },
    {
      title: '알림 주기',
      dataIndex: 'dday',
    },
  ];

  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [storeName, setStorename] = useState('');
  const [selectedLockerType, setSelectdLockerType] = useState();
  const [page, setPage] = useState(1);

  const { user_idx } = useParams();
  const navigate = useNavigate();

  const onChange = useCallback((pagination, filters, extra) => {
    setPage(pagination.current);
  }, []);

  const getSelectLockerType = (idx) => {
    const lockerInfo = data.find((item) => item.idx === idx);
    setSelectdLockerType(lockerInfo);
  };

  const getData = async () => {
    try {
      const formdata = {
        user_idx: user_idx,
        page,
      };
      const res = await API.get('/admin/locker-type', { params: formdata });
      const result = res.data.chargeList.map((item) => ({
        ...item,
        ...initPrice.map((deepitem) => deepitem),
        ...item.charge.map(
          (deepitem) =>
            `${deepitem.charge.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원 / ${deepitem.period}${
              deepitem.period_type === 1 ? '일' : '개월'
            } / ${deepitem.deposit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`
        ),
        key: item.idx,
      }));
      setTotal(res.data.total);
      setData(result);
      console.log(result);
      setStorename(res.data.storeName);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onDelete = async () => {
    try {
      const res = await API.post('/admin/locker-type-delete', { idx: selectedRowKeys.join(','), user_idx });
      Modal.success({ title: '라카 구분 삭제', content: '선택하신 라카 구분이 삭제되었습니다.', okText: '확인', onOk: () => getData() });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Modal.error({ title: '라카 구분 삭제', content: error.response.data.message, okText: '확인' });
      }
    }
  };

  const questionDelete = () => {
    if (selectedRowKeys.length > 0)
      Modal.confirm({
        title: '라카 구분 삭제',
        content: '선택하신 라카 구분을 삭제하시겠습니까?\n해당 구분에 이용자가 있을시 삭제할 수 없습니다.',
        okText: '삭제',
        onOk: () => onDelete(),
        cancelText: '취소',
        onCancel: () => console.log('취소'),
      });
  };

  useEffect(() => {
    getData();
  }, [page, user_idx]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <HeadersAdmin></HeadersAdmin>
      <Container>
        <Box>
          <Wrap style={{ marginBottom: 30, justifyContent: 'space-between' }}>
            <Wrap>
              <Title>{storeName}</Title>
            </Wrap>
            <Wrap>
              <Button style={{ marginRight: 5 }} onClick={() => navigate(`/customer-admin/${user_idx}`, { state: { storeName } })}>
                전체 회원
              </Button>
              <Button style={{ marginRight: 5 }} onClick={() => navigate(`/lockershow-admin/${user_idx}`, { state: { storeName } })}>
                라카 현황
              </Button>
              <Button style={{ marginRight: 5 }} onClick={() => setShowModal(true)}>
                라카 구분 추가
              </Button>
              {selectedRowKeys.length !== 0 && (
                <Button style={{ color: ColorRed, marginRight: 5 }} onClick={questionDelete}>
                  삭제
                </Button>
              )}
              <Button onClick={() => navigate(-1)}>목록</Button>
            </Wrap>
          </Wrap>
          <TableSubLabel>* 요금(금액/기간/보증금)</TableSubLabel>

          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
            onChange={onChange}
            style={{ borderTop: '2px solid #162D59' }}
            pagination={{ total: total, pageSize: 10, showSizeChanger: false }}
            showSorterTooltip={false}
            scroll={{ x: 1700 }}
          />
        </Box>
        <LockerFormModalAdmin visible={showModal} setVisible={setShowModal} getData={getData} user_idx={user_idx} data={data} grade={1} />
        <LockerFormEditModal visible={selectedLockerType} setVisible={setSelectdLockerType} getData={getData} data={data} user_idx={user_idx} />
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

const LockerTypeButton = styled.span`
  border-bottom: 1px solid ${ColorMainBlue};
  padding-bottom: 2px;
  color: ${ColorMainBlue};
  cursor: pointer;
  &:hover {
    color: ${ColorGold};
    border-bottom: 1px solid ${ColorGold};
  }
`;

const TableSubLabel = styled.p`
  text-align: right;
  color: ${ColorMainBlue};
  margin-bottom: 5px;
`;

export default LockerSettingAdmin;
