import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ColorBlack, ColorMainBlue } from '../Utils/Color';
import { Button, Input, message, Checkbox, Upload } from 'antd';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';

function SettingBanner({ title, infoData, setInfoData, type, index, size, width = '100%', height = '100%' }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const changeValues = (e) => {
    const { value, name } = e.target;
    setInfoData((prev) => ({ ...prev, [type]: { ...prev[type], [index]: { ...prev[type][index], [name]: value } } }));
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const uploadImage = (info) => {
    getBase64(info.file.originFileObj, (url) => {
      setLoading(false);
      setImageUrl(url);
    });
    changeValues({ target: { name: 'image', value: info.file.originFileObj } });
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    return isJpgOrPng;
  };

  const uploadButton = <Button icon={loading ? <LoadingOutlined /> : <UploadOutlined />}>Upload</Button>;

  useEffect(() => {
    const imgURL = infoData.image;
    console.log(imgURL);
    if (typeof imgURL !== 'object') {
      setImageUrl(imgURL);
    } else {
      setImageUrl(null);
    }
  }, [infoData.image]);

  return (
    <>
      <SubTitle2>{title}</SubTitle2>
      <Menu>
        <RowWrap>
          <MenuText>연결 링크</MenuText>
          <Input
            name="link"
            style={{ display: 'flex', flex: 1, height: 35, borderRadius: 4, borderColor: '#E3E3E3' }}
            placeholder="배너에 연결될 링크를 입력해 주세요."
            value={infoData.link}
            onChange={(e) => changeValues(e)}
          />
        </RowWrap>
      </Menu>
      <Menu>
        <RowWrap>
          <MenuText style={{ alignSelf: 'flex-start' }}>이미지({size})</MenuText>
          <Upload name="banner" listType="picture" showUploadList={false} beforeUpload={beforeUpload} onChange={uploadImage}>
            {imageUrl ? <img src={imageUrl} alt="banner" style={{ width, height }} /> : uploadButton}
          </Upload>
        </RowWrap>
      </Menu>
      <Menu>
        <RowWrap>
          <MenuText>노출 여부</MenuText>
          <Checkbox checked={!!infoData.show} onClick={() => changeValues({ target: { name: 'show', value: 1 } })}>
            노출
          </Checkbox>
          <Checkbox checked={!infoData.show} onClick={() => changeValues({ target: { name: 'show', value: 0 } })}>
            비노출
          </Checkbox>
        </RowWrap>
      </Menu>
    </>
  );
}

const Menu = styled.div`
  padding-top: 5px;
  padding-bottom: 10px;
  &:hover {
    color: ${ColorMainBlue};
    cursor: pointer;
  }
  transition: 0.3s ease;
`;

const SubTitle2 = styled.h3`
  color: ${ColorMainBlue};
  font-size: 20px;
  padding: 0;
  margin-bottom: 15px;
  font-weight: 600;
`;

const RowWrap = styled.div`
  display: flex;
  margin-bottom: 5px;
  align-items: center;
`;

const MenuText = styled.div`
  color: ${ColorBlack};
  font-size: 15px;
  font-weight: 500;
  min-width: 100px;
  max-width: 100px;
`;

export default SettingBanner;
