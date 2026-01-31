import "./css/WelcomePage.css";
import { useNavigate } from "react-router-dom";


function WelcomePage(){
  let navigate = useNavigate();

  return (
    <div className='welcome-page'>
      <h1 id="app-name">Heartbeat</h1>
      <h4 id="enter-text">Press anywhere to continue</h4>
      <div className="welcome-icons" onClick={() => navigate("/home")}/>
    </div>
  );
}

export default WelcomePage; 