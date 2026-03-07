import './App.css';
import { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';

function App() {
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const guardado = localStorage.getItem('medicare_usuario');
    if (guardado) {
      setUsuario(JSON.parse(guardado));
    }
  }, []);

  function login(user: any) {
    setUsuario(user);
    localStorage.setItem('medicare_usuario', JSON.stringify(user));
  }

  function logout() {
    setUsuario(null);
    localStorage.removeItem('medicare_usuario');
  }

  if (!usuario) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <div>
      <button onClick={logout}>Logout</button>
      <Dashboard usuario={usuario} />
    </div>
  );
}

export default App;
