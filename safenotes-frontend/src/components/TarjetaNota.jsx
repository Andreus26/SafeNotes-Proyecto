import { useEffect, useState } from "react";

export default function TarjetaNota({
  nota,
  onAlternarImportante,
  onEditarNota,
  onEliminarNota,
}) {
  const idNota = nota?.id ?? nota?.nota?.id;
  const datos = nota?.nota && typeof nota.nota === "object" ? nota.nota : nota;

  const texto = datos?.texto ?? "";
  const categoria = datos?.categoria || "General";
  const esImportante = Boolean(datos?.importante);

  const [editando, setEditando] = useState(false);
  const [textoEdit, setTextoEdit] = useState(texto);
  const [categoriaEdit, setCategoriaEdit] = useState(categoria);
  const [importanteEdit, setImportanteEdit] = useState(esImportante);
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);

  useEffect(() => {
    setTextoEdit(texto);
    setCategoriaEdit(categoria);
    setImportanteEdit(esImportante);
  }, [texto, categoria, esImportante]);

  async function manejarGuardarEdicion(e) {
    e.preventDefault();
    if (!onEditarNota) return;

    setGuardandoEdicion(true);
    const ok = await onEditarNota(idNota, {
      texto: textoEdit,
      categoria: categoriaEdit,
      importante: importanteEdit,
    });
    setGuardandoEdicion(false);

    if (ok) {
      setEditando(false);
    }
  }

  function cancelarEdicion() {
    setTextoEdit(texto);
    setCategoriaEdit(categoria);
    setImportanteEdit(esImportante);
    setEditando(false);
  }

  return (
    <article className={esImportante ? "note-card is-important" : "note-card"}>
      <div className="note-top">
        <span>{categoria}</span>
        <span className="note-badge">
          {esImportante ? "Importante" : "Normal"}
        </span>
      </div>

      {editando ? (
        <form onSubmit={manejarGuardarEdicion} className="edit-note-form">
          <div className="form-field">
            <label htmlFor={`cat-${idNota}`}>Categoría</label>
            <input
              id={`cat-${idNota}`}
              type="text"
              value={categoriaEdit}
              onChange={(e) => setCategoriaEdit(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor={`txt-${idNota}`}>Texto</label>
            <textarea
              id={`txt-${idNota}`}
              rows="3"
              value={textoEdit}
              onChange={(e) => setTextoEdit(e.target.value)}
            />
          </div>

          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={importanteEdit}
              onChange={(e) => setImportanteEdit(e.target.checked)}
            />
            Importante
          </label>

          <div className="note-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={guardandoEdicion}
            >
              {guardandoEdicion ? "Guardando..." : "Guardar cambios"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={cancelarEdicion}
              disabled={guardandoEdicion}
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="note-body">{texto || "(Sin texto)"}</p>

          <div className="note-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onAlternarImportante(idNota)}
            >
              {esImportante ? "Quitar importante" : "Marcar importante"}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditando(true)}
            >
              Editar
            </button>

            <button
              type="button"
              className="btn btn-danger"
              onClick={() => onEliminarNota(idNota)}
            >
              Eliminar
            </button>
          </div>
        </>
      )}
    </article>
  );
}