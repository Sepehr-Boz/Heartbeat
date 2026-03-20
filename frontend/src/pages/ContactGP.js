import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import TitleBar from "../components/TitleBar";
import { useEffect } from "react";


function ContactGP() {
    useEffect(() => {
        document.head.getElementsByTagName("title")[0].innerText = "Heartbeat - Contact GP";
    }, []);

    return (
        <div
            className="contact-gp"
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
      <h3>Click here to Call your GP</h3>
        
        <button type="button">Call GP</button>

    </div>  
  );
}

export default ContactGP;