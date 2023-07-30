import React, { useEffect } from "react";
import jwt_decode from "jwt-decode";

function GoogleButton() {
  const handleCallbackResponse = (response) => {
    console.log("testing testing");
  };

  useEffect(() => {
    /* global google */
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleCallbackResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-sign-in-btn"),
      { theme: "outline", size: "large" }
    );
  }, []);

  const handleLogin = () => {
    console.log("Signing in");
  };

  return (
    <div>
      <div id="google-sign-in-btn"></div>
    </div>
  );
}

export default GoogleButton;
