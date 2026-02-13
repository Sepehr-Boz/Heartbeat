// file to open up camera for scanning qr codes
import React, {useEffect, useState} from "react";
import {Html5Qrcode} from "html5-qrcode";

function ScanQR() {
    useEffect(() => {
        const scanner = new Html5Qrcode("reader");

        scanner.start(
            {facingMode: "environment"},
            {
                fps: 10,
                qrbox: 200,
            },
            (decodedText) => {
                console.log("Medical Data:", decodedText);
                scanner.stop()
            },
            (error) => {
                console.log("Error scanning data")
            }
        );
        
        return () => {
            scanner.stop().catch(() => {});
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


