import type { SesionSeguimiento } from '../utilidades/tipos';

const claveSesiones = 'challenge08.sesiones';
const claveSesionActiva = 'challenge08.sesionActiva';

const leerJSON = <T,>(clave: string, valorPorDefecto: T): T => {
  if (typeof window === 'undefined') {
    return valorPorDefecto;
  }

  const contenido = window.localStorage.getItem(clave);
  if (!contenido) {
    return valorPorDefecto;
  }

  try {
    return JSON.parse(contenido) as T;
  } catch {
    return valorPorDefecto;
  }
};

const guardarJSON = <T,>(clave: string, valor: T): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(clave, JSON.stringify(valor));
};

export const obtenerSesionesGuardadas = (): SesionSeguimiento[] => leerJSON<SesionSeguimiento[]>(claveSesiones, []);

export const guardarSesiones = (sesiones: SesionSeguimiento[]): void => guardarJSON(claveSesiones, sesiones);

export const guardarSesionActiva = (sesion: SesionSeguimiento | null): void => {
  if (sesion === null) {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(claveSesionActiva);
    }

    return;
  }

  guardarJSON(claveSesionActiva, sesion);
};

export const obtenerSesionActiva = (): SesionSeguimiento | null => leerJSON<SesionSeguimiento | null>(claveSesionActiva, null);

export const limpiarHistorial = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(claveSesiones);
  window.localStorage.removeItem(claveSesionActiva);
};
