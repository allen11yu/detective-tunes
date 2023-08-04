import React from "react";

function LibraryMusicCards({ detections }) {
  console.log("detections");
  console.log(detections);
  return <div></div>;
}

function LibraryPage({ user, detections, setDetectionsCallback }) {
  const needLogin = (
    <div>
      <h1 className="center">Here are your previous detections.</h1>
      <p className="center margin-top-sm">
        Please log in to view your library.
      </p>
    </div>
  );

  return (
    <div className="library">
      {user ? (
        <div>
          <h1 className="center">
            Hello {user.name}! Here are your previous detections.
          </h1>
          <div className="library-list">
            <LibraryMusicCards detections={detections} />
          </div>
        </div>
      ) : (
        needLogin
      )}
    </div>
  );
}

export default LibraryPage;
