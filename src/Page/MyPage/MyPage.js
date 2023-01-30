import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ColorBlack, ColorMainBlue, ColorWhite } from '../../Utils/Color';
import Headers from '../../Components/Headers';
import { useNavigate } from 'react-router-dom';
import ChangePw from './ChangePw';
import EditStoreInfo from './EditStoreInfo';
import EditUserInfo from './EditUserInfo';
import PaymentInfo from './PaymentInfo';
import Driller from './Driller';
import { Button, Divider, Modal } from 'antd';
import { API } from 'Utils/API';
import AdModalContent from 'Components/AdModalContent';

// 설정 페이지

function MyPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState();
  const [grade, setGrade] = useState();
  const [ticketName, setTicketName] = useState();
  const [ddayArr, setDdayArr] = useState([]);
  const [adData, setAdData] = useState({
    setting: { 1: { link: '', image: null, show: 1 } },
  });

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

  const getUserInfo = async () => {
    try {
      const res = await API.get('/user/grade');
      setGrade(res.data.grade);
      const ddayData = res.data.dday.dday.split(',');
      setDdayArr(ddayData);
    } catch {}
  };

  const getSettingInfo = async () => {
    try {
      const res = await API.get('/admin/payment-setting');
      console.log('이용권 정보', res.data);
      setTicketName(res.data.name);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) navigate('/');
    getAdData();
    getUserInfo();
    getSettingInfo();
    setPage(localStorage.getItem('myPageTab') ? localStorage.getItem('myPageTab') : 'user');
    localStorage.removeItem('myPageTab');
  }, []);

  return (
    <>
      <Headers></Headers>
      <Container>
        <EmptyBox />
        <Box>
          <Title style={{ alignSelf: 'flex-start' }}>
            설정 <Status>({grade === 1 ? ticketName : '무료'} 이용권 사용 중)</Status>
          </Title>
          <Wrap style={{ alignSelf: 'flex-start' }}>
            <Button
              onClick={() => {
                setPage('user');
              }}
              type={page === 'user' ? 'primary' : null}
              style={{ marginRight: '5px', fontSize: '15px' }}
            >
              개인 정보 수정
            </Button>
            <Button
              onClick={() => {
                setPage('store');
              }}
              type={page === 'store' ? 'primary' : null}
              style={{ marginRight: '5px', fontSize: '15px' }}
            >
              시설 정보 수정
            </Button>

            <Button
              onClick={() => {
                setPage('payment');
              }}
              type={page === 'payment' ? 'primary' : null}
              style={{ marginRight: '5px', fontSize: '15px' }}
            >
              결제 정보
            </Button>
            <Button
              onClick={() => {
                if (grade === 0) {
                  Modal.info({
                    title: '유료 회원 전용 기능',
                    content: <AdModalContent />,
                    okText: '이용권 구매하기',
                    onOk: () => {
                      setPage('payment');
                    },
                    closable: true,
                  });
                } else {
                  setPage('driller');
                }
              }}
              type={page === 'driller' ? 'primary' : null}
              style={{ marginRight: '5px', fontSize: '15px' }}
            >
              지공사 관리
            </Button>
            <Button
              onClick={() => {
                setPage('password');
              }}
              type={page === 'password' ? 'primary' : null}
              style={{ fontSize: '15px' }}
            >
              비밀번호 재설정
            </Button>
          </Wrap>
          <Divider />

          {page === 'password' ? (
            <ChangePw />
          ) : page === 'store' ? (
            <EditStoreInfo />
          ) : page === 'user' ? (
            <EditUserInfo />
          ) : page === 'payment' ? (
            <PaymentInfo grade={grade} ddayArr={ddayArr} />
          ) : page === 'driller' ? (
            <Driller />
          ) : null}
        </Box>
        {adData.setting[1].show === 1 && adData.setting[1].image ? (
          <AdLink href={adData.setting[1].link} target="_blank">
            <AdImage src={adData.setting[1].image} alt="banner"></AdImage>
          </AdLink>
        ) : (
          <AdLinkBox href={adData.setting[1].link} target="_blank">
            <AdImageBox src={adData.setting[1].image} alt="banner"></AdImageBox>
          </AdLinkBox>
        )}
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  overflow: scroll;
`;

const Box = styled.div`
  display: flex;

  flex-direction: column;
  border-radius: 10px;
  width: 800px;
  /* min-width: 800px; */
  min-height: 660px;
  margin-top: 70px;
  margin-bottom: 70px;
  padding: 35px 50px 20px;
  background-color: ${ColorWhite};
`;

const Wrap = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 10px;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: bold;
  color: ${ColorBlack};
  margin-bottom: 15px;
`;
const Status = styled.span`
  font-size: 20px;
  font-weight: 500;
  color: ${ColorMainBlue};
`;

const EmptyBox = styled.div`
  width: 180px;
  height: 660px;
  margin: 0 20px;
  margin-top: 70px;

  @media screen and (max-width: 1200px) {
    display: none;
  }
`;

const AdLink = styled.a`
  margin: 0 20px;
  margin-top: 70px;
  width: 180px;
  height: 660px;
  @media screen and (max-width: 1200px) {
    display: none;
  }
`;

const AdImage = styled.img`
  width: 180px;
  height: 660px;
`;

const AdLinkBox = styled.div`
  margin: 0 20px;
  margin-top: 70px;
  width: 180px;
  height: 660px;
  @media screen and (max-width: 1200px) {
    display: none;
  }
`;

const AdImageBox = styled.div`
  width: 180px;
  height: 660px;
`;

export default MyPage;
