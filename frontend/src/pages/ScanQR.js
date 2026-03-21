// file to open up camera for scanning qr codes
import React, {useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import {Html5Qrcode} from "html5-qrcode";
import { IsUserLoggedIn, IsAuthOutOfDate } from "../utls/UserChecks";
import { auth } from "../config/firebase";

import TitleBar from "../components/TitleBar";
import NavBar from "../components/NavBar";


function ScanQR() {
    const scannerRef = useRef(null);
    const startedRef = useRef(false);

    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const loggedIn = await IsUserLoggedIn();
            const outOfDate = await IsAuthOutOfDate();

            if (!loggedIn){
                navigate("/login");
            }
            else if (outOfDate){
                await auth.signOut();
                navigate("/login");
            }
            else{
                auth.currentUser.reload();
            }
        };

        checkAuth();     
        document.head.getElementsByTagName("title")[0].innerText = "Heartbeat - Scan QR";

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
                console.log("User ID:", decodedText);
                
                const scannedUid = decodedText;
                if(scannerRef.current) {
                    scannerRef.current.stop().catch(() => {});
                }

                navigate("/other/home", {
                    state: {uid: scannedUid}
                });
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

                <TitleBar title={"Heartbeat"} enableBack={true} />
                <NavBar isHome={false} isQR={false} isProfile={false} />
            </div>
        );
}

export default ScanQR;


