import React from 'react';
import { Routes, Route } from 'react-router-dom';



import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/Profile';
import SettingsPage from './pages/Settings';


function App() {
  return (
    <div className="App">
      <Routes> {/* The Switch decides which component to show based on the current URL.*/}
        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/home' element={<HomePage/>}></Route>
        <Route path='/login' element={<LoginPage/>}></Route>
        <Route path='/profile' element={<ProfilePage/>}></Route>
        <Route path='/settings' element={<SettingsPage/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
