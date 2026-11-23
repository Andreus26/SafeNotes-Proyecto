import TarjetaNota from "./TarjetaNota";

export default function ListaNotas({ notas }) {
  if (!notas || notas.length === 0) {
    return <p>No hay notas registradas todavía.</p>;
  }

  return (
    <div>
      {notas.map((nota) => (
        <TarjetaNota key={nota.id} nota={nota} />
      ))}
    </div>
  );
}