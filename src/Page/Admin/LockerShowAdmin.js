import { Button, Input, Modal, Switch, Table } from 'antd';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import FormModal from '../../Components/FormModal';
import HeadersAdmin from '../../Components/HeadersAdmin';
import PeriodEditModal from '../../Components/PeriodEditModal';
import UserEditModal from '../../Components/UserEditModal';
import { API } from '../../Utils/API';
import { ColorBlack, ColorGold, ColorMainBlue, ColorRed, ColorWhite } from '../../Utils/Color';

// 관리자 - 가맹점 현황(가맹점 관리) -> 라커 현황

const { Column } = Table;

function LockerShowAdmin(route) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user_idx } = useParams();
  const [showModal, setShowModal] = useState();
  const [showType, setShowType] = useState('list');
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [total, setTotal] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(1);
  const [sort1, setSort1] = useState({ column: 'idx', order: 'desc' });
  const [keyword, setKeyword] = useState('');
  const [lockerType, setLockerType] = useState([]);
  const [selectedLockerType, setSelectedLockerType] = useState();
  const [selectedEditLocker, setSelectedEditLocker] = useState();
  const [selectedEditUser, setSelectedEditUser] = useState();

  const columns = [
    {
      title: '회원 이름',
      dataIndex: 'name',
      sorter: true,
      render: (name, row) => {
        return row.remain < 0 ? <span>{name}</span> : <UserNameButton onClick={() => getSelectUserInfo(row.idx)}>{name}</UserNameButton>;
      },
    },
    {
      title: '휴대폰 번호',
      dataIndex: 'phone',
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
      title: '수납 여부',
      dataIndex: 'paid',
      sorter: true,
      render: (text, row) => (
        <Switch onClick={() => onPaidChange(row.idx, text)} checkedChildren="수납" unCheckedChildren="미수납" checked={text === '수납'} />
      ),
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
      title: '사용 기간 (일)',
      dataIndex: 'used',
      sorter: true,
    },
    {
      title: '남은 기간',
      dataIndex: 'remain',
      render: (text, row) => <span>{text < 0 ? 0 : text}</span>,
      sorter: true,
    },
    {
      title: '관리',
      dataIndex: 'idx',
      render: (idx, row) => (
        <Button onClick={() => getSelectLockerInfo(idx)} type="primary">
          연장
        </Button>
      ),
    },
    {
      title: '상태',
      render: (text, row) => <span>{row.deleted_time ? '삭제됨' : row.remain < 0 ? '만료됨' : '-'}</span>,
    },
  ];

  const onChange1 = useCallback((pagination, filters, extra) => {
    setPage1(pagination.current);
    if (extra.order) {
      setSort1({ column: extra.field, order: extra.order === 'ascend' ? 'asc' : 'desc' });
    } else {
      setSort1({ column: 'idx', order: 'desc' });
    }
  }, []);

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const onPaidChange = async (idx, paid) => {
    try {
      const res = await API.put('/locker/locker-paid', { locker_idx: idx, paid });
      getData();
    } catch {}
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const convertColumn = (value) => {
    switch (value) {
      case 'name':
        return 'customer.name';
      case 'phone':
        return 'customer.phone';
      case 'charge':
        return 'charge.charge';
      default:
        return `locker.${value}`;
    }
  };

  const getData = async () => {
    try {
      const formdata = {
        user_idx: user_idx,
        column: convertColumn(sort1.column),
        order: sort1.order,
        keyword: keyword,
        page: String(page1),
        amount: '10',
      };
      const token = sessionStorage.getItem('token');
      const res = await API.get('/admin/locker-list', { params: formdata, headers: { Authorization: `Bearer ${token}` } });
      const result = res.data.list.map((item) => ({
        ...item,
        charge: item.charge.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        period: item.period_type === 1 ? item.period + '일' : item.period + '개월',
        deposit: item.deposit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        key: item.idx,
      }));
      setData(result);
      setTotal(res.data.total);
    } catch (error) {
      console.log('에러', error);
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  const getData2 = async () => {
    try {
      const formdata = {
        user_idx: user_idx,
        locker_type: selectedLockerType.locker_type,
      };
      const res = await API.post('/admin/locker-array', formdata);
      const array = [];
      const useNum = res.data.list.map((item) => item.locker_number);
      for (let i = selectedLockerType.start_number; i < selectedLockerType.start_number + selectedLockerType.locker_amount; i++) {
        if (useNum.includes(i)) {
          array.push(res.data.list.find((item) => i === item.locker_number));
        } else {
          array.push({
            idx: i,
            customer_idx: 0,
            locker_number: i,
            locker_type: selectedLockerType.locker_type,
            start_date: '',
            end_date: '',
            name: '',
            remain: 0,
            available: 1,
          });
        }
      }
      setData2(array);
    } catch (error) {
      console.log('에러', error);
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  const getLockerInfo = async () => {
    const formdata = {
      user_idx: user_idx,
    };
    try {
      const res = await API.post('/admin/locker-type-all', formdata);
      setLockerType(res.data.chargeList);
      if (!selectedLockerType) {
        if (res.data.chargeList.length > 0) {
          setSelectedLockerType(res.data.chargeList[0]);
        }
      }
    } catch {}
  };

  const getSelectLockerInfo = async (idx) => {
    try {
      const res = await API.get('/locker/locker-info', { params: { locker_idx: idx } });
      console.log(res.data);
      setSelectedEditLocker(res.data);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };
  const getSelectUserInfo = async (idx) => {
    try {
      const res = await API.get('/locker/user-info', { params: { locker_idx: idx } });
      setSelectedEditUser(res.data);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  const onDelete = async () => {
    try {
      const res = await API.post('/locker/locker-delete', { idx: selectedRowKeys.join(','), admin: true });
      Modal.success({
        title: '이용자 삭제 완료',
        content: '선택하신 이용자가 삭제되었습니다.',
        okText: '확인',
        onOk: () => {
          getData();
          setSelectedRowKeys([]);
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error);
      }
    }
  };

  const onArrDelete = async (idx) => {
    try {
      const res = await API.post('/locker/locker-delete', { idx: idx, admin: true });
      Modal.success({
        title: '이용자 삭제 완료',
        content: '선택하신 이용자가 삭제되었습니다.',
        okText: '확인',
        onOk: () => {
          getData2();
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error);
      }
    }
  };

  const onKeyword = (e) => {
    setPage1(1);
    setKeyword(e.target.value);
  };

  const onSwitch = (type) => {
    const now = lockerType.findIndex((i) => i.locker_type === selectedLockerType.locker_type);
    if (type === 'next') {
      if (now < lockerType.length - 1) {
        setSelectedLockerType(lockerType[now + 1]);
      }
    } else {
      if (now > 0) {
        setSelectedLockerType(lockerType[now - 1]);
      }
    }
  };

  const onFixing = async (_lockerType, _lockerNumber) => {
    try {
      const res = await API.put('/admin/locker-fix', { user_idx: user_idx, locker_type: _lockerType, locker_number: _lockerNumber });
      getData2();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  const onAvailable = async (_lockerType, _lockerNumber) => {
    try {
      const res = await API.put('/admin/locker-available', { user_idx: user_idx, locker_type: _lockerType, locker_number: _lockerNumber });
      getData2();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) navigate('/login');
  }, []);

  useEffect(() => {
    getLockerInfo();
  }, [showModal]);

  useEffect(() => {
    if (showType === 'list') {
      const debounce = setTimeout(() => {
        console.log(sort1);
        getData();
      }, 300);
      return () => clearTimeout(debounce);
    }
  }, [showType, keyword, page1, sort1]);

  useEffect(() => {
    if (selectedLockerType) {
      getData2();
    }
  }, [showType, selectedLockerType]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <HeadersAdmin></HeadersAdmin>
      <Container>
        <Box>
          <Wrap style={{ marginBottom: 30, justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Wrap style={{ marginRight: '10px' }}>
              <Title>{state.storeName} - 라카 현황</Title>
              <Button type={showType === 'list' ? 'primary' : null} style={{ marginLeft: 30 }} onClick={() => setShowType('list')}>
                리스트
              </Button>
              <Button type={showType === 'arr' ? 'primary' : null} style={{ marginLeft: 5 }} onClick={() => setShowType('arr')}>
                배열
              </Button>
            </Wrap>
            {showType === 'list' ? (
              <ResWrap>
                <Button onClick={() => navigate(-1)} style={{ marginRight: 5 }}>
                  라카 구분
                </Button>
                <Input style={{ marginRight: 5, width: 250 }} placeholder="이름/연락처 빠른 검색" value={keyword} onChange={onKeyword} />
                <Button style={{ marginRight: 5 }} onClick={() => setShowModal({ type: '', number: '' })}>
                  이용자 추가
                </Button>

                {selectedRowKeys.length !== 0 && (
                  <Button
                    style={{ color: ColorRed }}
                    onClick={() =>
                      Modal.confirm({
                        title: '이용자 삭제',
                        content: '선택하신 이용자를 삭제하시겠습니까?',
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
              </ResWrap>
            ) : (
              <StatusWrap>
                <StatusBox>
                  <StatusCircle style={{ backgroundColor: '#fff' }}></StatusCircle>
                  <StatusText>이용 가능</StatusText>
                </StatusBox>
                <StatusBox>
                  <StatusCircle style={{ backgroundColor: '#D1F0F6' }}></StatusCircle>
                  <StatusText>이용중</StatusText>
                </StatusBox>
                <StatusBox style={{ marginRight: 0 }}>
                  <StatusCircle style={{ backgroundColor: '#DFDFDF' }}></StatusCircle>
                  <StatusText>고장 및 이용 불가</StatusText>
                </StatusBox>
              </StatusWrap>
            )}
          </Wrap>
          {showType === 'list' ? (
            <Table
              current={page1}
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
              onChange={onChange1}
              style={{ borderTop: '2px solid #162D59' }}
              pagination={{ total: total, pageSize: 10, showSizeChanger: false }}
              rowClassName={(record, index) => (record.remain < 0 ? 'grey' : 'white')}
              showSorterTooltip={false}
              scroll={{ x: 1600 }}
            >
              <Column
                title="관리"
                key="setting"
                render={(text, record) => (
                  <Button type="primary" size="middle">
                    관리
                  </Button>
                )}
              />
            </Table>
          ) : (
            <>
              <Wrap>
                <Button
                  onClick={() => onSwitch('prev')}
                  disabled={lockerType.findIndex((i) => i.locker_type === selectedLockerType.locker_type) === 0}
                  style={{ border: 0, padding: '5px 10px' }}
                >
                  {'◁'}
                </Button>
                <Type style={{ margin: 10 }}>{selectedLockerType && selectedLockerType.locker_type}</Type>
                <Button
                  onClick={() => onSwitch('next')}
                  disabled={lockerType.findIndex((i) => i.locker_type === selectedLockerType.locker_type) === lockerType.length - 1}
                  style={{ border: 0, padding: '5px 10px' }}
                >
                  {'▷'}
                </Button>
              </Wrap>
              <ArrayWrap>
                {data2.map((item) => (
                  <div key={`${selectedLockerType.locker_type}_${item.locker_number}`}>
                    {item.name ? (
                      <ArrayBox style={{ backgroundColor: '#D1F0F6' }} onClick={() => getSelectUserInfo(item.idx)}>
                        <Button
                          onClick={(event) => {
                            getSelectLockerInfo(item.idx);
                            event.stopPropagation();
                          }}
                          style={{
                            position: 'absolute',
                            top: 5,
                            right: 42,
                            width: '35px',
                            height: '22px',
                            textAlign: 'center',
                            lineHeight: '22px',
                            padding: 0,
                          }}
                        >
                          <p style={{ fontSize: '11px' }}>연장</p>
                        </Button>
                        <Button
                          onClick={(event) => {
                            Modal.confirm({
                              title: '이용자 삭제',
                              content: '선택하신 이용자를 삭제하시겠습니까?',
                              okText: '삭제',
                              onOk: () => onArrDelete(item.idx),
                              cancelText: '취소',
                              onCancel: () => console.log('취소'),
                            });
                            event.stopPropagation();
                          }}
                          style={{
                            position: 'absolute',
                            top: 5,
                            right: 5,
                            width: '35px',
                            height: '22px',
                            textAlign: 'center',
                            lineHeight: '22px',
                            padding: 0,
                          }}
                        >
                          <p style={{ fontSize: '11px' }}>삭제</p>
                        </Button>
                        <Number>{item.locker_number}</Number>
                        <RowBox>
                          <Name>{item.name}</Name>
                          <Remain>(-{item.remain})</Remain>
                        </RowBox>
                        <Date>시작 : {item.start_date}</Date>
                        <Date>종료 : {item.end_date}</Date>
                        {item.available === 1 ? (
                          <RowBox style={{ marginTop: '5px' }}>
                            <Button1>이용가능</Button1>
                            <Button2
                              onClick={(event) => {
                                onFixing(selectedLockerType.locker_type, item.locker_number);
                                event.stopPropagation();
                              }}
                            >
                              수리중
                            </Button2>
                          </RowBox>
                        ) : (
                          <RowBox style={{ marginTop: '5px' }}>
                            <Button3
                              onClick={(event) => {
                                onAvailable(selectedLockerType.locker_type, item.locker_number);
                                event.stopPropagation();
                              }}
                            >
                              이용가능
                            </Button3>
                            <Button4>수리중</Button4>
                          </RowBox>
                        )}
                      </ArrayBox>
                    ) : (
                      <>
                        {item.available === 1 ? (
                          <ArrayBox
                            style={{ backgroundColor: item.available === 1 ? '#ffffff' : '#DFDFDF' }}
                            onClick={() => {
                              setShowModal({ type: selectedLockerType, number: item.locker_number });
                            }}
                          >
                            <Number>{item.locker_number}</Number>
                            <RowBox>
                              <Name>이용가능</Name>
                            </RowBox>
                            <RowBox style={{ marginTop: '43px' }}>
                              <Button1>이용가능</Button1>
                              <Button2
                                onClick={(event) => {
                                  onFixing(selectedLockerType.locker_type, item.locker_number);
                                  event.stopPropagation();
                                }}
                              >
                                수리중
                              </Button2>
                            </RowBox>
                          </ArrayBox>
                        ) : (
                          <ArrayBox style={{ backgroundColor: item.available === 1 ? '#ffffff' : '#DFDFDF' }}>
                            <Number>{item.locker_number}</Number>
                            <RowBox>
                              <Name>이용 불가</Name>
                            </RowBox>
                            <RowBox style={{ marginTop: '43px' }}>
                              <Button3
                                onClick={(event) => {
                                  onAvailable(selectedLockerType.locker_type, item.locker_number);
                                  event.stopPropagation();
                                }}
                              >
                                이용가능
                              </Button3>
                              <Button4>수리중</Button4>
                            </RowBox>
                          </ArrayBox>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </ArrayWrap>
            </>
          )}
          <FormModal
            visible={showModal}
            setVisible={setShowModal}
            getData={getData}
            getData2={getData2}
            showType={showType}
            lockerType={lockerType}
            user_idx={user_idx}
          />
          <PeriodEditModal
            visible={selectedEditLocker}
            setVisible={setSelectedEditLocker}
            getData={getData}
            getData2={getData2}
            showType={showType}
            lockerTypeInfo={lockerType}
            admin={true}
          />
          <UserEditModal
            visible={selectedEditUser}
            setVisible={setSelectedEditUser}
            getData={getData}
            getData2={getData2}
            showType={showType}
            lockerTypeInfo={lockerType}
            admin={true}
            user_idx={user_idx}
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
const ResWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  @media screen and (max-width: 1239px) {
    margin-top: 20px;
  }
`;

const Title = styled.div`
  color: ${ColorMainBlue};
  font-size: 24px;
  font-weight: bold;
`;

const StatusWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 10px;
  @media screen and (max-width: 1065px) {
    margin-top: 10px;
  }
`;

const StatusBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 15px;
`;

const StatusCircle = styled.div`
  width: 13px;
  height: 13px;
  border: 1px solid #e3e3e3;
  border-radius: 50%;
  margin-right: 5px;
`;

const StatusText = styled.div`
  color: ${ColorBlack};
  font-size: 14px;
  font-weight: 200;
`;

const Type = styled.div`
  font-size: 16px;
  color: ${ColorMainBlue};
  font-weight: bold;
`;

const ArrayWrap = styled.div`
  /* width: 1240px; */
  /* border: 1px solid #e3e3e3; */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const ArrayBox = styled.div`
  box-sizing: border-box;
  border: 1px solid #e3e3e3;
  width: 124px;
  height: 140px;
  background-color: #d1f0f6;
  display: flex;
  flex-direction: column;
  padding: 10px;
  letter-spacing: -1px;
  position: relative;
  cursor: pointer;
`;

const Number = styled.div`
  font-size: 16px;
  color: ${ColorBlack};
  font-weight: bold;
`;

const RowBox = styled.div`
  display: flex;
  flex-direction: row;
`;

const Name = styled.div`
  font-size: 14px;
  color: ${ColorBlack};
  font-weight: bold;
  margin-right: 4px;
  margin-bottom: 5px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const Remain = styled.div`
  font-size: 14px;
  color: #a8a8a8;
  font-weight: 400;
`;

const Date = styled.div`
  font-size: 12px;
  color: ${ColorBlack};
  font-weight: 400;
`;

const Button1 = styled.div`
  font-size: 11px;
  color: ${ColorWhite};
  font-weight: 400;
  background-color: ${ColorMainBlue};
  flex: 1;
  text-align: center;
  padding: 2px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border: 1px solid ${ColorMainBlue};
  padding-bottom: 1px;
  cursor: pointer;
  &:hover {
    filter: brightness(1.2);
  }
  transition: all 0.3s ease;
`;

const Button2 = styled.div`
  font-size: 11px;
  color: ${ColorMainBlue};
  font-weight: 400;
  flex: 1;
  text-align: center;
  padding: 2px;
  background-color: ${ColorWhite};
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  box-sizing: border-box;
  border: 1px solid ${ColorMainBlue};
  padding-bottom: 1px;
  cursor: pointer;
  &:hover {
    filter: brightness(1.2);
  }
  transition: all 0.3s ease;
`;

const Button4 = styled.div`
  font-size: 11px;
  color: ${ColorWhite};
  font-weight: 400;
  background-color: ${ColorMainBlue};
  flex: 1;
  text-align: center;
  padding: 2px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  border: 1px solid ${ColorMainBlue};
  padding-bottom: 1px;
  cursor: pointer;
  &:hover {
    filter: brightness(1.2);
  }
  transition: all 0.3s ease;
`;

const Button3 = styled.div`
  font-size: 11px;
  color: ${ColorMainBlue};
  font-weight: 400;
  flex: 1;
  text-align: center;
  padding: 2px;
  background-color: ${ColorWhite};
  box-sizing: border-box;
  border: 1px solid ${ColorMainBlue};
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  padding-bottom: 1px;
  cursor: pointer;
  &:hover {
    filter: brightness(1.2);
  }
  transition: all 0.3s ease;
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

export default LockerShowAdmin;
