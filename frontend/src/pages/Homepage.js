import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import TitleBar from "../components/TitleBar";
import NavBar from "../components/NavBar";
import Divider from "../components/Divider";
import IsUserLoggedIn from '../utls/IsUserLoggedIn';

import fireIcon from "./Fire.svg";
import heartbeatIcon from "./Heartbeat.svg";
import distanceIcon from "./LocationMarker.svg";
import stepcountIcon from "./Shoe.svg";


import './css/HomePage.css';



function CategoryButton({text, category, icon, colour}){
    // TODO: based on colour flip the colours of the icon so that the white lines become the colour and the inside/transparent area
    // TODO: becomes white
    let navigate = useNavigate();

    useEffect(() => {
        if (!IsUserLoggedIn()){
            navigate("/login");
            return;
        }
        else{
            // TODO: set the cookies and UserContext
        }
    }, []);

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
    // TODO: check which categories are tracked and render a button for each one
    const [trackSteps, setTrackSteps] = useState(true);
    const [trackHeartrate, setTrackHeartrate] = useState(true);
    const [trackCalories, setTrackCalories] = useState(true);
    const [trackDistance, setTrackDistance] = useState(true);

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