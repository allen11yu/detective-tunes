import { Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import DetectPage from "./DetectPage";
import NavBar from "./NavBar";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/detect" element={<DetectPage />} />
      </Routes>
    </>
  );
}

export default App;
