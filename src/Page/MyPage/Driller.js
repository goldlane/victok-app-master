import { Button, Input, Modal } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { API } from '../../Utils/API';
import { ColorBlack, ColorRed, ColorWhite } from '../../Utils/Color';

// 설정 - 지공사 관리

function Driller() {
  const [drillerList, setDrillerList] = useState([]);
  const [driller, setDriller] = useState('');

  const getDrillerList = async () => {
    try {
      const res = await API.get('user/driller');
      setDrillerList(res.data);
      console.log(res.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  const onRegisterDriller = async () => {
    if (!driller)
      return Modal.error({
        title: '지공사 등록 실패',
        content: '이름을 입력해 주세요.',
        okText: '확인',
      });
    const form = {
      name: driller,
    };
    try {
      const res = await API.post('user/driller', form);
      console.log(res.data);
      getDrillerList();
      Modal.success({
        title: '지공사 등록 완료',
        content: '지공사가 등록되었습니다.',
        okText: '확인',
        onOk: () => {
          setDriller('');
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
        return Modal.error({
          title: '지공사 등록 실패',
          content: error.response.data.message,
          okText: '확인',
        });
      }
    }
  };

  const onDeleteDriller = async (idx, name) => {
    try {
      const res = await API.post('user/driller-delete', { driller_idx: idx });
      Modal.success({
        title: '지공사 삭제 완료',
        content: `선택한 지공사(${name})가 삭제되었습니다.`,
        okText: '확인',
        onOk: () => {
          getDrillerList();
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    getDrillerList();
  }, []);

  return (
    <Box>
      <div style={{ alignItems: 'flex-start', width: '100%' }}>
        <Title>지공사 관리</Title>
        <Wrap>
          <Input placeholder="이름" style={{ marginRight: 5, width: '200px' }} value={driller} onChange={(e) => setDriller(e.target.value)} />
          <Button type="primary" style={{}} onClick={onRegisterDriller}>
            추가
          </Button>
        </Wrap>
        <DrillerWrap>
          {drillerList.map((item) =>
            item.deleted_time ? null : (
              <DrillerBox key={item.idx}>
                {item.name}
                <DeleteButton onClick={() => onDeleteDriller(item.idx, item.name)}>×</DeleteButton>
              </DrillerBox>
            )
          )}
        </DrillerWrap>
      </div>
    </Box>
  );
}

const Box = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 50px 0px;
  background-color: ${ColorWhite};
  border-radius: 10px;
  margin-top: 10px;
`;

const Title = styled.p`
  font-size: 20px;
  font-weight: 600;
  color: ${ColorBlack};
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: row;
`;
const DrillerWrap = styled.div`
  display: flex;
  margin-top: 20px;
  flex-wrap: wrap;
  min-width: 500px;
`;
const DrillerBox = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  font-size: 13px;
  padding-left: 11px;
  box-sizing: border-box;
  width: 100px;
  margin-right: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;
const DeleteButton = styled.div`
  font-size: 15px;
  color: ${ColorRed};
  cursor: pointer;
  padding: 3px 10px;
`;

export default Driller;
