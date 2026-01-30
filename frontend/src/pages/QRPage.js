
import NavBar from "../components/NavBar";
import TitleBar from "../components/TitleBar";

import defaultQRCode from "./PlaceholderQRCode.png";
import "./QRPage.css";


function QRPage(){
    return (
        <div className="qrpage">
            <div id="qrpage-components">
                <h1 id="qrpage-name">USER NAME</h1>
                {/* TODO: insert a procedurally made qr code here that links/ refers
                to the users data */}
                <img src={defaultQRCode} alt="qr code" id="qr"></img>
                <h2 id="qrpage-code">ACCESS CODE: 111111</h2>
            </div>
            <NavBar isHome={false} isQR={true} isProfile={false} />
            <TitleBar title="Heartbeat" enableBack={true} />
        </div>
    )
}

export default QRPage;