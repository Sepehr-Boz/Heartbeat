import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import TitleBar from "../components/TitleBar";
import { useEffect } from "react";

function ConnectDevice() {
    useEffect(() => {
        document.head.getElementsByTagName("title")[0].innerText = "Hearbeat - Connect";
    }, [])

    return (
        <div className="connect-device">
            <TitleBar title="Heartbeat" enableBack={true} />
            <NavBar isHome={false} isQr={false} isProfile={false} />
        </div>
    );
}

export default ConnectDevice;