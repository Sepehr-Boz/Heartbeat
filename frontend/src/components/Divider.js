import "./Divider.css";

function Divider(props){
    return (
        <div className="divider">
            <span className="divider-line" />
            <span className="divider-text">{props.text}</span>
            <span className="divider-line" />
        </div>
    );
}


export default Divider;