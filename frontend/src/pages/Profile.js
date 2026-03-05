import "./css/Profile.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";

import NavBar from "../components/NavBar";
import TitleBar from "../components/TitleBar";
import Cookies from "universal-cookie";

import defaultProfilePic from "../components/images/default-profile-pic.png";


function ProfilePage() {
        const {user, setUser} = useContext(UserContext);
        const navigate = useNavigate();

        const [username, setUsername] = useState("Loading...");
        const [profilePic, setProfilePic] = useState(defaultProfilePic);

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
                        setProfilePic(userData.profilePic || defaultProfilePic);
                        
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
            <img src={profilePic} alt="Profile" className="profile-pic"/>
            <h2 className="username">{username}</h2>
            </div>
            <div className="options-bar">
            <span>------ Options ------</span>
            </div>
            <div className="profile-options">
            <button className="option-button" onClick={() => navigate("/settings")}>Settings</button>
            <button className="option-button" onClick={() => navigate("/scan")}>Scan User Code</button>
            <button className="option-button">Contact GP</button>
            <button
                className="option-button logout-button"
                onClick={async () => {
                try {
                    // sign out from Firebase auth
                    await auth.signOut();

                    // clear cookies
                    const cookies = new Cookies();
                    cookies.remove("id", { path: "/" });
                    cookies.remove("acc_token", { path: "/" });

                    // clear user in context
                    setUser(null);

                    // navigate to login page and replace history so user can't go back
                    navigate("/login", { replace: true });
                } catch (error) {
                    console.error("Logout error:", error);
                    // fallback navigation
                    navigate("/login", { replace: true });
                }
                }}
            >
                Logout
            </button>
            </div>
            <NavBar isHome={false} isQr={false} isProfile={true} />
            <TitleBar title = "Heartbeat" enableBack={true}/>
        </div>
        );
    
}

export default ProfilePage;