// src/App.jsx
import React from 'react';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import AuthForm from './component/AuthForm.jsx';
import OtpVerification from './component/OtpVerification.jsx';

function App(){
  return (
     <Router>
      <Routes>
      <Route path="/" element={<AuthForm />} />
      <Route path="/verify" element={<OtpVerification />} />
      </Routes>
     </Router>
  );
}


export default App;
