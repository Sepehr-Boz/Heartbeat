
import NavBar from "../components/NavBar";
import TitleBar from "../components/TitleBar";
import {QRCodeCanvas} from "qrcode.react";

import "./css/QRPage.css";


function QRPage(){
    // placeholder data to be changed to fetch data from backend
    const userData = {
        userId: 1,
        username: "Aiden",
    };

    const qrValue = JSON.stringify(userData);
    return (
        <div className="qrpage">
            <div id="qrpage-components">
                <h1 id="qrpage-name">{userData.username}</h1>
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