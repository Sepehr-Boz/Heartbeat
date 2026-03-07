import "./css/Profile.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IsUserLoggedIn, IsAuthOutOfDate } from "../utls/UserChecks";

import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";

import NavBar from "../components/NavBar";
import TitleBar from "../components/TitleBar";


function ProfilePage() {
        const navigate = useNavigate();
        // these are just placeholders to be changed depending on users profile pic and name
        const profileImage = "Image.jpg";

        const [username, setUsername] = useState("Loading...");

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
            <button
                className="option-button logout-button"
                onClick={async () => {
                try {
                    // sign out from Firebase auth
                    await auth.signOut();
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