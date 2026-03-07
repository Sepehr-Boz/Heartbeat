import "./css/WelcomePage.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IsUserLoggedIn, IsAuthOutOfDate } from "../utls/UserChecks";
import { auth } from "../config/firebase";


function WelcomePage(){
  let navigate = useNavigate();


  useEffect(() => {
    const checkAuth = async () => {
        const loggedIn = await IsUserLoggedIn();
        const outOfDate = await IsAuthOutOfDate();

        if (!loggedIn){
            navigate("/login");
        }
        else if (outOfDate){
            await auth.signOut();
            navigate("/login");
        }
        else{
            auth.currentUser.reload();
        }
    };

    checkAuth();      
  }, []);

  return (
    <div className='welcome-page'>
      <h1 id="app-name">Heartbeat</h1>
      <h4 id="enter-text">Press anywhere to continue</h4>
      <div className="welcome-icons" onClick={() => navigate("/home")}/>
    </div>
  );
}

export default WelcomePage; 