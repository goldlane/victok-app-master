import { Button, Table, Modal } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import LockerFormModal from '../../Components/LockerFormModal';
import { ColorBlack, ColorGold, ColorMainBlue, ColorRed, ColorWhite } from '../../Utils/Color';
import { API } from '../../Utils/API';
import axios from 'axios';
import Headers from '../../Components/Headers';
import { Content } from 'antd/lib/layout/layout';
import { useNavigate } from 'react-router-dom';
import LockerFormEditModal from '../../Components/LockerFormEditModal';

// 라커 설정

const initPrice = ['-', '-', '-', '-', '-', '-'];

function LockerSetting() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedLockerType, setSelectdLockerType] = useState();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [page, setPage] = useState(1);
  const [grade, setGrade] = useState();

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
      sorter: false,
    },
  ];

  const getSelectLockerType = (idx) => {
    const lockerInfo = data.find((item) => item.idx === idx);
    console.log(lockerInfo);
    setSelectdLockerType(lockerInfo);
  };

  const onChange = useCallback((pagination, filters, extra) => {
    setPage(pagination.current);
  }, []);

  const onFrist = () => {
    Modal.info({
      title: '안내',
      content: (
        <div>
          <p>설정된 라카가 없습니다.</p>
          <p>라카 설정을 필요로 합니다. 라카를 설정해 주세요.</p>
        </div>
      ),
      okButtonProps: { block: true },
      okText: '설정하러 가기',
      onOk: () => setShowModal(true),
    });
  };

  const getUserGrade = async () => {
    try {
      const res = await API.get('/user/grade');
      setGrade(res.data.grade);
    } catch {}
  };

  const getData = async () => {
    try {
      const formdata = {
        column: 'idx',
        order: 'desc',
        page: page,
        amount: 10,
      };
      const token = sessionStorage.getItem('token');
      const res = await API.get('/locker/locker-type', { params: formdata });
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
      if (result.length === 0) {
        onFrist();
      }
      setTotal(res.data.total);
      setData(result);
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
      const res = await API.post('/locker/locker-type-delete', { idx: selectedRowKeys.join(',') });
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
    const token = sessionStorage.getItem('token');
    if (!token) navigate('/');
    getUserGrade();
  }, []);

  useEffect(() => {
    getData();
  }, [page]);

  return (
    <>
      <Headers></Headers>
      <Content>
        <Container>
          <Box>
            <Wrap style={{ marginBottom: '20px', justifyContent: 'space-between' }}>
              <Wrap>
                <Title>라카 설정</Title>
              </Wrap>
              <Wrap>
                <Button style={{ marginRight: 5 }} onClick={() => setShowModal(true)}>
                  라카 구분 추가
                </Button>
                {selectedRowKeys.length !== 0 && (
                  <Button style={{ color: ColorRed }} onClick={questionDelete}>
                    삭제
                  </Button>
                )}
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
          <LockerFormModal visible={showModal} setVisible={setShowModal} getData={getData} data={data} grade={grade} />
          <LockerFormEditModal visible={selectedLockerType} setVisible={setSelectdLockerType} getData={getData} data={data} grade={grade} />
        </Container>
      </Content>
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
  width: 1400px;
  border-radius: 10px;
  min-width: 1000px;
  flex-direction: column;
  margin-top: 70px;
  margin-bottom: 70px;
  padding: 35px 80px;
  background-color: ${ColorWhite};
  & + & {
    margin-top: 70px;
    margin-bottom: 70px;
  }
  @media screen and (max-width: 1400px) {
    width: 100%;
  }
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: bold;
  color: ${ColorBlack};
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

export default LockerSetting;
