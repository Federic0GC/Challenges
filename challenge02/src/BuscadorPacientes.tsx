interface BuscadorPacientesProps {
  value: string;
  onChange: (value: string) => void;
}

function BuscadorPacientes(props: BuscadorPacientesProps) {
  return (
    <div style={{ marginBottom: 8 }}>
      <input
        type="text"
        placeholder="Buscar por nombre, apellido o DNI"
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
}

export default BuscadorPacientes;
