import { Route, Routes } from "react-router-dom";
import DetectPage from "./DetectPage";
import NavBar from "./NavBar";
import { useState } from "react";

function App() {
  const [isLogin, setIsLogin] = useState(false);

  
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<DetectPage />} />
      </Routes>
    </>
  );
}

export default App;
