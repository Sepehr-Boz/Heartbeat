import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import WelcomePage from './pages/WelcomePage';
import QRPage from './pages/QRPage';
import ProfilePage from './pages/Profile';
import SettingsPage from './pages/Settings';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<LoginPage/>}></Route>
        <Route path='/login' element={<LoginPage/>}></Route>
        <Route path='/signup' element={<SignUpPage/>}></Route>
        <Route path='/welcome' element={<WelcomePage/>}></Route>
        <Route path='/qr' element={<QRPage/>}></Route>
        <Route path='/profile' element={<ProfilePage/>}></Route>
        <Route path='/settings' element={<SettingsPage/>}></Route>
        {/* <Route path='/home' element={<HomePage/>}></Route> */}
      </Routes>
    </div>
  );
}

export default App;
