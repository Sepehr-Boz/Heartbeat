import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import TitleBar from "../components/TitleBar";
import {QRCodeCanvas} from "qrcode.react";
import { IsUserLoggedIn, IsAuthOutOfDate } from "../utls/UserChecks";
import { auth } from "../config/firebase";

import "./css/QRPage.css";


function QRPage(){

    const [qrValue, setQrValue] = useState("");
    

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
                await auth.currentUser.reload();
                setQrValue(auth.currentUser.uid);
            }
        };

        checkAuth();       
        document.head.getElementsByTagName("title")[0].innerText = "Heartbeat - User QR";
    }, []);


    return (
        <div className="qrpage">
            <div id="qrpage-components">
                <h1 id="qrpage-name">QR Code</h1>
                {/* TODO: insert a procedurally made qr code here that links/ refers
                to the users data */}
                <QRCodeCanvas value={qrValue} size={300}/>
            </div>
            <NavBar isHome={false} isQR={true} isProfile={false} />
            <TitleBar title="Heartbeat" enableBack={true} />
        </div>
    )
}

export default QRPage;