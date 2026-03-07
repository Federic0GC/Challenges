interface PerfilUsuarioProps {
  nombre: string;
  avatarUrl?: string;
}

function PerfilUsuario(props: PerfilUsuarioProps) {
  const color = '#0C2340';
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {props.avatarUrl ? (
        <img
          src={props.avatarUrl}
          alt="avatar"
          style={{ width: 40, height: 40, borderRadius: '50%' }}
        />
      ) : (
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: color,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: 18,
          }}
        >
        </div>
      )}
    </div>
  );
}

export default PerfilUsuario;
// PerfilUsuario eliminado, no se usa
