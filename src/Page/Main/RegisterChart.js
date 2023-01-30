import { Button, Checkbox, Divider, Input, Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ColorBlack, ColorWhite } from '../../Utils/Color';
import { API } from '../../Utils/API';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Headers from '../../Components/Headers';
import image2 from '../../Assets/images/drilling_chart.png';
import ChartInput from '../../Components/ChartInput';

// 지공차트 등록 페이지

function RegisterChart() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { Option } = Select;
  const { TextArea } = Input;
  const [chartData, setChartData] = useState({
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    6: '',
    7: '',
    8: '',
    9: '',
    10: '',
    11: '',
    12: '',
    13: '',
    14: '',
    15: '',
    16: '',
    17: '',
    18: '',
    19: '',
    20: '',
    21: '',
    22: '',
    23: '',
    24: '',
    25: '',
    26: '',
    27: '',
    28: '',
    29: '',
    30: '',
    31: '',
    32: '',
    33: '',
    34: '',
    35: '',
    36: '',
    37: '',
  });
  const [infoData, setInfoData] = useState({
    name: '',
    hp: '',
    ballName: '',
    weight: '',
    driller_idx: null,
    hand: '',
    layout: '',
    pin: '',
    memo: '',
  });
  const [drillerList, setDrillerList] = useState([]);
  const [chartName, setChartName] = useState();

  const getCustomerInfo = async () => {
    try {
      const formdata = {
        customer_idx: id,
      };
      const token = sessionStorage.getItem('token');
      const res = await API.get('/customer/customer-info', { params: formdata, headers: { Authorization: `Bearer ${token}` } });
      const data = res.data;
      console.log('데이터어', data);
      setInfoData({
        name: data.name,
        hp: data.phone,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  const insertChartData = (e) => {
    setChartData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const onRegisterChart = async () => {
    if (!infoData.ballName)
      return Modal.error({
        title: '지공차트 등록 실패',
        content: '볼 이름을 입력해 주세요.',
        okText: '확인',
      });
    if (!infoData.weight)
      return Modal.error({
        title: '지공차트 등록 실패',
        content: '무게를 입력해 주세요.',
        okText: '확인',
      });
    if (!infoData.driller_idx)
      return Modal.error({
        title: '지공차트 등록 실패',
        content: '지공사를 선택해 주세요.',
        okText: '확인',
      });
    const chartDataArr = Object.values(chartData);
    const form = {
      title: chartName,
      customer_idx: id,
      chart_data: chartDataArr,
      ball_name: infoData.ballName,
      weight: infoData.weight,
      driller_idx: infoData.driller_idx,
      hand: infoData.hand,
      layout: infoData.layout,
      pin: infoData.pin,
      memo: infoData.memo,
    };
    console.log('데이터', form);
    try {
      const res = await API.post('customer/drilling-chart', form);
      console.log(res.data);
      Modal.success({
        title: '지공차트 등록 완료',
        content: '지공차트가 등록되었습니다.',
        okText: '확인',
        onOk: () => {
          navigate(`/customerslocker/${id}`);
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  const getDrillerList = async () => {
    try {
      const res = await API.get('user/driller');
      setDrillerList(res.data);
      if (res.data.length < 1) {
        return Modal.info({
          title: '알림',
          content: '지공사를 추가해 주세요.',
          okText: '설정하러 가기',
          onOk: () => {
            localStorage.setItem('myPageTab', 'driller');
            navigate('/mypage');
          },
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  useEffect(() => {
    getCustomerInfo();
    getDrillerList();
  }, []);

  return (
    <>
      <Headers></Headers>
      <Container>
        <Box>
          <TitleWrap>
            <Div style={{ display: 'flex', flex: 1, marginRight: 20 }}>
              <Title>지공차트 등록</Title>
              <Input
                value={chartName}
                onChange={(e) => setChartName(e.target.value)}
                style={{
                  width: '50%',
                  height: '32px',
                  padding: 0,
                  paddingLeft: '10px',
                  border: 0,
                  borderBottom: '1px solid #ccc',
                  fontSize: '16px',
                  marginLeft: '10px',
                }}
                maxLength={11}
                placeholder="제목을 입력해 주세요."
              />
            </Div>
            <Div>
              <Button type={'primary'} style={{ marginRight: '5px' }} onClick={onRegisterChart}>
                등록하기
              </Button>
              <Button onClick={() => navigate(-1)}>취소</Button>
            </Div>
          </TitleWrap>
          <Divider />
          <ContentWrap>
            <ChartWrap>
              <ChartImage src={image2} />
              {/* 지공차트 인풋 */}
              <ChartInput
                name="1"
                value={chartData[1]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '92px', top: '2px' }}
                maxLength={2}
              />
              <ChartInput
                name="2"
                value={chartData[2]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '92px', top: '26px' }}
                maxLength={2}
              />
              <ChartInput
                name="3"
                value={chartData[3]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '306px', top: '2px' }}
                maxLength={2}
              />
              <ChartInput
                name="4"
                value={chartData[4]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '306px', top: '26px' }}
                maxLength={2}
              />
              <ChartInput
                name="5"
                value={chartData[5]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '32px', top: '56px' }}
                maxLength={2}
              />
              <ChartInput
                name="6"
                value={chartData[6]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '32px', top: '80px' }}
                maxLength={2}
              />
              <ChartInput
                name="7"
                onChange={insertChartData}
                value={chartData[7]}
                style={{ ...inputStyle, ...inputType1, left: '152px', top: '56px' }}
                maxLength={2}
              />
              <ChartInput
                name="8"
                value={chartData[8]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '152px', top: '80px' }}
                maxLength={2}
              />
              <ChartInput
                name="9"
                value={chartData[9]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '246px', top: '56px' }}
                maxLength={2}
              />
              <ChartInput
                name="10"
                value={chartData[10]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '246px', top: '80px' }}
                maxLength={2}
              />
              <ChartInput
                name="11"
                value={chartData[11]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '366px', top: '56px' }}
                maxLength={2}
              />
              <ChartInput
                name="12"
                value={chartData[12]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '366px', top: '80px' }}
                maxLength={2}
              />
              <ChartInput
                name="13"
                value={chartData[13]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '92px', top: '110px' }}
                maxLength={2}
              />
              <ChartInput
                name="14"
                value={chartData[14]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '92px', top: '134px' }}
                maxLength={2}
              />
              <ChartInput
                name="15"
                value={chartData[15]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '306px', top: '110px' }}
                maxLength={2}
              />
              <ChartInput
                name="16"
                value={chartData[16]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '306px', top: '134px' }}
                maxLength={2}
              />
              <ChartInput
                name="17"
                value={chartData[17]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType2, left: '70px', top: '200px' }}
                maxLength={1}
              />
              <ChartInput
                name="18"
                value={chartData[18]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType3, left: '107px', top: '201px' }}
                maxLength={2}
              />
              <ChartInput
                name="19"
                value={chartData[19]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType3, left: '107px', top: '231px' }}
                maxLength={2}
              />
              <ChartInput
                name="20"
                value={chartData[20]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType2, left: '284px', top: '200px' }}
                maxLength={1}
              />
              <ChartInput
                name="21"
                value={chartData[21]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType3, left: '321px', top: '201px' }}
                maxLength={2}
              />
              <ChartInput
                name="22"
                value={chartData[22]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType3, left: '321px', top: '231px' }}
                maxLength={2}
              />
              <ChartInput
                name="23"
                value={chartData[23]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '92px', top: '56px' }}
                maxLength={2}
              />
              <ChartInput
                name="24"
                value={chartData[24]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '92px', top: '81px' }}
                maxLength={2}
              />
              <ChartInput
                name="25"
                value={chartData[25]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '306px', top: '56px' }}
                maxLength={2}
              />
              <ChartInput
                name="26"
                value={chartData[26]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '306px', top: '81px' }}
                maxLength={2}
              />
              <ChartInput
                name="27"
                value={chartData[27]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType4, left: '405px', top: '288px' }}
                maxLength={8}
              />
              <ChartInput
                name="28"
                value={chartData[28]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '198px', top: '303px' }}
                maxLength={2}
              />
              <ChartInput
                name="29"
                value={chartData[29]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '198px', top: '327px' }}
                maxLength={2}
              />
              <ChartInput
                name="30"
                value={chartData[30]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '138px', top: '357px' }}
                maxLength={2}
              />
              <ChartInput
                name="31"
                value={chartData[31]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '138px', top: '381px' }}
                maxLength={2}
              />
              <ChartInput
                name="32"
                value={chartData[32]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '198px', top: '357px' }}
                maxLength={2}
              />
              <ChartInput
                name="33"
                value={chartData[33]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '198px', top: '381px' }}
                maxLength={2}
              />
              <ChartInput
                name="34"
                value={chartData[34]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '258px', top: '357px' }}
                maxLength={2}
              />
              <ChartInput
                name="35"
                value={chartData[35]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '258px', top: '381px' }}
                maxLength={2}
              />
              <ChartInput
                name="36"
                value={chartData[36]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '198px', top: '411px' }}
                maxLength={2}
              />
              <ChartInput
                name="37"
                value={chartData[37]}
                onChange={insertChartData}
                style={{ ...inputStyle, ...inputType1, left: '198px', top: '435px' }}
                maxLength={2}
              />
            </ChartWrap>
            <InfoWrap>
              <InfoTitle>기본 정보</InfoTitle>
              <RowWrap>
                <Input
                  placeholder="이름"
                  style={{ width: '145px', marginRight: '10px' }}
                  value={infoData.name}
                  onChange={(e) => setInfoData((prev) => ({ ...prev, name: e.target.value }))}
                  disabled
                />
                <Input
                  placeholder="휴대폰 번호"
                  style={{}}
                  value={infoData.hp}
                  onChange={(e) => setInfoData((prev) => ({ ...prev, hp: e.target.value }))}
                  type="number"
                  disabled
                />
              </RowWrap>
              <InfoTitle>지공 정보</InfoTitle>
              <RowWrap>
                <Input
                  placeholder="볼 이름"
                  style={{ marginRight: '10px' }}
                  value={infoData.ballName}
                  onChange={(e) => setInfoData((prev) => ({ ...prev, ballName: e.target.value }))}
                />
                <Input
                  placeholder="무게"
                  style={{ width: '145px' }}
                  value={infoData.weight}
                  onChange={(e) => setInfoData((prev) => ({ ...prev, weight: e.target.value }))}
                  type="number"
                  min={5}
                  max={15}
                />
                <UnitText>lbs</UnitText>
              </RowWrap>
              <Div>
                <InfoTitle>지공사</InfoTitle>
                <Select
                  placeholder="선택해 주세요."
                  style={{ display: 'flex' }}
                  onChange={(value) => {
                    setInfoData((prev) => ({ ...prev, driller_idx: value }));
                  }}
                  value={infoData.driller_idx}
                >
                  {drillerList.map((item) =>
                    item.deleted_time ? (
                      item.idx === infoData.driller_idx ? (
                        <Option value={item.idx} disabled={true}>
                          {item.name}
                        </Option>
                      ) : null
                    ) : (
                      <Option value={item.idx}>{item.name}</Option>
                    )
                  )}
                </Select>
              </Div>
              <RowWrap style={{ margin: '15px 0' }}>
                <Div style={{ marginRight: '35px' }}>
                  <InfoTitle>사용하는 손</InfoTitle>
                  <Div>
                    <Checkbox checked={infoData.hand === 'right'} onClick={() => setInfoData((prev) => ({ ...prev, hand: 'right' }))}>
                      오른손
                    </Checkbox>
                    <Checkbox checked={infoData.hand === 'left'} onClick={() => setInfoData((prev) => ({ ...prev, hand: 'left' }))}>
                      왼손
                    </Checkbox>
                  </Div>
                </Div>
                <Div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <InfoTitle>레이아웃</InfoTitle>
                  <Input
                    maxLength={20}
                    placeholder="레이아웃"
                    style={{ marginBottom: '10px' }}
                    value={infoData.layout}
                    onChange={(e) => setInfoData((prev) => ({ ...prev, layout: e.target.value }))}
                  />
                  <Div>
                    <Checkbox checked={infoData.pin === 'up'} onClick={() => setInfoData((prev) => ({ ...prev, pin: 'up' }))}>
                      핀업
                    </Checkbox>
                    <Checkbox checked={infoData.pin === 'down'} onClick={() => setInfoData((prev) => ({ ...prev, pin: 'down' }))}>
                      핀다운
                    </Checkbox>
                  </Div>
                </Div>
              </RowWrap>
              <InfoTitle>메모 및 상담 내용</InfoTitle>
              <TextArea
                placeholder="지공 시 상담한 내용을 적으시면 됩니다."
                style={{ height: '160px', paddingTop: '7px' }}
                value={infoData.memo}
                onChange={(e) => setInfoData((prev) => ({ ...prev, memo: e.target.value }))}
              />
            </InfoWrap>
          </ContentWrap>
        </Box>
      </Container>
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
  flex-direction: column;
  margin-top: 70px;
  margin-bottom: 70px;
  background-color: ${ColorWhite};
  width: 1000px;
  border-radius: 10px;
`;

const TitleWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 32px 30px 0;
  justify-content: space-between;
`;
const ContentWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px 20px 50px;
`;

const Title = styled.span`
  margin-left: 10px;
  font-size: 22px;
  font-weight: 600;
  color: ${ColorBlack};
  margin-right: 20px;
`;

const Div = styled.div`
  margin-bottom: 5px;
`;

const ChartWrap = styled.div`
  position: relative;
  padding: 0 60px 0 30px;
`;

const ChartImage = styled.img``;

const InfoWrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding-right: 20px;
`;

const InfoTitle = styled.p`
  margin: 5px 0;
  font-size: 15px;
  color: ${ColorBlack};
  font-weight: 500;
`;

const RowWrap = styled.div`
  display: flex;
  flex: 1;
  margin-bottom: 15px;
`;

const UnitText = styled.span`
  margin-left: 5px;
  font-size: 14px;
  color: ${ColorBlack};
  font-weight: 500;
  line-height: 30px;
`;

const inputStyle = { position: 'absolute', borderColor: 'transparent', fontSize: '13px', padding: 0, textAlign: 'center' };
const inputType1 = { width: '52px', height: '21px' };
const inputType2 = { width: '34px', height: '58px' };
const inputType3 = { width: '58px', height: '27px' };
const inputType4 = { width: '93px', height: '26px' };

export default RegisterChart;
