import React from "react";

function MusicWave({ isAnalyzing }) {
  return (
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
}

export default MusicWave;
