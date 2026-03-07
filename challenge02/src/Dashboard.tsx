import { useState, useEffect } from 'react';
import FormularioPaciente from './FormularioPaciente';
import TablaPacientes from './TablaPacientes';
import BuscadorPacientes from './BuscadorPacientes';

type Paciente = {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
};

interface DashboardProps {
  usuario: any;
}

function Dashboard(props: DashboardProps) {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteAEditar, setPacienteAEditar] = useState<Paciente | null>(null);
  const [busqueda, setBusqueda] = useState<string>('');

  useEffect(() => {
    const guardados = localStorage.getItem('medicare_pacientes');
    if (guardados) setPacientes(JSON.parse(guardados));
  }, []);

  useEffect(() => {
    localStorage.setItem('medicare_pacientes', JSON.stringify(pacientes));
  }, [pacientes]);

  function guardarPaciente(paciente: Paciente) {
    if (pacienteAEditar) {
      setPacientes(pacientes.map(p => p.id === paciente.id ? paciente : p));
      setPacienteAEditar(null);
    } else {
      setPacientes([...pacientes, paciente]);
    }
  }

  function editarPaciente(paciente: Paciente) {
    setPacienteAEditar(paciente);
  }

  function eliminarPaciente(id: string) {
    setPacientes(pacientes.filter(p => p.id !== id));
    if (pacienteAEditar && pacienteAEditar.id === id) setPacienteAEditar(null);
  }

  const pacientesFiltrados = pacientes.filter(p => {
    const texto = busqueda.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(texto) ||
      p.apellido.toLowerCase().includes(texto) ||
      p.dni.includes(texto)
    );
  });

  return (
    <div>
      {props.usuario.rol === 'admin' && (
        <>
          <FormularioPaciente pacienteAEditar={pacienteAEditar} onGuardar={guardarPaciente} />
          <BuscadorPacientes value={busqueda} onChange={setBusqueda} />
          <TablaPacientes pacientes={pacientesFiltrados} onEditar={editarPaciente} onEliminar={eliminarPaciente} />
          <div>
            <p>Total de pacientes: {pacientes.length}</p>
          </div>
        </>
      )}
      {props.usuario.rol === 'recepcionista' && (
        <>
          <FormularioPaciente pacienteAEditar={pacienteAEditar} onGuardar={guardarPaciente} />
          <BuscadorPacientes value={busqueda} onChange={setBusqueda} />
          <TablaPacientes pacientes={pacientesFiltrados} onEditar={editarPaciente} onEliminar={eliminarPaciente} />
        </>
      )}
      {props.usuario.rol === 'medico' && (
        <>
          <BuscadorPacientes value={busqueda} onChange={setBusqueda} />
          <TablaPacientes pacientes={pacientesFiltrados} onEditar={editarPaciente} onEliminar={eliminarPaciente} />
        </>
      )}
    </div>
  );
}

export default Dashboard;
