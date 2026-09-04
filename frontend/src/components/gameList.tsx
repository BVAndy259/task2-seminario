import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api, { API_URL } from "../services/api";
import GameForm from "./gameForm";

interface Game {
  g_id: number;
  title: string;
  platform: string;
  game_status: string;
  homepage_url: string;
}

const GamesList = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadGames = async () => {
    try {
      const response = await api.get("/games");
      setGames(response.data);
    } catch (error) {
      console.error("Error al cargar los juegos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  if (loading) return <p className="loading">Cargando tu biblioteca...</p>;

  return (
    <main className="page">
      <section className="intro">
        <div>
          <p className="eyebrow">Tu biblioteca personal</p>
          <h1>Juega.<br />Registra.<br />Recuerda.</h1>
          <p className="intro-text">Un espacio sencillo para guardar tus juegos y llevar la cuenta de cada hora invertida en ellos.</p>
        </div>
        <GameForm onAddedGame={loadGames} />
      </section>

      <section>
        <div className="library-heading">
          <h2>Tu colección</h2>
          <span className="library-count">{games.length} {games.length === 1 ? "juego" : "juegos"}</span>
        </div>
        <div className="game-grid">
          {games.length === 0 && <p className="empty-state">Todavía no hay juegos. Añade el primero a tu colección.</p>}
          {games.map((game) => (
            <article className="game-card" key={game.g_id}>
              <div className="cover-frame">
                {game.homepage_url ? <img src={`${API_URL}${game.homepage_url}`} alt={`Portada de ${game.title}`} /> : <span className="cover-placeholder">Sin portada todavía</span>}
              </div>
              <div className="game-card-body">
                <h3>{game.title}</h3>
                <div className="game-meta"><span>{game.platform}</span><span className="status">{game.game_status}</span></div>
                <button className="card-link" onClick={() => navigate(`/game/${game.g_id}`)}>Ver sesiones <span aria-hidden="true">→</span></button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default GamesList;
