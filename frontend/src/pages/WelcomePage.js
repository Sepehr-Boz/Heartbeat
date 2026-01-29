import "./WelcomePage.css";
import { useNavigate } from "react-router-dom";



function WelcomePage(){
  let navigate = useNavigate();

  // TODO: check if any of the heart icons are overlapping with the text and if so
  // TODO: then make the heart icon not visible



  return (
    <div className='welcome-page' onClick={() => navigate("/home")}>
      <h1 id="app-name">Heartbeat</h1>
      <h4 id="enter-text">Press anywhere to continue</h4>
      <div id="background-circle-mask"></div>
      <div className="welcome-icons" />
    </div>
  );
}

export default WelcomePage;