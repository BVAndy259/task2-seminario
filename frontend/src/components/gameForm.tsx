import { useState, type ChangeEvent, type FormEvent } from "react";
import api from "../services/api";

interface Props {
  onAddedGame: () => void;
}

const GameForm = ({ onAddedGame }: Props) => {
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState("Jugando");
  const [homepage, setHomepage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setHomepage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("platform", platform);
      formData.append("status_game", status);

      if (homepage) {
        formData.append("portada", homepage);
      }

      await api.post("/games", formData);

      setTitle("");
      setPlatform("");
      setStatus("Jugando");
      setHomepage(null);

      onAddedGame();
    } catch (error) {
      console.error("Error al guardar el juego", error);
      alert("Hubo un error al guardar el juego");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "20px",
        maxWidth: "400px",
      }}
    >
      <h3>Agregar Nuevo Juego</h3>

      <div style={{ marginBottom: "10px" }}>
        <label>Título:</label>
        <br />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Plataforma:</label>
        <br />
        <input
          type="text"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          required
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Estado:</label>
        <br />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ width: "100%" }}
        >
          <option value="Jugando">Jugando</option>
          <option value="Completado">Completado</option>
          <option value="Abandonado">Abandonado</option>
        </select>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Imagen de Portada:</label>
        <br />
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Guardando..." : "Guardar Juego"}
      </button>
    </form>
  );
};

export default GameForm;
