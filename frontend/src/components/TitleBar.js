import { useNavigate } from "react-router-dom";
import backArrowIcon from "./BackArrow.svg";
import "./TitleBar.css";

// props will take: string title, and boolean enableBack
function TitleBar(props){
    let navigate = useNavigate();

    return (
        <div className="titlebar">
            {props.enableBack
            ? <img src={backArrowIcon} id="titlebar-back-button"
                onClick={() => navigate(-1)}/>
            : null}
            <h1 className="titlebar-title">{props.title}</h1>
        </div>
    )
}

export default TitleBar;