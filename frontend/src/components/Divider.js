import "./css/Divider.css";

function Divider(props){
    // if no text passed then only render a single line the entire way through
    if (props.text == "" || props.text == undefined){
        return (
            <div className="divider">
                <span className="divider-line" />
            </div>
        );
    }
    else{
        return (
            <div className="divider">
                <span className="divider-line" />
                <span className="divider-text">{props.text}</span>
                <span className="divider-line" />
            </div>
        );
    }
}


export default Divider;