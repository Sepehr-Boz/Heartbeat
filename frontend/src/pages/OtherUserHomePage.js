import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import TitleBar from "../components/TitleBar";
import NavBar from "../components/NavBar";
import Divider from "../components/Divider";
import { IsUserLoggedIn, IsAuthOutOfDate } from '../utls/UserChecks';
import { db, auth } from '../config/firebase';

import { doc, getDoc } from "firebase/firestore";

import fireIcon from "./Fire.svg";
import heartbeatIcon from "./Heartbeat.svg";
import distanceIcon from "./LocationMarker.svg";
import stepcountIcon from "./Shoe.svg";


import './css/HomePage.css';



function CategoryButton({text, category, icon, colour, uid}){
    // TODO: based on colour flip the colours of the icon so that the white lines become the colour and the inside/transparent area
    // TODO: becomes white
    let navigate = useNavigate();


    return (
    <div className='category-button' style={{backgroundColor: colour}}
    onClick={() => {
        navigate("/other/stats", {state:{category: category, uid: uid}});
    }}
    >
        <img src={icon} className='category-button-icon' />
        <p className='category-button-text'>{text}</p>
    </div>
    )
}




function OtherUserHomePage(){
    // TODO: check which categories are tracked and render a button for each one
    const [trackSteps, setTrackSteps] = useState(true);
    const [trackHeartrate, setTrackHeartrate] = useState(true);
    const [trackCalories, setTrackCalories] = useState(true);
    const [trackDistance, setTrackDistance] = useState(true);
    const [username, setUsername] = useState("Loading...");
    const [profilePic, setProfilePic] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const otherUid = location.state?.uid;

    useEffect(() => {
        // check that the ORIGINAL user has logged in AND that the other user exists/get has been retrieved?
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
            else if (!location.state){
                navigate("/profile"); // REQUIRES uid being passed to the location
            }
            else{
                auth.currentUser.reload();
            }
        };

        checkAuth();

        const loadOtherUser = async () => {
            if(!otherUid) return;
            try {
                const userRef = doc(db, "users", otherUid);
                const userSnap = await getDoc(userRef);

                if(userSnap.exists()) {
                    const data = userSnap.data();
                    setUsername(data.username || "User");
                    setProfilePic(data.profilePic || null);
                }

            } catch(error) {
                console.error("Error loading users profile:", error);
            }
        };

        loadOtherUser();

        // go back to profile after 10 minutes
        setTimeout(() => {
            navigate("/profile");
        }, 1000 * 60 * 10);
    }, []);    

    // TODO: change the titlebar title from heartbeat to the user's name
    return (
    <div className='home-page'>
        <TitleBar title={username} enableBack={true} />
        <NavBar isHome={true} isQR={false} isProfile={false} />
        <div className='home-page-scrolldiv'>
            {trackSteps
            ?<CategoryButton text={'Stepcount'} category={'steps'} icon={stepcountIcon} colour={'#2D6EFF'} uid={otherUid} />
            : null}
            {trackHeartrate
            ? <CategoryButton text={'Heartrate'} category={'heartrate'} icon={heartbeatIcon} colour={'#FF2D31'} uid={otherUid} />
            : null}
            {trackCalories
            ? <CategoryButton text={'Calories'} category={'calories'} icon={fireIcon} colour={'#FFCF22'} uid={otherUid} />
            : null}
            {trackDistance
            ? <CategoryButton text={'Distance'} category={'distance_m'} icon={distanceIcon} colour={'#56FF22'} uid={otherUid} />
            : null}                                    
        </div>
    </div>
    );
}



export default OtherUserHomePage;