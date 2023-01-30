import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Page/Home';
import Login from './Page/Login';
import Register from './Page/Register/Register';
import LockerShow from './Page/Main/LockerShow';
import LockerSetting from './Page/Main/LockerSetting';
import Customer from './Page/Main/Customer';
import CustomersLocker from './Page/Main/CustomersLocker';
import Store from './Page/Admin/Store';
import CustomerAdmin from './Page/Admin/CustomerAdmin';
import CustomersLockerAdmin from './Page/Admin/CustomersLockerAdmin';
import AllCustomers from './Page/Admin/AllCustomers';
import TalkLog from './Page/Admin/TalkLog';
import Footer from './Components/Footer';
import Setting from './Page/Admin/Setting';
import FindPw from './Page/FindPW/FindPw';
import ModifyPw from './Page/Admin/ModifyPw';
import LoginAdmin from './Page/Admin/LoginAdmin';
import LockerSettingAdmin from './Page/Admin/LockerSettingAdmin';
import LockerHistory from './Page/Admin/LockerHistory';
import MyPage from './Page/MyPage/MyPage';
import ChangePw from './Page/MyPage/ChangePw';
import AllCustomersLocker from './Page/Admin/AllCustomersLocker';
import LockerShowAdmin from './Page/Admin/LockerShowAdmin';
import Ask from './Page/MyPage/Ask';
import PaymentHistory from './Page/Admin/PaymentHistory';
import MembershipInfo from './Page/MyPage/MembershipInfo';
import RegisterChart from './Page/Main/RegisterChart';
import EditChart from './Page/Main/EditChart';
import ChartDetails from 'Page/Admin/ChartDetails';
import Payment from 'Page/MyPage/Payment';
import AdSetting from 'Page/Admin/AdSetting';
import RegisterChartAdmin from 'Page/Admin/RegisterChartAdmin';
import EditChartAdmin from 'Page/Admin/EditChartAdmin';

function Router() {
  return (
    <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/findpw" element={<FindPw />} />
            <Route path="/register" element={<Register />} />
            <Route path="/lockershow" element={<LockerShow />} />
            <Route path="/lockersetting" element={<LockerSetting />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/customerslocker/:id" element={<CustomersLocker />} />
            <Route path="/registerchart/:id" element={<RegisterChart />} />
            <Route path="/editchart/:id/:id2" element={<EditChart />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/membershipinfo" element={<MembershipInfo />} />
            <Route path="/payment/:value" element={<Payment />} />
            <Route path="/ask" element={<Ask />} />
            <Route path="/changepw" element={<ChangePw />} />

            <Route path="/login-admin" element={<LoginAdmin />} />
            <Route path="/store" element={<Store />} />
            <Route path="/lockersetting-admin/:user_idx" element={<LockerSettingAdmin />} />
            <Route path="/lockershow-admin/:user_idx" element={<LockerShowAdmin />} />
            <Route path="/customer-admin/:user_idx" element={<CustomerAdmin />} />
            <Route path="/customerslocker-admin/:user_idx/:id" element={<CustomersLockerAdmin />} />
            <Route path="/allcustomerslocker/:name/:phone" element={<AllCustomersLocker />} />
            <Route path="/chartdetails/:id2" element={<ChartDetails />} />
            <Route path="/registerchart-admin/:user_idx/:id" element={<RegisterChartAdmin />} />
            <Route path="/editchart-admin/:user_idx/:id/:id2" element={<EditChartAdmin />} />
            <Route path="/allcustomers" element={<AllCustomers />} />
            <Route path="/paymenthistory" element={<PaymentHistory />} />
            <Route path="/adsetting" element={<AdSetting />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/modifypw" element={<ModifyPw />} />
            <Route path="/lockerhistory" element={<LockerHistory />} />
            <Route path="/talklog" element={<TalkLog />} />
            <Route path="/*" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </div>
      <Footer />
    </div>
  );
}

export default Router;
