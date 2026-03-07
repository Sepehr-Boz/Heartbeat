import React, { createContext, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { IsUserLoggedIn, IsAuthOutOfDate } from "./utls/UserChecks";
import HomePage from './pages/Homepage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import WelcomePage from './pages/WelcomePage';
import QRPage from './pages/QRPage';
import ProfilePage from './pages/Profile';
import SettingsPage from './pages/Settings';
import StatsPage from './pages/StatsPage';
import ScanQR from './pages/ScanQR';


function App() {
  const [userRemembered, setUserRemembered] = useState(false);
  
  useEffect(() => {
    if (!IsAuthOutOfDate() && IsUserLoggedIn()){
      setUserRemembered(true);
    }
    else{
      setUserRemembered(false);
    }
  }, []);


  return (
    <div className="App">
        <Routes>
          <Route path='/' element={userRemembered ? <WelcomePage /> : <LoginPage />}></Route>
          <Route path='/login' element={<LoginPage/>}></Route>
          <Route path='/signup' element={<SignUpPage/>}></Route>
          <Route path='/welcome' element={<WelcomePage/>}></Route>
          <Route path='/qr' element={<QRPage/>}></Route>
          <Route path='/profile' element={<ProfilePage/>}></Route>
          <Route path='/settings' element={<SettingsPage/>}></Route>
          <Route path='/scan' element={<ScanQR/>}></Route>
          <Route path='/home' element={<HomePage/>}></Route>
          <Route path='/stats' element={<StatsPage/>}></Route>
        </Routes>
    </div>
  );
}

export default App;
