import "./css/Profile.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";

import NavBar from "../components/NavBar";
import TitleBar from "../components/TitleBar";
import Cookies from "universal-cookie";


function ProfilePage() {
        const {user, setUser} = useContext(UserContext);
        const navigate = useNavigate();
        // these are just placeholders to be changed depending on users profile pic and name
        const profileImage = "Image.jpg";

        const [username, setUsername] = useState("Loading...");

        useEffect(() => {
            const loadUserData = async () => {
                const currentUser = auth.currentUser;

                if(!currentUser) {
                    setUsername("Username");
                    return;
                }

                try {
                    const userDocRef = doc(db, "users", currentUser.uid);
                    const userDoc = await getDoc(userDocRef);

                    if(userDoc.exists()) {
                        const userData = userDoc.data();
                        setUsername(userData.username || "Username");

                        // enter profile pic stuff here later
                    }
                } catch (error) {
                console.error("Error loading profile:" + error);
                setUsername("Username");
                } 
            };
            loadUserData();
        }, []);

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
                <button className="option-button" onClick={() => navigate("/scan")}>Scan User Code</button>
                <button className="option-button">Contact GP</button>
                <button className="option-button logout-button" onClick={() => {
                    // when logging out also clear the cookies
                    const cookies = new Cookies(null, {path:"/"});
                    cookies.remove("id");
                    cookies.remove("acc_token");
                    setUser(null);
                    // have to add in replace=true option to navigate to 'trick' the page into refreshing rather than pulling from history
                    navigate("/", { replace: true });
                }}>Logout</button>
            </div>
            <NavBar isHome={false} isQr={false} isProfile={true} />
            <TitleBar title = "Heartbeat" enableBack={true}/>
        </div>
        );
    
}

export default ProfilePage;