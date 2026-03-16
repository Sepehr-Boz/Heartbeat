import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import TitleBar from "../components/TitleBar";

function ContactGP() {
    return (
        <div className="contact-gp">
            <TitleBar title="Heartbeat" enableBack={true} />
            <NavBar isHome={false} isQr={false} isProfile={false} />
        </div>
    );
}

export default ContactGP;