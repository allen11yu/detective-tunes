import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import MusicCard from "./MusicCard";
import MusicWave from "./MusicWave";

function DetectPage() {
  const [currStatus, setCurrStatus] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDetected, setIsDetected] = useState(false);
  const [songData, setSongData] = useState({
    title:
      "Calling (feat. A Boogie wit da Hoodie) [Spider-Man: Across the Spider-Verse]",
    artist: "Metro Boomin, Swae Lee & NAV",
    cover:
      "https://is3-ssl.mzstatic.com/image/thumb/Music116/v4/c9/ca/6b/c9ca6b51-87a9-4a13-d37f-24535687023d/23UMGIM63882.rgb.jpg/400x400cc.jpg",
    youtubeLink: "https://youtu.be/nN4KoOOUAnA?autoplay=1",
    shazamLink:
      "https://www.shazam.com/track/668228218/calling-feat-a-boogie-wit-da-hoodie-spider-man-across",
    itunesLink:
      "https://itunes.apple.com/us/album/calling-feat-a-boogie-wit-da-hoodie-spider-man-across/1690685331?i=1690685617&mttnagencyid=s2n&mttnsiteid=125115&mttn3pid=Apple-Shazam&mttnsub1=Shazam_ios&mttnsub2=5348615A-616D-3235-3830-44754D6D5973&itscg=30201&app=itunes&itsct=Shazam_ios",
    spotifyLink:
      "https://open.spotify.com/search/Calling%20%28feat.%20A%20Boogie%20wit%20da%20Hoodie%29%20%5BSpider-Man%3A%20Across%20the%20Spider-Verse%5D%20Metro%20Boomin",
    previewLink:
      "https://cdns-preview-3.dzcdn.net/stream/c-3ae9b75df867da9c7483dd239c63ee58-6.mp3",
    deezerLink: "https://www.deezer.com/track/2309928795",
    album:
      "METRO BOOMIN PRESENTS SPIDER-MAN: ACROSS THE SPIDER-VERSE (SOUNDTRACK FROM AND INSPIRED BY THE MOTION PICTURE)",
  });

  const fetchDetect = async (audioBase64) => {
    await fetch("/detect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ audioBase64 }),
    })
      .then((res) => res.json())
      .then((data) => {
        handleSuccessDetect(data);
      });
  };

  const handleSuccessDetect = (data) => {
    setIsDetected(true);
    setSongData(data);
  };

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
              //fetchDetect(base64);

              //delete
              setIsDetected(true);
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

  const recordButton = (
    <div className="record" onClick={handleRecord}>
      <FontAwesomeIcon icon={faMicrophone} size="2xl" />
    </div>
  );

  const preDetect = (
    <div className="detect container">
      <h1>Click on the record button below to start detecting songs.</h1>
      {currStatus ? <MusicWave isAnalyzing={isAnalyzing} /> : recordButton}
      <p className="margin-top-sm">{currStatus}</p>
    </div>
  );

  const postDetect = (
    <div className="detect container">
      <h1>Song is detected!</h1>
      <MusicCard songData={songData} />
      <p className="margin-top-sm">
        Make sure to login to save your previous detections.
      </p>
    </div>
  );

  return <div>{isDetected ? postDetect : preDetect}</div>;
}

export default DetectPage;
