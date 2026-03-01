import React, { createContext, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Cookies from "universal-cookie";
import HomePage from './pages/Homepage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import WelcomePage from './pages/WelcomePage';
import QRPage from './pages/QRPage';
import ProfilePage from './pages/Profile';
import SettingsPage from './pages/Settings';
import StatsPage from './pages/StatsPage';
import ScanQR from './pages/ScanQR';


// ! UserContext should be saved as an Object of {id: uuid, accessToken: accessToken}
// whenever the app first loads check the cookies and if user details are retained then load them back into UserContext
export const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [userRemembered, setUserRemembered] = useState(false);
  
  useEffect(() => {
    // check if has a cookie already from previous logins
    // if there is a cookie with the user data then automatically log the user in and have the default route lead to WelcomePage
    // but if theres no cookie then have the default route lead to LoginPage
    const existingCookies = new Cookies(null, {path:"/"});
    if (existingCookies.get("id")){
      setUserRemembered(true);
      // refresh the expiry date by another week from this point for all cookies
      const newExpiration = new Date();
      newExpiration.setDate(newExpiration.getDate() + 7);

      const id = existingCookies.get("id");
      const accessToken = existingCookies.get("acc_token");
      existingCookies.set("id", id, {expires:newExpiration});
      existingCookies.set("acc_token", accessToken, {expires:newExpiration});

      setUser({id: id, accessToken: accessToken});
    }
    else{
      setUserRemembered(false);
    }
  }, []);


  return (
    <div className="App">
      <UserContext.Provider value={{user, setUser}}>
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
      </UserContext.Provider>
    </div>
  );
}

export default App;
