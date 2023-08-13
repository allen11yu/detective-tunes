import React from "react";
import { Link } from "react-router-dom";
import GoogleOAuth from "./GoogleOAuth";

function NavBar({
  user,
  setUserCallback,
  setDetectionsCallback
}) {
  return (
    <nav>
      <ul>
        <li>
          <Link className="link" to="/">
            Detect
          </Link>
        </li>
        <li>
          <Link className="link" to="/library">
            Library
          </Link>
        </li>
      </ul>
      <GoogleOAuth
        user={user}
        setUserCallback={setUserCallback}
        setDetectionsCallback={setDetectionsCallback}
      />
    </nav>
  );
}

export default NavBar;
