import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import GamesList from "./components/gameList";
import GameDetails from "./components/gameDetail";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="topbar">
          <span className="brand"><span className="brand-mark">/</span>mi bitácora</span>
          <span className="topbar-note">juegos · sesiones · recuerdos</span>
        </header>
        <Routes>
          <Route path="/" element={<GamesList />} />
          <Route path="/game/:id" element={<GameDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
