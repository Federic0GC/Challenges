import { useState } from 'react';

const usuarios = [
  { email: 'federico@medicare.com', password: 'federico', nombre: 'Federico Gómez', rol: 'admin', avatarUrl: '' },
  { email: 'sandra@medicare.com', password: 'recepcionista', nombre: 'Sandra López', rol: 'recepcionista', avatarUrl: '' },
  { email: 'juan_david@medicare.com', password: 'medico', nombre: 'Juan David', rol: 'medico', avatarUrl: '' },
];

interface LoginFormProps {
  onLogin: (usuario: any) => void;
}

function LoginForm(props: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const usuario = usuarios.find(u => u.email === email && u.password === password);
    if (!usuario) {
      setError('Usuario o contraseña incorrectos');
      return;
    }
    setError('');
    props.onLogin(usuario);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ marginBottom: 8 }} />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} style={{ marginBottom: 8 }} />
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <button type="submit" style={{ marginBottom: 8 }}>Ingresar</button>
    </form>
  );
}

export default LoginForm;
