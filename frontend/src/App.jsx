// src/App.jsx
import React from 'react';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import AuthForm from './component/AuthForm.jsx';
import OtpVerification from './component/OtpVerification.jsx';
import ForgotPassword from './component/ForgotPassword.jsx';
import ResetPassword from './component/ResetPassword.jsx';
import ResetOtp from './component/ResetOtp.jsx';
import Watchlist from './component/Wishlist/Watchlist.jsx';
import StockGraph from './component/StockGraph/StockGraph.jsx';
// import Groww from './component/Groww.jsx';
import HomePage from './component/HomePage.jsx';
import AllStocksPage from './component/AllStocksPage.jsx';
// import './tailwind.css'; 
// import Groww from './component/Groww.jsx';

function App(){
  return (
     <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
      <Route path="/Home" element={<HomePage />} />
      <Route path="/verify" element={<OtpVerification />} />
      {/* <Route path="/groww" element={<Groww />} /> */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/Otp-verify" element={<ResetOtp />} />
      <Route path="/watchlist" element={<Watchlist />} />
      <Route path="/graph/:ticker" element={<StockGraph />} />
      <Route path="/allstock" element={<AllStocksPage />} />
      </Routes>
     </Router>
  );
}


export default App;
