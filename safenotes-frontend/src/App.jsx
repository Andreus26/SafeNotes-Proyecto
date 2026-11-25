import { useEffect, useState } from "react";
import ListaNotas from "./components/ListaNotas";
import "./App.css";

const API_URL = "http://localhost:8080/api/notas";

function obtenerIdNota(nota) {
  return nota?.id ?? nota?.nota?.id;
}

function extraerDatosNota(nota) {
  if (nota?.nota && typeof nota.nota === "object") {
    return nota.nota;
  }
  return nota;
}

export default function App() {
  const [notas, setNotas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState("General");
  const [importante, setImportante] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [soloImportantes, setSoloImportantes] = useState(false);

  async function cargarNotas() {
    try {
      setCargando(true);
      setError("");
      const respuesta = await fetch(API_URL);
      if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
      }
      const data = await respuesta.json();
      const lista = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data?.notas)
            ? data.notas
            : [];
      setNotas(lista);
    } catch (err) {
      setError("No se pudieron cargar las notas: " + err.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarNotas();
  }, []);

  async function manejarGuardar(e) {
    e.preventDefault();
    if (!texto.trim()) {
      setMensaje("Escribe el texto de la nota antes de guardar.");
      return;
    }

    const cuerpoPeticion = {
      texto: texto.trim(),
      categoria: categoria.trim() || "General",
      importante,
    };

    try {
      setGuardando(true);
      setMensaje("");

      const respuesta = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpoPeticion),
      });

      if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
      }

      await cargarNotas();
      setTexto("");
      setCategoria("General");
      setImportante(false);
      setMensaje("Nota guardada correctamente.");
    } catch (err) {
      setMensaje("No se pudo guardar en el servidor: " + err.message);
    } finally {
      setGuardando(false);
    }
  }

  async function editarNota(idNota, datosActualizados) {
    if (!idNota) return;

    const textoLimpio = String(datosActualizados?.texto ?? "").trim();
    if (!textoLimpio) {
      setMensaje("El texto de la nota no puede estar vacío.");
      return false;
    }

    const cuerpoPeticion = {
      texto: textoLimpio,
      categoria: String(datosActualizados?.categoria ?? "General").trim() || "General",
      importante: Boolean(datosActualizados?.importante),
    };

    try {
      setMensaje("");
      const respuesta = await fetch(`${API_URL}/${idNota}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpoPeticion),
      });

      if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
      }

      let actualizadaServidor = null;
      try {
        actualizadaServidor = await respuesta.json();
      } catch {
        actualizadaServidor = null;
      }

      setNotas((prev) =>
        prev.map((nota) => {
          const actualId = obtenerIdNota(nota);
          if (actualId !== idNota) return nota;

          const base = extraerDatosNota(nota);
          const merged = {
            ...base,
            ...cuerpoPeticion,
            ...(actualizadaServidor && typeof actualizadaServidor === "object"
              ? extraerDatosNota(actualizadaServidor)
              : {}),
            id: actualId,
          };

          if (nota?.nota && typeof nota.nota === "object") {
            return { ...nota, nota: merged };
          }
          return merged;
        })
      );

      setMensaje(`Nota #${idNota} actualizada correctamente.`);
      return true;
    } catch (err) {
      setMensaje("No se pudo actualizar la nota: " + err.message);
      return false;
    }
  }

  async function eliminarNota(idNota) {
    if (!idNota) return;

    try {
      setMensaje("");
      const respuesta = await fetch(`${API_URL}/${idNota}`, {
        method: "DELETE",
      });

      if (!respuesta.ok && respuesta.status !== 404) {
        throw new Error(`Error HTTP ${respuesta.status}`);
      }

      setNotas((prev) =>
        prev.filter((nota) => obtenerIdNota(nota) !== idNota)
      );
      setMensaje(`Nota #${idNota} eliminada.`);
    } catch (err) {
      setMensaje("No se pudo eliminar la nota: " + err.message);
    }
  }

  async function alternarImportante(idNota) {
    const objetivo = notas.find((nota) => obtenerIdNota(nota) === idNota);
    if (!objetivo) return;

    const datos = extraerDatosNota(objetivo);
    await editarNota(idNota, {
      texto: datos?.texto ?? "",
      categoria: datos?.categoria ?? "General",
      importante: !Boolean(datos?.importante),
    });
  }

  const notasFiltradas = notas.filter((nota) => {
    const datos = extraerDatosNota(nota);
    const q = busqueda.trim().toLowerCase();
    const t = String(datos?.texto ?? "").toLowerCase();
    const c = String(datos?.categoria ?? "").toLowerCase();
    const cumpleTexto = !q || t.includes(q) || c.includes(q);
    const cumpleImportante = !soloImportantes || Boolean(datos?.importante);
    return cumpleTexto && cumpleImportante;
  });

  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <h1>Safe Notes</h1>
          <p>
            Frontend en React conectado a <code>/api/notas</code>
          </p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={cargarNotas}>
          Actualizar
        </button>
      </header>

      <div className="main-grid">
        <section className="card-panel">
          <h2>Nueva nota</h2>
          <form onSubmit={manejarGuardar}>
            <div className="form-field">
              <label htmlFor="categoria">Categoría</label>
              <input
                id="categoria"
                type="text"
                placeholder="Ej. General, Estudio, Trabajo"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="texto">Texto de la nota</label>
              <textarea
                id="texto"
                rows="4"
                placeholder="Escribe tu nota..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
            </div>

            <div className="form-footer">
              <label className="checkbox-field">
                <input
                  type="checkbox"
                  checked={importante}
                  onChange={(e) => setImportante(e.target.checked)}
                />
                Importante
              </label>

              <button type="submit" className="btn btn-primary" disabled={guardando}>
                {guardando ? "Guardando..." : "Guardar"}
              </button>
            </div>

            {mensaje && <p className="feedback-info">{mensaje}</p>}
          </form>
        </section>

        <section className="card-panel">
          <h2>Notas ({notasFiltradas.length})</h2>

          <div className="filter-bar">
            <input
              type="search"
              placeholder="Buscar nota o categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <button
              type="button"
              className={soloImportantes ? "btn btn-primary" : "btn btn-secondary"}
              onClick={() => setSoloImportantes((prev) => !prev)}
            >
              {soloImportantes ? "Solo importantes" : "Todas"}
            </button>
          </div>

          {cargando && <p>Cargando notas...</p>}
          {error && <p className="feedback-error">{error}</p>}
          {!cargando && !error && (
            <ListaNotas
              notas={notasFiltradas}
              onAlternarImportante={alternarImportante}
              onEditarNota={editarNota}
              onEliminarNota={eliminarNota}
            />
          )}
        </section>
      </div>
    </div>
  );
}