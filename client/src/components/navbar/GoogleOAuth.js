import React from "react";
import { GoogleLogin } from "@react-oauth/google";

function GoogleOAuth({
  user,
  setUserCallback,
  detections,
  setDetectionsCallback,
}) {
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
        setUserCallback(userData);
        localStorage.setItem("userid", userData.sub);
        addToLibrary(userData.sub);
        fetchLibrary(userData.sub);
      })
      .catch(handleLogout);
  };

  const addToLibrary = async (userId) => {
    for (const songData of detections) {
      await fetch("/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ songData, userId }),
      });
    }
  };

  const fetchLibrary = async (userId) => {
    await fetch("/library/" + userId)
      .then((res) => res.json())
      .then((library) => {
        setDetectionsCallback(library);
      });
  };

  const handleSuccessLogin = async (credentialResponse) => {
    fetchVerify(credentialResponse.credential);
  };

  const handleLogout = () => {
    setUserCallback(null);
    setDetectionsCallback([]);
    localStorage.removeItem("userid");
  };

  const login = (
    <GoogleLogin
      shape="circle"
      onSuccess={handleSuccessLogin}
      onError={handleLogout}
    />
  );

  return (
    <div>
      {user ? (
        <div className="profile">
          <img src={user.picture} alt="User profile"></img>
          <span onClick={handleLogout}>Logout</span>
        </div>
      ) : (
        login
      )}
    </div>
  );
}

export default GoogleOAuth;
