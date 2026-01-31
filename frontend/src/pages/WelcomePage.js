import "./css/WelcomePage.css";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/NavBar";
import TitleBar from "../components/TitleBar";



function WelcomePage(){
  let navigate = useNavigate();

  // TODO: check if any of the heart icons are overlapping with the text and if so
  // TODO: then make the heart icon not visible

  const navbar = <NavBar isHome={false} isQR={false} isProfile={false} />
  const titlebar = <TitleBar title={"Heartbeat"} enableBack={true} />



  return (
    <div className='welcome-page'>
      <h1 id="app-name">Heartbeat</h1>
      <h4 id="enter-text">Press anywhere to continue</h4>
      <div className="welcome-icons" onClick={() => navigate("/home")}/>
    </div>
  );
}

export default WelcomePage; 