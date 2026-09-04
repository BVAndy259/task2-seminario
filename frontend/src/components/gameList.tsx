import { useEffect, useState } from "react";
import api, { API_URL } from "../services/api";

interface Game {
  id: number;
  title: string;
  platform: string;
  status_game: string;
  homepage_url: string;
}

const GamesList = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {games.map((game) => (
          <div
            key={game.id}
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
              <strong>Estado:</strong> {game.status_game}
            </p>

            <button
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
