import React, { useEffect } from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import MusicCard from "./MusicCard";
import MusicWave from "./MusicWave";

function DetectPage({ user, detections, setDetectionsCallback }) {
  const [currStatus, setCurrStatus] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDetected, setIsDetected] = useState(false);
  const [songData, setSongData] = useState(null);

  const fetchDetect = async (audioBase64) => {
    let userId = user ? user.sub : "";

    console.log("User logged in? " + userId);
    await fetch("/detect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ audioBase64, userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsDetected(true);
        setSongData(data);
      });
  };

  useEffect(() => {
    if (isDetected) {
      setDetectionsCallback([songData, ...detections]);
    }
  }, [isDetected]);

  const handleRecord = () => {
    setCurrStatus("Listening...");

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
          setCurrStatus("Analyzing the music...");
          setIsAnalyzing(true);

          let fileReader = new FileReader();
          let audioContext = new AudioContext();
          let audioBlob = new Blob(audioChunks, { type: "audio/wav" });

          fileReader.readAsArrayBuffer(audioBlob);
          fileReader.onloadend = () => {
            let arrayBuffer = fileReader.result;
            audioContext.decodeAudioData(arrayBuffer, (buffer) => {
              let base64 = bufferToBase64(buffer);
              console.log(base64);
              fetchDetect(base64);

              //delete
              //setIsDetected(true);
            });
          };
        });

        // stop recording after 5 seconds
        setTimeout(() => {
          mediaRecorder.stop();
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

  const reset = () => {
    setCurrStatus(null);
    setIsAnalyzing(false);
    setIsDetected(false);
    setSongData(null);
  }

  const recordButton = (
    <div className="record" onClick={handleRecord}>
      <FontAwesomeIcon icon={faMicrophone} size="2xl" />
    </div>
  );

  const preDetect = (
    <div className="detect container">
      <h1>Click on the record button below to start detecting songs.</h1>
      {currStatus ? <MusicWave isAnalyzing={isAnalyzing} /> : recordButton}
      <p>{currStatus}</p>
    </div>
  );

  const postDetect = (
    <div className="detect container">
      <h1>Song is detected!</h1>
      <MusicCard songData={songData} />
      <button className="button" onClick={reset}>Detect Another</button>
      {!user && <p>Make sure to login to save your previous detections.</p>}
    </div>
  );

  return <div>{isDetected ? postDetect : preDetect}</div>;
}

export default DetectPage;
