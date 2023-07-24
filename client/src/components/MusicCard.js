import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube, faSpotify, faItunes  } from "@fortawesome/free-brands-svg-icons";

function MusicCard() {
  const coverUrl = "https://i.scdn.co/image/ab67616d00001e02e2e352d89826aef6dbd5ff8f";
  const songName = "Sunflower";
  const songArtist = "Post Malone, Swae Lee";
  const album = "Spider-man";

  return (
    <div className="music-card-container">
      <div><img src={coverUrl} alt={album} /></div>
      <div className="song-info-container">
        <div>
          <h2>{songName}</h2>
          <h3>{songArtist}</h3>
        </div>
        <div>
          <h2>Listen on</h2>
          <div>
            <FontAwesomeIcon icon={faYoutube} />
            <FontAwesomeIcon icon={faYoutube} />
            <FontAwesomeIcon icon={faSpotify} />
            <FontAwesomeIcon icon={faItunes} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MusicCard;