import { useState } from 'react';

type Paciente = {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
};

interface FormularioPacienteProps {
  pacienteAEditar: Paciente | null;
  onGuardar: (paciente: Paciente) => void;
}

function FormularioPaciente(props: FormularioPacienteProps) {
  const pacienteAEditar = props.pacienteAEditar;
  const [nombre, setNombre] = useState(pacienteAEditar ? pacienteAEditar.nombre : '');
  const [apellido, setApellido] = useState(pacienteAEditar ? pacienteAEditar.apellido : '');
  const [dni, setDni] = useState(pacienteAEditar ? pacienteAEditar.dni : '');
  const [telefono, setTelefono] = useState(pacienteAEditar ? pacienteAEditar.telefono : '');
  const [error, setError] = useState('');

  function validar(): boolean {
    if (!nombre || !apellido || !dni) {
      setError('Nombre, apellido y DNI son obligatorios');
      return false;
    }
    if (!/^\d{7,8}$/.test(dni)) {
      setError('DNI debe tener 7 u 8 números');
      return false;
    }
    setError('');
    return true;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validar()) return;
    const paciente = {
      id: pacienteAEditar ? pacienteAEditar.id : Date.now().toString(),
      nombre,
      apellido,
      dni,
      telefono,
    };
    props.onGuardar(paciente);
    setNombre('');
    setApellido('');
    setDni('');
    setTelefono('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 8 }}>
        <label>Nombre</label>
        <input value={nombre} onChange={e => setNombre(e.target.value)} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Apellido</label>
        <input value={apellido} onChange={e => setApellido(e.target.value)} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>DNI</label>
        <input value={dni} onChange={e => setDni(e.target.value)} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Teléfono</label>
        <input value={telefono} onChange={e => setTelefono(e.target.value)} />
      </div>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <button type="submit" style={{ marginBottom: 8 }}>{pacienteAEditar ? 'Guardar cambios' : 'Agregar paciente'}</button>
    </form>
  );
}

export default FormularioPaciente;
