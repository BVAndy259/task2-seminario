import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { API_URL } from "../services/api";

interface Game {
  g_id: number;
  title: string;
  platform: string;
  game_status: string;
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
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editPlatform, setEditPlatform] = useState("");
  const [editStatus, setEditStatus] = useState("Jugando");
  const [editCover, setEditCover] = useState<File | null>(null);

  const loadDetails = async () => {
    try {
      const response = await api.get(`/register/games/${id}`);
      setGame(response.data.game);
      setHistorial(response.data.historial);
      setEditTitle(response.data.game.title);
      setEditPlatform(response.data.game.platform);
      setEditStatus(response.data.game.game_status);
    } catch (error) {
      console.error("Error al cargar el historial", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDetails(); }, [id]);

  const openEdit = () => {
    if (!game) return;
    setEditTitle(game.title);
    setEditPlatform(game.platform);
    setEditStatus(game.game_status);
    setEditCover(null);
    setIsEditOpen(true);
  };

  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("platform", editPlatform);
      formData.append("status_game", editStatus);
      if (editCover) formData.append("portada", editCover);
      await api.put(`/games/${id}`, formData);
      setIsEditOpen(false);
      loadDetails();
    } catch (error) {
      console.error("Error al actualizar el juego", error);
      alert("Error al actualizar el juego");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Eliminar este juego y todo su historial?")) return;
    try {
      await api.delete(`/games/${id}`);
      navigate("/");
    } catch (error) {
      console.error("Error al eliminar el juego", error);
      alert("Error al eliminar el juego");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/register", {
        game_id: Number(id),
        hours_played: Number(hours),
        registration_date: date,
        notes,
      });
      setHours("");
      setDate("");
      setNotes("");
      setIsRegisterOpen(false);
      loadDetails();
    } catch (error) {
      console.error("Error al guardar la sesión", error);
      alert("Error al guardar las horas");
    }
  };

  if (loading) return <p className="loading">Cargando detalles...</p>;
  if (!game) return <p className="loading">Juego no encontrado</p>;

  return (
    <main className="detail-page">
      <button className="back-link" onClick={() => navigate("/")}>← Volver a la biblioteca</button>
      <section className="detail-hero">
        <div className="cover-frame">
          {game.homepage_url ? <img src={`${API_URL}${game.homepage_url}`} alt={`Portada de ${game.title}`} /> : <span className="cover-placeholder">Sin portada todavía</span>}
        </div>
        <div className="detail-copy">
          <p className="eyebrow">Ficha del juego</p>
          <h1>{game.title}</h1>
          <p className="detail-platform">Jugando en <strong>{game.platform}</strong> · {game.game_status}</p>
          <div className="detail-actions">
            <button className="session-open-button" onClick={openEdit}>Editar juego</button>
            <button className="danger-button" onClick={handleDelete}>Eliminar</button>
          </div>
        </div>
      </section>
      <section className="session-layout">
        <div className="history-panel">
          <div className="history-heading">
            <h2>Historial de sesiones</h2>
            <button className="session-open-button" onClick={() => setIsRegisterOpen(true)}>+ Registrar sesión</button>
          </div>
          {historial.length === 0 ? <p className="empty-state">Aún no hay horas registradas para este juego.</p> : (
            <ul className="history-list">
              {historial.map((register) => (
                <li className="history-item" key={register.tl_id}>
                  <span className="history-date">{new Date(register.registration_date).toLocaleDateString()}</span>
                  <div className="history-entry">
                    <span className="history-hours">{register.hours_played} horas</span>
                    {register.notes && <p className="history-note">{register.notes}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      {isRegisterOpen && (
        <div className="modal-backdrop" onClick={() => setIsRegisterOpen(false)}>
          <div className="session-modal" role="dialog" aria-modal="true" aria-labelledby="session-modal-title" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" aria-label="Cerrar" onClick={() => setIsRegisterOpen(false)}>×</button>
            <p className="eyebrow">Nueva actividad</p>
            <h2 id="session-modal-title">Registrar sesión</h2>
            <form onSubmit={handleSubmit} className="session-form">
              <input type="number" step="0.1" placeholder="Horas jugadas" value={hours} onChange={(e) => setHours(e.target.value)} required autoFocus />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              <input type="text" placeholder="Notas (opcional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
              <button type="submit">Guardar sesión</button>
            </form>
          </div>
        </div>
      )}
      {isEditOpen && (
        <div className="modal-backdrop" onClick={() => setIsEditOpen(false)}>
          <div className="session-modal" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" aria-label="Cerrar" onClick={() => setIsEditOpen(false)}>×</button>
            <p className="eyebrow">Editar biblioteca</p>
            <h2 id="edit-modal-title">Editar juego</h2>
            <form onSubmit={handleEdit} className="session-form">
              <input type="text" placeholder="Título" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required autoFocus />
              <input type="text" placeholder="Plataforma" value={editPlatform} onChange={(e) => setEditPlatform(e.target.value)} required />
              <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                <option value="Jugando">Jugando</option>
                <option value="Completado">Completado</option>
                <option value="Abandonado">Abandonado</option>
              </select>
              <input type="file" accept="image/*" onChange={(e) => setEditCover(e.target.files?.[0] ?? null)} />
              <button type="submit">Guardar cambios</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default GameDetail;
