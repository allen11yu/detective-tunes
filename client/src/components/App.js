import { Route, Routes } from "react-router-dom";
import DetectPage from "./DetectPage";
import LibraryPage from "./LibraryPage";
import NavBar from "./NavBar";
import { useEffect, useState } from "react";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);

  const fetchUser = async (userid) => {
    await fetch("/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userid }),
    })
      .then((res) => res.json())
      .then((userData) => {
        console.log(userData);
        setUser(userData);
      });
  };

  useEffect(() => {
    let userid = localStorage.getItem("userid");
    console.log(userid);
    if (userid) {
      fetchUser(userid);
    } else {
      console.log("no user id found");
    }
    // fetch post userid
    // and set user
  }, []);

  return (
    <>
      <NavBar
        isLogin={isLogin}
        setIsLoginCallback={setIsLogin}
        user={user}
        setUserCallback={setUser}
      />
      <Routes>
        <Route path="/" element={<DetectPage />} />
        <Route path="/library" element={<LibraryPage isLogin={isLogin} />} />
      </Routes>
    </>
  );
}

export default App;
