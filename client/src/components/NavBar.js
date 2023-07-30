import React from "react";
import { Link } from "react-router-dom";
import GoogleButton from "./GoogleButton";

function NavBar({ isLogin, setIsLoginCallback }) {
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
      <GoogleButton />
    </nav>
  );
}

export default NavBar;
