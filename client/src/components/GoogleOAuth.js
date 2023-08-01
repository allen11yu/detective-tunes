import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

function GoogleOAuth({ isLogin, setIsLoginCallback, user, setUserCallback }) {
  const fetchVerify = async (credential) => {
    await fetch("/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credential }),
    })
      .then((res) => res.json())
      .then((userData) => {
        console.log(userData);
        setUserCallback(userData);

        // set local storage id
        localStorage.setItem("userid", userData.sub);
      });
  };

  const handleSuccessLogin = async (credentialResponse) => {
    setIsLoginCallback(true);
    fetchVerify(credentialResponse.credential);
  };

  const handleFailedLogin = () => {
    console.log("login failed");
  };

  const handleLogout = () => {
    console.log("logging out");
    setUserCallback(null);

    // delete local storage id
    localStorage.removeItem("userid");
  };

  const login = (
    <GoogleLogin
      shape="circle"
      onSuccess={handleSuccessLogin}
      onError={handleFailedLogin}
    />
  );

  return (
    <div>
      {user ? (
        <div className="profile">
          <img src={user.picture} alt="Profile picture"></img>
          <span onClick={handleLogout}>Logout</span>
        </div>
      ) : (
        login
      )}
    </div>
  );
}

export default GoogleOAuth;
