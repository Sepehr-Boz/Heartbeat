import "./css/Profile.css";
import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IsUserLoggedIn, IsAuthOutOfDate } from "../utls/UserChecks";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db, storage } from "../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import NavBar from "../components/NavBar";
import TitleBar from "../components/TitleBar";
import Divider from "../components/Divider";

import defaultProfilePic from "../components/images/default-profile-pic.png";
import contactGPIcon from "./images/ContactGP.svg";
import gearIcon from "./images/Gear.svg";
import scanIcon from "./images/ScanQR.svg";
import watchIcon from "./images/Watch.svg";
import instagramIcon from "./images/Instagram.svg";
import logoutIcon from "./images/Logout.svg";


function OptionButton({icon, text, onClick}){
    return (
    <div className="option-button" onClick={onClick}>
        <img className="option-img" src={icon} />
        <p className="option-text">{text}</p>
    </div>
    );
}

function LogoutButton({icon, text}){
    const navigate = useNavigate();

    return (
    <div className="option-button logout-button" onClick={async () => {
        try {
            // sign out from Firebase auth
            await auth.signOut();
            localStorage.removeItem("username");
            localStorage.removeItem("profilePic");
            // navigate to login page and replace history so user can't go back
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout error:", error);
            // fallback navigation
            navigate("/login", { replace: true });
        }
        }}>
        <img className="option-img" src={icon} />
        <p className="option-text">{text}</p>
    </div>
    );
}


function ProfilePage() {
        const navigate = useNavigate();

        const [username, setUsername] = useState(localStorage.getItem("username") || "Loading...");
        const [email, setEmail] = useState(localStorage.getItem("email") || "Loading...");
        const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic") || defaultProfilePic);
        const fileInputRef = useRef(null);

        useEffect(() => {

            document.head.getElementsByTagName("title")[0].innerText = "Heartbeat - Profile";

            const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

                if(!currentUser){
                    navigate("/login");
                    return;
                }

                try {
                    const userDocRef = doc(db, "users", currentUser.uid);
                    const userDoc = await getDoc(userDocRef);

                    if(userDoc.exists()) {
                        const userData = userDoc.data();
                        const name = userData.username || "Username";
                        const email = auth.currentUser.email;
                        const pic = userData.profilePic || defaultProfilePic
                        setUsername(name);
                        setEmail(email);
                        setProfilePic(pic);

                        localStorage.setItem("username", name);
                        localStorage.setItem("email", email);
                        localStorage.setItem("profilePic", pic);
                    }

                } catch(error){
                    console.error("Error loading profile:", error);
                }

            });

            return () => unsubscribe();

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
                localStorage.setItem("profilePic", imageUrl);
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
                <h3 className="email">{email}</h3>
            </div>

            <Divider text="Options" />

            <div className="profile-options">
                <OptionButton icon={gearIcon} text={"Settings"} onClick={() => {navigate("/settings")}} />
                <OptionButton icon={scanIcon} text={"Scan User Code"} onClick={() => {navigate("/scan")}} />
                <OptionButton icon={watchIcon} text={"Connect Device"} onClick={() => {navigate("/connect-device")}} />
                <OptionButton icon={contactGPIcon} text={"Contact GP"} onClick={() => {navigate("/contact-gp")}} />
                <OptionButton icon={instagramIcon} text={"View our Instagram!"} onClick={() => {
                    window.location.href = "https://www.instagram.com/heartbeat.official.official/";
                    return;
                }} />
                <LogoutButton icon={logoutIcon} text={"Logout"} />
            </div>
            
            <NavBar isHome={false} isQr={false} isProfile={true} />
            <TitleBar title = "Heartbeat" enableBack={true}/>
        </div>
        );
    
}

export default ProfilePage;