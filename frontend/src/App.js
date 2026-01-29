import { Routes, Route } from 'react-router-dom';

import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/Profile';


function App() {
  return (
    <div className="App">
      <Routes> {/* The Switch decides which component to show based on the current URL.*/}
        <Route path='/' element={<WelcomePage/>}></Route>
        {/* <Route path='/home' element={<HomePage/>}></Route> */}
        <Route path='/login' element={<LoginPage/>}></Route>
        <Route path='/profile' element={<ProfilePage/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
