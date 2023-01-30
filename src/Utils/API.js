import axios from 'axios';

export const API = axios.create({
  baseURL: 'https://victok.co.kr/api',
  // baseURL: 'http://localhost:4000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});
