import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ColorMainBlue, ColorWhite } from '../../Utils/Color';
import HeadersAdmin from '../../Components/HeadersAdmin';
import { Button, Divider, Modal } from 'antd';
import { API } from '../../Utils/API';
import axios from 'axios';
import SettingBanner from 'Components/SettingBanner';

// 관리자 - 광고 배너 관리

function AdSetting() {
  const [tab, setTab] = useState(1);
  const [infoData, setInfoData] = useState({
    locker: { 1: { link: '', image: null, show: 1 }, 2: { link: '', image: null, show: 1 } },
    customer: { 1: { link: '', image: null, show: 1 }, 2: { link: '', image: null, show: 1 } },
    setting: { 1: { link: '', image: null, show: 1 } },
  });

  const fetchData = async () => {
    const res = await API.get('/admin/banner');
    const resData = res.data;
    let data = {};
    const types = ['locker', 'customer', 'setting'];
    for (const type of types) {
      data = { ...data, [type]: { ...infoData[type], ...resData[type] } };
    }
    setInfoData(data);
    console.log('데이텉너터터텉', data);
  };

  const onSaveBanner = async (type) => {
    try {
      const form = new FormData();
      const banners = infoData[type];
      form.append('type', type);
      const idxs = Object.keys(banners);
      for (const idx of idxs) {
        const item = banners[idx];
        if (item.image) {
          form.append('idxs[]', idx);
          form.append(`link${idx}`, item.link);
          form.append(`image${idx}`, item.image);
          form.append(`show${idx}`, item.show);
        }
      }
      const res = await API.post('/admin/banner', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      Modal.success({ title: '배너 설정 완료', content: '배너 설정이 저장되었습니다.', onOk: () => fetchData(), okText: '확인' });
    } catch (error) {
      console.error('AD업로드 에러', error);
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <HeadersAdmin></HeadersAdmin>
      <Container>
        <Box>
          <Wrap style={{ width: '600px' }}>
            <div style={{ width: '100%' }}>
              <Title>광고 배너 관리</Title>
              <SubTitle>각 페이지의 배너에 적용됩니다.</SubTitle>
            </div>
            <RowWrap style={{ alignSelf: 'flex-start' }}>
              <Button
                onClick={() => {
                  setTab(1);
                }}
                type={tab === 1 ? 'primary' : null}
                style={{ marginRight: '5px', fontSize: '15px' }}
              >
                라카 현황 페이지
              </Button>
              <Button
                onClick={() => {
                  setTab(2);
                }}
                type={tab === 2 ? 'primary' : null}
                style={{ marginRight: '5px', fontSize: '15px' }}
              >
                전체 회원 페이지
              </Button>

              <Button
                onClick={() => {
                  setTab(3);
                }}
                type={tab === 3 ? 'primary' : null}
                style={{ marginRight: '5px', fontSize: '15px' }}
              >
                설정 페이지
              </Button>
            </RowWrap>
            <Divider />
            {tab === 1 ? (
              <ContentBox>
                <SettingBanner
                  title={'라카 현황 배너 - 1'}
                  size={'1390x270'}
                  infoData={infoData.locker[1]}
                  setInfoData={setInfoData}
                  type="locker"
                  index={1}
                  width={'417px'}
                  height={'81px'}
                />
                <Divider />
                <SettingBanner
                  title={'라카 현황 배너 - 2'}
                  size={'1390x270'}
                  infoData={infoData.locker[2]}
                  setInfoData={setInfoData}
                  type="locker"
                  index={2}
                  width={'417px'}
                  height={'81px'}
                />
                <Divider />
                <Button style={{ height: 50, fontSize: 16, borderRadius: 4, marginTop: 20 }} type="primary" onClick={() => onSaveBanner('locker')}>
                  저장
                </Button>
              </ContentBox>
            ) : tab === 2 ? (
              <ContentBox>
                <SettingBanner
                  title={'전체 회원 배너 - 1'}
                  size={'320x600'}
                  infoData={infoData.customer[1]}
                  setInfoData={setInfoData}
                  type="customer"
                  index={1}
                  width={'112px'}
                  height={'210px'}
                />
                <Divider />
                <SettingBanner
                  title={'전체 회원 배너 - 2'}
                  size={'320x600'}
                  infoData={infoData.customer[2]}
                  setInfoData={setInfoData}
                  type="customer"
                  index={2}
                  width={'112px'}
                  height={'210px'}
                />
                <Divider />
                <Button style={{ height: 50, fontSize: 16, borderRadius: 4, marginTop: 20 }} type="primary" onClick={() => onSaveBanner('customer')}>
                  저장
                </Button>
              </ContentBox>
            ) : tab === 3 ? (
              <ContentBox>
                <SettingBanner
                  title={'설정 페이지 배너'}
                  size={'360x1320'}
                  infoData={infoData.setting[1]}
                  setInfoData={setInfoData}
                  type="setting"
                  index={1}
                  width={'90px'}
                  height={'330px'}
                />
                <Divider />
                <Button style={{ height: 50, fontSize: 16, borderRadius: 4, marginTop: 20 }} type="primary" onClick={() => onSaveBanner('setting')}>
                  저장
                </Button>
              </ContentBox>
            ) : null}
          </Wrap>
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
  flex-direction: column;
`;

const Title = styled.p`
  color: ${ColorMainBlue};
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const RowWrap = styled.div`
  display: flex;
  margin-bottom: 5px;
  align-items: center;
`;

const SubTitle = styled.p`
  font-weight: 200;
  font-size: 16px;
  padding: 0;
  margin-bottom: 20px;
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
`;

export default AdSetting;
