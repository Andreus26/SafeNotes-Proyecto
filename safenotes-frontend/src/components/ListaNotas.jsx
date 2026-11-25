import TarjetaNota from "./TarjetaNota";

export default function ListaNotas({
  notas,
  onAlternarImportante,
  onEditarNota,
  onEliminarNota,
}) {
  if (!notas || notas.length === 0) {
    return <p>No hay notas para mostrar.</p>;
  }

  return (
    <div className="notes-grid">
      {notas.map((nota, index) => {
        const clave = nota?.id ?? nota?.nota?.id ?? index;
        return (
          <TarjetaNota
            key={clave}
            nota={nota}
            onAlternarImportante={onAlternarImportante}
            onEditarNota={onEditarNota}
            onEliminarNota={onEliminarNota}
          />
        );
      })}
    </div>
  );
}