import { Routes, Route } from 'react-router-dom';

import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import QRPage from './pages/QRPage';
import ProfilePage from './pages/Profile';
import SettingsPage from './pages/Settings';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<WelcomePage/>}></Route>
        {/* <Route path='/home' element={<HomePage/>}></Route> */}
        <Route path='/login' element={<LoginPage/>}></Route>
        <Route path='/qr' element={<QRPage/>}></Route>
        <Route path='/profile' element={<ProfilePage/>}></Route>
        <Route path='/settings' element={<SettingsPage/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
