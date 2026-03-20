import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import TitleBar from "../components/TitleBar";
import { useEffect } from "react";


function ConnectDevice() {
    useEffect(() => {
        document.head.getElementsByTagName("title")[0].innerText = "Heartbeat - connect";
    }, []);

    return (
        <div
            className="connect-device"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                padding: "16px",
            }}
        >
            <div style={{ width: "100%", maxWidth: "900px", display: "flex", justifyContent: "center" }}>
            <TitleBar title="Heartbeat" enableBack={true} />
            </div>

            <div style={{ width: "100%", maxWidth: "900px", display: "flex", justifyContent: "center" }}>
            <NavBar isHome={false} isQr={false} isProfile={false} />
            </div>

            <div style={{ width: "100%", maxWidth: "900px", display: "flex", justifyContent: "center" }}>
            <CallButton />
            </div>
        </div>
    );
}


function CallButton() {
  return (
    <div className="login-form">
      <h3>click here to connect your device</h3>
    {/* cant do a drop down list of bluetooth as my browser or something on my laptop doesnt support */}
        <button type="button">Connect Device</button>

    </div>  
  );
}

export default ConnectDevice;