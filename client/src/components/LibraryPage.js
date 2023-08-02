import React from "react";

function LibraryPage({ user }) {
  // fetch library

  const needLogin = (
    <div>
      <p>Please log in to view your library.</p>
    </div>
  );

  return (
    <div className="library">
      <h1 className="center">Library page!</h1>
      {user ? <div>hello!</div> : needLogin}
    </div>
  );
}

export default LibraryPage;
