import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ColorMainBlue } from '../Utils/Color';
import img_logo from '../Assets/images/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { API } from '../Utils/API';
import { SettingOutlined, UserOutlined, HistoryOutlined, CreditCardOutlined } from '@ant-design/icons';
import { Menu, Modal } from 'antd';
import './headerAdmin.css';

function HeadersAdmin() {
  const navigate = useNavigate();

  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const onLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login-admin');
  };

  const items = [
    getItem(<NavTitle>고객 관리</NavTitle>, 'main1', <UserOutlined />, [
      getItem(
        <Link to={'/store'}>
          <MenuText>가맹점 관리</MenuText>
          {/* <MenuText>가맹점 현황/</MenuText> */}
        </Link>,
        'sub1',
        null
      ),
      getItem(
        <Link to={'/allcustomers'}>
          <MenuText>회원 현황</MenuText>
        </Link>,
        'sub2',
        null
      ),
    ]),
    getItem(<NavTitle>내역 관리</NavTitle>, 'main2', <HistoryOutlined />, [
      getItem(
        <Link to={'/lockerhistory'}>
          <MenuText>라카 관리 내역</MenuText>
        </Link>,
        'sub3'
      ),
      getItem(
        <Link to={'/talklog'}>
          <MenuText>알림톡 내역</MenuText>
        </Link>,
        'sub4'
      ),
    ]),
    getItem(<NavTitle>결제</NavTitle>, 'main3', <CreditCardOutlined />, [
      getItem(
        <Link to={'/paymenthistory'}>
          <MenuText>결제 내역</MenuText>
        </Link>,
        'sub5'
      ),
    ]),
    getItem(<NavTitle>설정</NavTitle>, 'main4', <SettingOutlined />, [
      getItem(
        <Link to={'/adsetting'}>
          <MenuText>광고 배너 관리</MenuText>
        </Link>,
        'sub9'
      ),
      getItem(
        <Link to={'/setting'}>
          <MenuText>링크 관리</MenuText>
        </Link>,
        'sub6'
      ),
      getItem(
        <Link to={'/modifypw'}>
          <MenuText>비밀번호 재설정</MenuText>
        </Link>,
        'sub7'
      ),
      getItem(
        <MenuText
          onClick={() => {
            Modal.confirm({
              title: '알림',
              content: '로그아웃 하시겠습니까?',
              okText: '확인',
              onOk: () => onLogout(),
              cancelText: '취소',
              onCancel: () => console.log('취소'),
            });
          }}
        >
          로그아웃
        </MenuText>,
        'sub8'
      ),
    ]),
  ];

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login-admin');
    }
    if (token) {
      const userIdx = jwt_decode(token).idx;
      if (userIdx === 1 || userIdx === 100055) {
      } else {
        navigate('/login-admin');
      }
    }
    if (sessionStorage.getItem('token')) {
      API.defaults.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem('token')}`;
    }
  }, []);

  return (
    <Container>
      <Section>
        <Link to={'/store'}>
          <Logo src={img_logo} />
        </Link>
      </Section>
      <Menu
        onClick={() => {}}
        style={{
          backgroundColor: ColorMainBlue,
          width: '100%',
        }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['main1', 'main2', 'main3', 'main4']}
        mode="inline"
        theme="dark"
        items={items}
      />
    </Container>
  );
}

const Container = styled.div`
  width: 230px;
  min-height: 100vh;
  background-color: ${ColorMainBlue};
  text-align: center;
`;

const Section = styled.div`
  margin-bottom: 0px;
`;

const MenuText = styled.div`
  font-size: 15px;
  margin-left: 5px;
`;

const NavTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-left: 5px;
`;

const Logo = styled.img`
  padding: 30px;
`;

export default HeadersAdmin;
