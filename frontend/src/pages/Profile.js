import { Component } from "react";
import "./Profile.css";



class ProfilePage extends Component{
    render() {
        // these are just placeholders to be changed depending on users profile pic and name
        const username = "User Name";
        const profileImage = "Image.jpg";

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
                <button className="option-button">Settings</button>
                <button className="option-button">Scan User Code</button>
                <button className="option-button">Contact GP</button>
                <button className="option-button logout-button">Logout</button>
            </div>
        </div>
        );
    }
}

export default ProfilePage;