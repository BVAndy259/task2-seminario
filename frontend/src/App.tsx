import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import GamesList from "./components/gameList";
import GameDetails from "./components/gameDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GamesList />} />
        <Route path="/game/:id" element={<GameDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
