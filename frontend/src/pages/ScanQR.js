// file to open up camera for scanning qr codes
import React, {useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import {Html5Qrcode} from "html5-qrcode";
import IsUserLoggedIn from "../utls/IsUserLoggedIn";

function ScanQR() {
    const scannerRef = useRef(null);
    const startedRef = useRef(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!IsUserLoggedIn()){
            navigate("/home");
            return;
        }
        else{
            // TODO: set cookies and UserContext
        }


        if(scannerRef.current) return;
        const scanner = new Html5Qrcode("reader");
        scannerRef.current = scanner;
        scanner.start(
            {facingMode: "environment"},
            {
                fps: 10,
                qrbox: 200,
            },
            (decodedText) => {
                console.log("Medical Data:", decodedText);
                //scanner.stop()
            },
            () => {}
        )
        .then(() => {
            startedRef.current = true;
        })
        .catch((err) => {
            console.error("Camera open failed:", err);
        });
        
        return () => {
            if(startedRef.current && scannerRef.current) {
                scannerRef.current.stop().catch(() => {});
            }
        };
    }, []);

        return (
            <div style={{marginTop: "100px", textAlign: "center"}}>
                <h2>Scan User QR Code</h2>
                <div id = "reader" style ={{width:"300px", margin: "auto"}}></div>
            </div>
        );
}

export default ScanQR;


