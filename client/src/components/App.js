import { Route, Routes } from "react-router-dom";
import DetectPage from "./DetectPage";
import LibraryPage from "./LibraryPage";
import NavBar from "./NavBar";
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [detections, setDetections] = useState([]);

  const fetchUser = async (userId) => {
    await fetch("/user/" + userId)
      .then((res) => res.json())
      .then((userData) => {
        setUser(userData);
      });
  };

  const fetchLibrary = async (userId) => {
    await fetch("/library/" + userId)
      .then((res) => res.json())
      .then((library) => {
        setDetections(library);
      });
  };

  useEffect(() => {
    let userId = localStorage.getItem("userid");
    if (userId) {
      fetchUser(userId);
      fetchLibrary(userId);
    }
  }, []);

  return (
    <>
      <NavBar
        user={user}
        setUserCallback={setUser}
        detections={detections}
        setDetectionsCallback={setDetections}
      />
      <Routes>
        <Route
          path="/"
          element={
            <DetectPage
              user={user}
              detections={detections}
              setDetectionsCallback={setDetections}
            />
          }
        />
        <Route
          path="/library"
          element={
            <LibraryPage
              user={user}
              detections={detections}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
