import "./css/Profile.css";
import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IsUserLoggedIn, IsAuthOutOfDate } from "../utls/UserChecks";

import { auth, db, storage } from "../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import NavBar from "../components/NavBar";
import TitleBar from "../components/TitleBar";

import defaultProfilePic from "../components/images/default-profile-pic.png";


function ProfilePage() {
        const navigate = useNavigate();

        const [username, setUsername] = useState("Loading...");
        const [profilePic, setProfilePic] = useState(defaultProfilePic);
        const fileInputRef = useRef(null);

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
                        setProfilePic(userData.profilePic || defaultProfilePic);
                        
                    }
                } catch (error) {
                    console.error("Error loading profile:" + error);
                    setUsername("Username");
                } 
            };
            loadUserData();
        }, []);

        // allow users to click profile pic to change image
        const handleProfileClick = () => {
            fileInputRef.current.click();
        };

        // allow selection of file for profile pic
        const handleFile = async(event) => {
            const file = event.target.files[0];
            if(!file) return;
            try {
                const currentUser = auth.currentUser;
                if (!currentUser) throw new Error("Not logged in");

                const fileExtension = file.name.split('.').pop();
                const storageReference = ref(storage, `profile-pics/${currentUser.uid}.${fileExtension}`);
                await uploadBytes(storageReference, file);
                const imageUrl = await getDownloadURL(storageReference);

                // update profile pic in database
                const userDocRef = doc(db, "users", currentUser.uid);
                await updateDoc(userDocRef, { profilePic: imageUrl });

                setProfilePic(imageUrl);
            } catch(error) {
                console.error("Error changing profile pic:", error);
            }
            
            
        };

        return (
        <div className="profile">
            <div className="profile-header">
                <div className="profile-pic-container" onClick={handleProfileClick}>
                    <img
                        src={profilePic}
                        alt="Profile"
                        className="profile-pic"
                    />
                    <div className="profile-pic-overlay">Change Photo</div>
                </div>
            <input type="file" ref={fileInputRef} style={{display: "none"}} accept="image/*" onChange={handleFile} />
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