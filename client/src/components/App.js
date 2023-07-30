import { Route, Routes } from "react-router-dom";
import DetectPage from "./DetectPage";
import LibraryPage from "./LibraryPage";
import NavBar from "./NavBar";
import { useState } from "react";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  
  return (
    <>
      <NavBar isLogin={isLogin} setIsLoginCallback={setIsLogin} />
      <Routes>
        <Route path="/" element={<DetectPage />} />
        <Route path="/library" element={<LibraryPage isLogin={isLogin} />} />
      </Routes>
    </>
  );
}

export default App;
