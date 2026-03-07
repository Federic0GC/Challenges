import { useState } from 'react';

type Paciente = {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
};

interface TablaPacientesProps {
  pacientes: Paciente[];
  onEditar: (paciente: Paciente) => void;
  onEliminar: (id: string) => void;
}

function TablaPacientes(props: TablaPacientesProps) {
  const [modalId, setModalId] = useState<string | null>(null);
  const pacientes = props.pacientes;
  const onEditar = props.onEditar;
  const onEliminar = props.onEliminar;

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.length === 0 ? (
            <tr>
              <td colSpan={5}></td>
            </tr>
          ) : (
            pacientes.map(p => (
              <tr key={p.id} style={{ marginBottom: 8 }}>
                <td>{p.nombre}</td>
                <td>{p.apellido}</td>
                <td>{p.dni}</td>
                <td>{p.telefono}</td>
                <td>
                  <button onClick={() => onEditar(p)} style={{ marginRight: 4 }}>Editar</button>
                  <button onClick={() => setModalId(p.id)}>Eliminar</button>
                  {modalId === p.id && (
                    <div style={{ marginTop: 8 }}>
                      <div>
                        <p>¿Seguro que quieres eliminar a {p.nombre} {p.apellido}?</p>
                        <button onClick={() => { onEliminar(p.id); setModalId(null); }} style={{ marginRight: 4 }}>Eliminar</button>
                        <button onClick={() => setModalId(null)}>Cancelar</button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TablaPacientes;
