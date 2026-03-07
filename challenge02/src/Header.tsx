import PerfilUsuario from './PerfilUsuario';

interface HeaderProps {
  nombre: string;
  avatarUrl?: string;
}

function Header(props: HeaderProps) {
  return (
    <div>
      <PerfilUsuario nombre={props.nombre} avatarUrl={props.avatarUrl} />
      <h1>MediCare+ Admin</h1>
    </div>
  );
}

export default Header;
