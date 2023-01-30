import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ColorMainBlue, ColorWhite } from '../Utils/Color';
import img_logo from '../Assets/images/logo.png';
import deco_img from '../Assets/images/deco_img01.png';
import { Link, useNavigate } from 'react-router-dom';
import { API } from '../Utils/API';
import { Modal } from 'antd';

function Headers() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);

  const onLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    setIsLogin(false);
    navigate('/');
  };

  const autoLogin = () => {
    const token = localStorage.getItem('token');
    if (token) {
      sessionStorage.setItem('token', token);
      setIsLogin(true);
    }
  };

  useEffect(() => {
    if (!sessionStorage.getItem('token')) {
      autoLogin();
    }
    if (sessionStorage.getItem('token')) {
      setIsLogin(true);
      API.defaults.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem('token')}`;
    }
  }, []);

  return (
    <Wrap>
      <Container>
        <Section style={{ justifyContent: 'flex-end' }}>
          <Link to={isLogin ? '/lockershow' : '/'}>
            <Logo src={img_logo} />
          </Link>
        </Section>
        <Section style={{ flex: 2, paddingLeft: 100 }}>
          {isLogin && (
            <>
              <Link to={'/lockersetting'}>
                <Menu>
                  <MenuText>라카 설정</MenuText>
                </Menu>
              </Link>
              <Link to={'/lockershow'}>
                <Menu>
                  <MenuText>라카 현황</MenuText>
                </Menu>
              </Link>
              <Link to={'/customer'}>
                <Menu>
                  <MenuText>전체 회원</MenuText>
                </Menu>
              </Link>
            </>
          )}
        </Section>
        <Section>
          {isLogin ? (
            <>
              <Link to={'/ask'}>
                <SubMenu>문의</SubMenu>
              </Link>
              <Deco src={deco_img} />
              <Link to={'/mypage'}>
                <SubMenu>설정</SubMenu>
              </Link>
              <Deco src={deco_img} />
              <SubMenu
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
              </SubMenu>
            </>
          ) : (
            <>
              <Link to={'/login'}>
                <SubMenu>로그인</SubMenu>
              </Link>
              <Deco src={deco_img} />
              <Link to={'/register'}>
                <SubMenu>회원가입</SubMenu>
              </Link>
            </>
          )}
        </Section>
      </Container>
    </Wrap>
  );
}

const Wrap = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${ColorMainBlue};
`;

const Container = styled.div`
  display: flex;
  height: 80px;
  flex-direction: row;
  align-items: center;
  background-color: ${ColorMainBlue};
  justify-content: space-between;
  width: 1400px;
  @media screen and (max-width: 1450px) {
    margin: 0 20px;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Menu = styled.div`
  display: flex;
  padding: 0 40px;
  height: 80px;
  align-items: center;
  box-sizing: border-box;
  border-bottom: 4px solid ${ColorMainBlue};
  &:hover {
    border-bottom: 4px solid #d7a35f;
  }
  &:hover span {
    color: #d7a35f;
  }
`;

const MenuText = styled.span`
  font-size: 19px;
  color: ${ColorWhite};
  height: 80px;
  line-height: 85px;
  &:hover {
    color: #d7a35f;
  }
  transition: 0.3s ease;
`;

const SubMenu = styled.div`
  display: flex;
  padding: 0px;
  font-size: 15px;
  color: ${ColorWhite};
  &:hover {
    cursor: pointer;
  }
  &:hover {
    color: #d7a35f;
  }

  padding-right: 0px;

  transition: 0.3s ease;
`;

const Logo = styled.img``;
const Deco = styled.img`
  width: 8px;
  height: 8px;
  margin: 0 15px;
`;

export default Headers;
