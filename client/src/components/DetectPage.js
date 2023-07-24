import React from "react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import MusicCard from "./MusicCard";

function DetectPage() {
  const [currStatus, setCurrStatus] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDetected, setIsDetected] = useState(false);

  const handleRecord = () => {
    // start record
    setCurrStatus("Listening...");

    // setting audio constraints
    const audioConstraints = {
      audio: {
        channelCount: 1,
        sampleRate: { exact: 44100 },
        sampleSize: 16,
      },
    };

    // recording
    navigator.mediaDevices
      .getUserMedia({ audio: audioConstraints, video: false })
      .then((stream) => {
        let mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        let audioChunks = [];
        mediaRecorder.addEventListener("dataavailable", (event) => {
          audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
          let fileReader = new FileReader();
          let audioContext = new AudioContext();
          let audioBlob = new Blob(audioChunks, { type: "audio/wav" });

          fileReader.readAsArrayBuffer(audioBlob);
          fileReader.onloadend = () => {
            let arrayBuffer = fileReader.result;
            audioContext.decodeAudioData(arrayBuffer, (buffer) => {
              let base64 = bufferToBase64(buffer);
              console.log(base64);
            });
          };
        });

        // stop recording after 5 seconds
        setTimeout(() => {
          mediaRecorder.stop();
          console.log("recoding stopped after 5 seconds");

          setCurrStatus("Analyzing the music...");
          setIsAnalyzing(true);

          // fetch
        }, 5000);
      });
  };

  const bufferToBase64 = (buffer) => {
    let channelData = buffer.getChannelData(0);
    let sampleNum = channelData.length;
    let rawData = new Int16Array(sampleNum);

    for (let i = 0; i < sampleNum; i++) {
      let sampleValue = channelData[i];
      rawData[i] =
        sampleValue < 0 ? sampleValue * 0x8000 : sampleValue * 0x7fff;
    }

    const binaryString = rawData.reduce(
      (acc, val) => acc + String.fromCharCode(val & 0xff, (val >> 8) & 0xff),
      ""
    );
    return btoa(binaryString);
  };

  const recordButton = (
    <div className="record" onClick={handleRecord}>
      <FontAwesomeIcon icon={faMicrophone} size="2xl" />
    </div>
  );

  const musicWave = (
    <div className="music-wave">
      <div
        className="wave-line"
        style={{ backgroundColor: isAnalyzing && "#3A86FF" }}
      ></div>
      <div
        className="wave-line"
        style={{ backgroundColor: isAnalyzing && "#8338EC" }}
      ></div>
      <div
        className="wave-line"
        style={{ backgroundColor: isAnalyzing && "#FF006E" }}
      ></div>
      <div
        className="wave-line"
        style={{ backgroundColor: isAnalyzing && "#FB5607" }}
      ></div>
      <div
        className="wave-line"
        style={{ backgroundColor: isAnalyzing && "#FFBE0B" }}
      ></div>
      <div
        className="wave-line"
        style={{ backgroundColor: isAnalyzing && "#FFBE0B" }}
      ></div>
      <div
        className="wave-line"
        style={{ backgroundColor: isAnalyzing && "#FB5607" }}
      ></div>
      <div
        className="wave-line"
        style={{ backgroundColor: isAnalyzing && "#FF006E" }}
      ></div>
      <div
        className="wave-line"
        style={{ backgroundColor: isAnalyzing && "#8338EC" }}
      ></div>
      <div
        className="wave-line"
        style={{ backgroundColor: isAnalyzing && "#3A86FF" }}
      ></div>
    </div>
  );

  const preDetect = (
    <div className="detect container">
      <h1>Hey there, XXX!</h1>
      <h2>Click on the record button below to start detecting songs.</h2>
      {currStatus ? musicWave : recordButton}
      <p className="status">{currStatus}</p>
    </div>
  );

  const postDetect = (
    <div className="detect container">
      <h1>Detected!</h1>
      <MusicCard />
    </div>
  );

  return <div>{isDetected ? postDetect : preDetect}</div>;
}

export default DetectPage;
