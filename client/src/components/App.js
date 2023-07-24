import { Route, Routes } from "react-router-dom";
import DetectPage from "./DetectPage";
import NavBar from "./NavBar";

function App() {
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
