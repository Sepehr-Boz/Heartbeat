import { useNavigate } from "react-router-dom";

import barsIcon from "./ChartIcon.svg";
import qrIcon from "./QRIcon.svg";
import profIcon from "./PersonIcon.svg";

import "./NavBar.css";

/**
 * Creates a custom clickable icon for the navbar
**/
function NavIcon(img, alt="icon", path, isCurrent){
    let navigate = useNavigate();

    return (
        <div className="navicon"
        onClick={() => {navigate(path)}}>
            <img src={img} alt={alt} id={isCurrent ? "current" : "other"}></img>
        </div>
    )
}

/**
 * Creates the navbar at the bottom of the page
 * props has 3 variables: isHome, isQR, isProfile to determine which of
 * the 3 icons to make black and which to make grey
**/
function NavBar(props){
    const homebtn = NavIcon(barsIcon, "home icon", "/home", props.isHome);
    const qrbtn = NavIcon(qrIcon, "qr icon", "/qr", props.isQR);
    const profbtn = NavIcon(profIcon, "profile icon", "/profile", props.isProfile);

    return (
        <div className="navbar">
            {homebtn}
            {qrbtn}
            {profbtn}
        </div>
    );
}

export default NavBar;