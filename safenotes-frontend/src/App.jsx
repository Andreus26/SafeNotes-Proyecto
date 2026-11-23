import { useEffect, useState } from "react";
import ListaNotas from "./components/ListaNotas";

const API_URL = "http://localhost:8080/api/notas";

export default function App() {
  const [notas, setNotas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarNotas() {
      try {
        setCargando(true);
        setError("");
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) {
          throw new Error(`Error HTTP ${respuesta.status}`);
        }
        const data = await respuesta.json();
        setNotas(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("No se pudieron cargar las notas desde el backend (" + err.message + ")");
      } finally {
        setCargando(false);
      }
    }

    cargarNotas();
  }, []);

  return (
    <main style={{ maxWidth: "680px", margin: "40px auto", padding: "0 16px", fontFamily: "system-ui, sans-serif" }}>
      <h1>Safe Notes</h1>
      <p>Notas cargadas desde Spring Boot (<code>/api/notas</code>)</p>

      {cargando && <p>Cargando notas...</p>}
      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
      {!cargando && !error && <ListaNotas notas={notas} />}
    </main>
  );
}