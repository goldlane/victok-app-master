import React from 'react';
import { Button, Modal } from 'antd';
import axios from 'axios';
import { API } from 'Utils/API';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import AdModalContent from './AdModalContent';

function ExcelButton({ column, order, keyword, grade }) {
  const navigate = useNavigate();

  const handleExcel = async () => {
    try {
      const formdata = {
        column: column,
        order: order,
        keyword: keyword,
      };
      const token = sessionStorage.getItem('token');
      const res = await API.get('/locker/locker-list-excel', { params: formdata, headers: { Authorization: `Bearer ${token}` } });
      const result = res.data.map((item) => ({
        ...item,
        charge: item.charge.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        period: item.period_type === 1 ? item.period + '일' : item.period + '개월',
        deposit: item.deposit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        status: item.remain < 0 ? '만료됨' : '-',
      }));
      console.log('excel data', result);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('locker');
      worksheet.columns = [
        { header: '회원 이름', key: 'name' },
        { header: '휴대폰 번호', key: 'phone' },
        { header: '라카 구분', key: 'locker_type' },
        { header: '라카 번호', key: 'locker_number' },
        { header: '금액', key: 'charge' },
        { header: '기간', key: 'period' },
        { header: '보증금', key: 'deposit' },
        { header: '수납 여부', key: 'paid' },
        { header: '시작일', key: 'start_date' },
        { header: '종료일', key: 'end_date' },
        { header: '사용 기간(일)', key: 'used' },
        { header: '남은 기간(일)', key: 'remain' },
        { header: '상태', key: 'status' },
      ];

      for (const row of result) {
        worksheet.addRow({
          name: row.name,
          phone: row.phone,
          locker_type: row.locker_type,
          locker_number: row.locker_number,
          charge: row.charge,
          period: row.period,
          deposit: row.deposit,
          paid: row.paid,
          start_date: row.start_date,
          end_date: row.end_date,
          used: row.used,
          remain: row.remain,
          status: row.status,
        });
      }
      const mimeType = { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], mimeType);
      saveAs(blob, `victok_locker_${dayjs().format('YYYY.MM.DD')}.xlsx`);
    } catch (error) {
      console.log('에러', error);
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  return (
    <Button
      onClick={() => {
        if (grade === 0) {
          Modal.info({
            title: '유료 회원 전용 기능',
            content: <AdModalContent />,
            okText: '이용권 구매하기',
            onOk: () => {
              localStorage.setItem('myPageTab', 'payment');
              navigate('/mypage');
            },
            closable: true,
          });
        } else {
          handleExcel();
        }
      }}
      style={{ marginLeft: '10px' }}
    >
      Excel 다운로드
    </Button>
  );
}

export default ExcelButton;
