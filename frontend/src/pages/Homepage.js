import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import TitleBar from "../components/TitleBar";
import NavBar from "../components/NavBar";
import Divider from "../components/Divider";
import { IsUserLoggedIn, IsAuthOutOfDate } from '../utls/UserChecks';
import { db, auth } from '../config/firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";

import fireIcon from "./images/Fire.svg";
import heartbeatIcon from "./images/Heartbeat.svg";
import distanceIcon from "./images/LocationMarker.svg";
import stepcountIcon from "./images/Shoe.svg";


import './css/HomePage.css';



function CategoryButton({text, category, icon, colour}){
    // TODO: based on colour flip the colours of the icon so that the white lines become the colour and the inside/transparent area
    // TODO: becomes white
    let navigate = useNavigate();

    return (
    <div className='category-button' style={{backgroundColor: colour}}
    onClick={() => {
        navigate("/stats", {state:{category: category}});
    }}
    >
        <img src={icon} className='category-button-icon' />
        <p className='category-button-text'>{text}</p>
    </div>
    )
}




function HomePage(){
    const [trackSteps, setTrackSteps] = useState(false);
    const [trackHeartrate, setTrackHeartrate] = useState(false);
    const [trackCalories, setTrackCalories] = useState(false);
    const [trackDistance, setTrackDistance] = useState(false);

    const navigate = useNavigate();


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

        const setTrackings = async () => {
            const userDocRef = doc(db, "users", auth.currentUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()){
                const userData = userDoc.data();
                setTrackSteps(userData.preferences.trackSteps);
                setTrackDistance(userData.preferences.trackDistance);
                setTrackCalories(userData.preferences.trackCalories);
                setTrackHeartrate(userData.preferences.trackHeartRate);
            }
        }

        checkAuth();
        setTrackings();

        document.head.getElementsByTagName("title")[0].innerText = "Heartbeat - Home";
    }, []);


    return (
    <div className='home-page'>
        <TitleBar title="Heartbeat" enableBack={true} />
        <NavBar isHome={true} isQR={false} isProfile={false} />
        <div className='home-page-scrolldiv'>
            {trackSteps
            ?<CategoryButton text={'Stepcount'} category={'steps'} icon={stepcountIcon} colour={'#2D6EFF'} />
            : null}
            {trackHeartrate
            ? <CategoryButton text={'Heartrate'} category={'heartrate'} icon={heartbeatIcon} colour={'#FF2D31'} />
            : null}
            {trackCalories
            ? <CategoryButton text={'Calories'} category={'calories'} icon={fireIcon} colour={'#FFCF22'} />
            : null}
            {trackDistance
            ? <CategoryButton text={'Distance'} category={'distance_m'} icon={distanceIcon} colour={'#56FF22'} />
            : null}                                    
        </div>
    </div>
    );
}



export default HomePage;