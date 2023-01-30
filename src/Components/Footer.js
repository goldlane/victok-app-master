import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { API } from '../Utils/API';
import { ColorBlack, ColorMainBlue } from '../Utils/Color';
import sns_blog from '../Assets/images/sns_blog.png';
import sns_insta from '../Assets/images/sns_insta.png';
import sns_kakao from '../Assets/images/sns_kakao.png';
import sns_youtube from '../Assets/images/sns_youtube.png';

function Footer() {
  const [use, setUse] = useState('');
  const [privacy, setPrivacy] = useState('');
  const [faq, setFaq] = useState('');

  const insta = 'https://www.instagram.com/victok_v/';
  const kakao = 'http://pf.kakao.com/_Afxdxfb';
  const youtube = 'https://www.youtube.com/channel/UCU0DHWyc790ANpg9UbF83Ag';
  const blog = 'https://blog.naver.com/victok2022';

  const onInit = async () => {
    try {
      const res = await API.get('/user/terms');
      setUse(res.data[0].terms_of_use);
      setPrivacy(res.data[0].privacy_policy);
      setFaq(res.data[0].faq);
    } catch {}
  };

  useEffect(() => {
    onInit();
  }, []);

  return (
    <WhiteBg>
      <Container>
        <Wrap>
          <Wrap>
            <Terms href={use} target="_blank">
              서비스 이용약관
            </Terms>
            <Terms href={privacy} target="_blank">
              개인정보처리방침
            </Terms>
            <Terms href={faq} target="_blank">
              FAQ
            </Terms>
          </Wrap>
          <Text style={{ marginTop: 10 }}>
            (주)골드레인 | 대표이사 : 김도현 | 사업자등록번호 : 459-88-01214 | 통신판매신고번호 : 2019-강원춘천-0043
          </Text>
          <Text>강원도 춘천시 수변공원길 19 101호 | 대표전화 : 033-818-0337</Text>
          <Label style={{ marginTop: 10 }}>copyright 2022 GOLDLANE All rights reserved.</Label>
        </Wrap>
        <Wrap>
          <SnsLink href={insta} target="_blank">
            <SnsImage src={sns_insta} />
          </SnsLink>
          <SnsLink href={kakao} target="_blank">
            <SnsImage src={sns_kakao} />
          </SnsLink>
          <SnsLink href={youtube} target="_blank">
            <SnsImage src={sns_youtube} />
          </SnsLink>
          <SnsLink href={blog} target="_blank">
            <SnsImage src={sns_blog} />
          </SnsLink>
        </Wrap>
      </Container>
    </WhiteBg>
  );
}
const WhiteBg = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  background-color: #fff;
  height: 180px;
`;
const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 1400px;
  padding: 30px 0;
  @media screen and (max-width: 1450px) {
    width: 100%;
    padding: 30px 20px;
  }
`;

const Wrap = styled.div``;

const Label = styled.p`
  display: flex;
  font-size: 14px;
  color: ${ColorBlack};
  font-weight: 200;
  margin: 0;
`;

const Terms = styled.a`
  font-weight: bold;
  font-size: 15px;
  color: ${ColorMainBlue};
  margin-right: 30px;
`;

const SnsLink = styled.a`
  margin: 0 9px;
  &:last-child {
    margin-right: 0;
  }
`;

const SnsImage = styled.img`
  cursor: pointer;
  &:hover {
    filter: brightness(0.9);
  }
  transition: 0.3s ease;
`;

const Text = styled.p`
  color: ${ColorBlack};
  font-size: 13px;
  margin: 0;
`;

export default Footer;
