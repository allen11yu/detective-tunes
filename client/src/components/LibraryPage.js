import React from "react";
import LibraryMusicCard from "./LibraryMusicCard";

function LibraryPage({ user, detections }) {
  const needLogin = (
    <div>
      <h1 className="center">Here are your previous detections.</h1>
      <p className="center margin-top-sm">
        Please log in to view your library.
      </p>
    </div>
  );

  let musicCards = [];
  musicCards = detections.map((music, index) => {
    return <LibraryMusicCard songData={music} index={index} />;
  });

  return (
    <div className="library">
      {user ? (
        <div>
          <h1 className="center">
            Hello {user.name}! Here are your previous detections.
          </h1>
          <div className="lib-music-card-container">{musicCards}</div>
        </div>
      ) : (
        needLogin
      )}
    </div>
  );
}

export default LibraryPage;
