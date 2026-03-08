interface PerfilUsuarioProps {
  nombre: string;
  avatarUrl?: string;
}

function PerfilUsuario(props: PerfilUsuarioProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {props.avatarUrl ? (
        <img
          src={props.avatarUrl}
          alt="avatar"
          style={{ width: 40, height: 40, borderRadius: '50%' }}
        />
      ) : (
        <img
          src="https://www.gravatar.com/avatar/?d=mp&s=40"
          alt="avatar default"
          style={{ width: 40, height: 40, borderRadius: '50%' }}
        />
      )}
    </div>
  );
}

export default PerfilUsuario;

