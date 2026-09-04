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
    if (e.target.files?.length) setHomepage(e.target.files[0]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("platform", platform);
      formData.append("status_game", status);
      if (homepage) formData.append("portada", homepage);
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
    <form onSubmit={handleSubmit} className="form-panel">
      <h2>Guardar un juego</h2>
      <p className="form-hint">Añade una nueva aventura a tu biblioteca.</p>
      <div className="field">
        <label htmlFor="title">Título</label>
        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="field">
        <label htmlFor="platform">Plataforma</label>
        <input id="platform" type="text" value={platform} onChange={(e) => setPlatform(e.target.value)} required />
      </div>
      <div className="field">
        <label htmlFor="status">Estado</label>
        <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Jugando">Jugando</option>
          <option value="Completado">Completado</option>
          <option value="Abandonado">Abandonado</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="homepage">Imagen de portada</label>
        <input id="homepage" className="file-input" type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <button className="primary-button" type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar juego"}
      </button>
    </form>
  );
};

export default GameForm;
