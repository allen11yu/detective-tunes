import { Route, Routes } from "react-router-dom";
import DetectPage from "./DetectPage";
import LibraryPage from "./LibraryPage";
import NavBar from "./NavBar";
import { useEffect, useState } from "react";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);

  const fetchUser = async (userid) => {
    await fetch("/user/" + userid)
      .then((res) => res.json())
      .then((userData) => {
        setUser(userData);
      });
  };

  useEffect(() => {
    let userid = localStorage.getItem("userid");
    if (userid) {
      fetchUser(userid);
    }
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
        <Route path="/" element={<DetectPage user={user} />} />
        <Route path="/library" element={<LibraryPage user={user} />} />
      </Routes>
    </>
  );
}

export default App;
