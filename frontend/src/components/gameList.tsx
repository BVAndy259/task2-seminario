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
  const [loading, setLoading] = useState<boolean>(true);
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

  if (loading) return <p>Cargando juegos...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Mi Bitácora de Juegos</h2>

      <GameForm onAddedGame={loadGames} />

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {games.map((game) => (
          <div
            key={game.g_id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "8px",
              width: "200px",
            }}
          >
            {game.homepage_url && (
              <img
                src={`${API_URL}${game.homepage_url}`}
                alt={`Portada de ${game.title}`}
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
            )}
            <h3>{game.title}</h3>
            <p>
              <strong>Plataforma:</strong> {game.platform}
            </p>
            <p>
              <strong>Estado:</strong> {game.game_status}
            </p>

            <button
              onClick={() => navigate(`/game/${game.g_id}`)}
              style={{ width: "100%", padding: "8px", cursor: "pointer" }}
            >
              Ver historial de horas
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesList;
