import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';


function App() {
  return (
    <div className="App">
      <Routes> {/* The Switch decides which component to show based on the current URL.*/}
        <Route path='/' element={<LoginPage/>}></Route>
        <Route path='/login' element={<LoginPage/>}></Route>
        <Route path='/signup' element={<SignUpPage/>}></Route>
        {/* <Route path='/home' element={<HomePage/>}></Route> */}
      </Routes>
    </div>
  );
}

export default App;
