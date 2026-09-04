import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { API_URL } from "../services/api";

interface Game {
  g_id: number;
  title: string;
  platform: string;
  homepage_url: string;
}

interface TimeLog {
  tl_id: number;
  hours_played: string;
  registration_date: string;
  notes: string;
}

const GameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState<Game | null>(null);
  const [historial, setHistorial] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);

  const [hours, setHours] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const loadDetails = async () => {
    try {
      const response = await api.get(`/register/games/${id}`);
      setGame(response.data.game);
      setHistorial(response.data.historial);
    } catch (error) {
      console.error("Error al cargar el historial", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/register", {
        game_id: Number(id),
        hours_played: Number(hours),
        registration_date: date,
        notes: notes,
      });
      setHours("");
      setDate("");
      setNotes("");
      loadDetails();
    } catch (error) {
      alert("Error al guardar las horas");
    }
  };

  if (loading) return <p>Cargando detalles...</p>;
  if (!game) return <p>Juego no encontrado</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <button onClick={() => navigate("/")} style={{ marginBottom: "20px" }}>
        ← Volver a la lista
      </button>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
          alignItems: "center",
        }}
      >
        {game.homepage_url && (
          <img
            src={`${API_URL}${game.homepage_url}`}
            alt="Portada"
            style={{
              width: "150px",
              height: "200px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        )}
        <div>
          <h1>{game.title}</h1>
          <p>
            <strong>Plataforma:</strong> {game.platform}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#f5f5f5",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "30px",
          color: "#333",
        }}
      >
        <h3>Registrar nueva sesión</h3>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="number"
            step="0.1"
            placeholder="Horas (ej. 2.5)"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Notas (opcional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit">Guardar sesión</button>
        </div>
      </form>

      <h3>Historial de Sesiones</h3>
      {historial.length === 0 ? (
        <p>Aún no hay horas registradas para este juego.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {historial.map((register) => (
            <li
              key={register.tl_id}
              style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}
            >
              <strong>{register.hours_played} horas</strong> -{" "}
                {new Date(register.registration_date).toLocaleDateString()}
              {register.notes && (
                <p style={{ margin: "5px 0 0 0", color: "#666" }}>
                  {register.notes}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GameDetail;
