import React, { useEffect } from 'react';
import Router from './Router';
import './Utils/custom.css';

function App() {
  useEffect(() => {
    const jquery = document.createElement('script');
    jquery.src = 'https://code.jquery.com/jquery-1.12.4.min.js';
    const iamport = document.createElement('script');
    iamport.src = 'https://cdn.iamport.kr/js/iamport.payment-1.2.0.js';
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
  }, []);
  return (
    <div className="App">
      <Router />
    </div>
  );
}

export default App;
