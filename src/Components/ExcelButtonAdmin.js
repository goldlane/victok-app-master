import React from 'react';
import { Button } from 'antd';
import axios from 'axios';
import { API } from 'Utils/API';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';

function ExcelButtonAdmin({ start_date, end_date, keyword }) {
  const handleExcel = async () => {
    try {
      const formdata = {
        start_date: start_date,
        end_date: end_date,
        keyword: keyword,
      };
      const token = sessionStorage.getItem('token');
      const res = await API.get('/admin/payment-excel', { params: formdata, headers: { Authorization: `Bearer ${token}` } });
      console.log('excel data', res.data);
      const result = res.data;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('locker');
      worksheet.columns = [
        { header: '시설 유형', key: 'storeType' },
        { header: '시설명', key: 'storeName' },
        { header: '대표명', key: 'userName' },
        { header: '결제 일자', key: 'paid_time' },
        { header: '결제 수단', key: 'payWith' },
        { header: '결제 금액', key: 'paymentAmount' },
        { header: '알림톡 건수', key: 'talkCount' },
        { header: '취소/환불 금액	', key: 'refundAmount' },
        { header: '취소/환불 내역', key: 'refundMemo' },
      ];
      for (const row of result) {
        worksheet.addRow({
          storeType: row.storeType,
          storeName: row.storeName,
          userName: row.userName,
          paid_time: dayjs(row.paid_time).format('YYYY-MM-DD'),
          payWith: '카드',
          paymentAmount: row.paymentAmount,
          talkCount: row.talkCount,
          refundAmount: row.refundAmount,
          refundMemo: row.refundMemo,
        });
      }
      const mimeType = { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], mimeType);
      saveAs(blob, `victok_payment_${dayjs().format('YYYY.MM.DD')}.xlsx`);
    } catch (error) {
      console.log('에러', error);
      if (axios.isAxiosError(error)) {
        console.log(error.response);
      }
    }
  };

  return (
    <Button onClick={handleExcel} style={{ marginRight: '10px' }}>
      Excel 다운로드
    </Button>
  );
}

export default ExcelButtonAdmin;
