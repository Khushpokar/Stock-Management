// src/App.jsx
import React from 'react';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import AuthForm from './component/AuthForm.jsx';
import OtpVerification from './component/OtpVerification.jsx';
import ForgotPassword from './component/ForgotPassword.jsx';
import ResetPassword from './component/ResetPassword.jsx';
import ResetOtp from './component/ResetOtp.jsx';

function App(){
  return (
     <Router>
      <Routes>
      <Route path="/" element={<AuthForm />} />
      <Route path="/verify" element={<OtpVerification />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/Otp-verify" element={<ResetOtp />} />
      </Routes>
     </Router>
  );
}


export default App;
