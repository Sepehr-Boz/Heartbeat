import { Component } from "react";
import "./css/Profile.css";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/NavBar";
import TitleBar from "../components/TitleBar";


function ProfilePage() {
    
        // these are just placeholders to be changed depending on users profile pic and name
        const username = "User Name";
        const profileImage = "Image.jpg";
        const navigate = useNavigate();

        return (
        <div className="profile">
            <div className="profile-header">
                <img src={profileImage} alt="Profile" className="profile-pic"/>
                <h2 className="username">{username}</h2>
            </div>
            <div className="options-bar">
                <span>------ Options ------</span>
            </div>
            <div className="profile-options">
                <button className="option-button" onClick={() => navigate("/settings")}>Settings</button>
                <button className="option-button">Scan User Code</button>
                <button className="option-button">Contact GP</button>
                <button className="option-button logout-button">Logout</button>
            </div>
            <NavBar isHome={false} isQr={false} isProfile={true} />
            <TitleBar title = "Heartbeat" enableBack={true}/>
        </div>
        );
    
}

export default ProfilePage;