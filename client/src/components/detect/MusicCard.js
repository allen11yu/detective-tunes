import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faYoutube,
  faSpotify,
  faItunes,
  faDeezer,
} from "@fortawesome/free-brands-svg-icons";
import { faCirclePause, faCirclePlay } from "@fortawesome/free-solid-svg-icons";

function MusicCard({ songData }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewAudio] = useState(new Audio(songData.preview));

  const handlePlayMusic = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      previewAudio.pause();
      previewAudio.currentTime = 0;
    } else {
      previewAudio.volume = 0.2;
      previewAudio.onended = () => {
        setIsPlaying(false);
      }
      previewAudio.play();
    }
  };

  return (
    <div className="music-card-container">
      <div className={isPlaying ? "music-playing": ""}>
        <img src={songData.cover} alt={songData.album}></img>
      </div>
      <div className="center">
        <h2>{songData.title}</h2>
        <h3>{songData.artist}</h3>
      </div>
      <div className="music-card-action">
        <div className="countdown">
          <FontAwesomeIcon icon={isPlaying ? faCirclePause: faCirclePlay} size="2xl" onClick={handlePlayMusic} className="play-btn"/>
        </div>
        <div>
          <a href={songData.youtube} target="_blank" rel="noopener noreferrer" className="hub youtube">
            <FontAwesomeIcon icon={faYoutube} />
          </a>
          <a href={songData.spotify} target="_blank" rel="noopener noreferrer" className="hub spotify">
            <FontAwesomeIcon icon={faSpotify} />
          </a>
          <a href={songData.itunes} target="_blank" rel="noopener noreferrer" className="hub itunes">
            <FontAwesomeIcon icon={faItunes} />
          </a>
          <a href={songData.deezer} target="_blank" rel="noopener noreferrer" className="hub deezer">
            <FontAwesomeIcon icon={faDeezer} />
          </a>
          <a href={songData.shazam} target="_blank" rel="noopener noreferrer" className="hub shazam">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              height="1.4rem"
              width="1.4rem"
            >
              <path d="M12 0C5.373 0-.001 5.371-.001 12c0 6.625 5.374 12 12.001 12s12-5.375 12-12c0-6.629-5.373-12-12-12M9.872 16.736c-1.287 0-2.573-.426-3.561-1.281-1.214-1.049-1.934-2.479-2.029-4.024a5.528 5.528 0 011.436-4.067C6.86 6.101 8.907 4.139 8.993 4.055a1.389 1.389 0 011.966.045c.53.557.512 1.439-.044 1.971-.021.02-2.061 1.976-3.137 3.164a2.761 2.761 0 00-.719 2.027c.049.789.428 1.529 1.07 2.086.844.73 2.51.891 3.553-.043a25.588 25.588 0 001.38-1.386c.52-.567 1.4-.603 1.965-.081.565.52.603 1.402.083 1.969-.035.035-.852.924-1.572 1.572-1.005.902-2.336 1.357-3.666 1.357m8.41-.099c-1.143 1.262-3.189 3.225-3.276 3.309a1.392 1.392 0 11-1.922-2.016c.021-.02 2.063-1.977 3.137-3.166a2.76 2.76 0 00.719-2.027c-.048-.789-.428-1.529-1.07-2.084-.844-.73-2.51-.893-3.552.044a23.972 23.972 0 00-1.38 1.384 1.391 1.391 0 11-2.048-1.887c.034-.037.85-.926 1.571-1.573 1.979-1.778 5.221-1.813 7.227-.077 1.214 1.051 1.935 2.48 2.028 4.025a5.527 5.527 0 01-1.434 4.068" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default MusicCard;
