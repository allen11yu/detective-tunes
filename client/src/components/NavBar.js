import React from "react";
import { Link } from "react-router-dom";
import GoogleOAuth from "./GoogleOAuth";

function NavBar({
  isLogin,
  setIsLoginCallback,
  user,
  setUserCallback,
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
        isLogin={isLogin}
        setIsLoginCallback={setIsLoginCallback}
        user={user}
        setUserCallback={setUserCallback}
      />
    </nav>
  );
}

export default NavBar;
