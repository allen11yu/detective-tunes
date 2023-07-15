import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import MusicCard from "./MusicCard";

function DetectPage() {
    const [currStatus, setCurrStatus] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isDetected, setIsDetected] = useState(false);

    const handleRecord = () => {
        console.log("recording!");

        // start record
        setCurrStatus("Listening...");

        // after 5 seconds
        // set current status to Analyzing the music
        setCurrStatus("Analyzing the music...");
        setIsAnalyzing(true);
        //setIsDetected(true);
    };

    const recordButton = (
        <div className="record" onClick={handleRecord}><FontAwesomeIcon icon={faMicrophone} size="2xl" /></div>
    );

    const musicWave = (
        <div className="music-wave">
            <div className="wave-line" style={{backgroundColor: isAnalyzing && "#3A86FF"}}></div>
            <div className="wave-line" style={{backgroundColor: isAnalyzing && "#8338EC"}}></div>
            <div className="wave-line" style={{backgroundColor: isAnalyzing && "#FF006E"}}></div>
            <div className="wave-line" style={{backgroundColor: isAnalyzing && "#FB5607"}}></div>
            <div className="wave-line" style={{backgroundColor: isAnalyzing && "#FFBE0B"}}></div>
            <div className="wave-line" style={{backgroundColor: isAnalyzing && "#FFBE0B"}}></div>
            <div className="wave-line" style={{backgroundColor: isAnalyzing && "#FB5607"}}></div>
            <div className="wave-line" style={{backgroundColor: isAnalyzing && "#FF006E"}}></div>
            <div className="wave-line" style={{backgroundColor: isAnalyzing && "#8338EC"}}></div>
            <div className="wave-line" style={{backgroundColor: isAnalyzing && "#3A86FF"}}></div>
        </div>
    );

    const preDetect = (
        <div className="detect container">
            <h1>Hey there, XXX!</h1>
            <h2>Click on the record button below to start detecting songs.</h2>
            {currStatus ? musicWave : recordButton}
            <p>{currStatus}</p>
        </div>
    );

    const postDetect = (
        <div className="detect container">
            <h1>Detected!</h1>
            <MusicCard />
        </div>
    );


    return (
        <div>
            {isDetected ? postDetect : preDetect}
        </div>
    );
}

export default DetectPage;