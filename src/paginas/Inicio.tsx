import { useEffect, useMemo, useRef, useState } from 'react';
import { IonButton, IonCol, IonContent, IonGrid, IonRow, IonToast } from '@ionic/react';
import MapaComponente from '../componentes/MapaComponente';
import ControlesSeguimiento from '../componentes/ControlesSeguimiento';
import TarjetaEstado from '../componentes/TarjetaEstado';
import LugaresCercanos from '../componentes/LugaresCercanos';
import CamaraConMarca from '../componentes/CamaraConMarca';
import { useGeolocalizacion } from '../hooks/useGeolocalizacion';
import { useSeguimiento } from '../hooks/useSeguimiento';
import type { DireccionActual, EstadoBateria, EstadoRedMovil, LugarCercano, PuntoSeguimiento } from '../utilidades/tipos';
import { obtenerDireccionActual } from '../servicios/geocodificacion';
import { obtenerLugaresCercanos } from '../servicios/lugares';
import { notificar, solicitarPermisoNotificaciones } from '../servicios/notificaciones';
import { escucharEstadoRed, obtenerBateria, obtenerEstadoRed, vibrarInicio } from '../servicios/sensores';
import { tomarFotoConMarca } from '../servicios/camara';
import { calcularVelocidadKmh } from '../utilidades/geometria';

export default function Inicio() {
  const { posicion, error, cargando: cargandoGeo } = useGeolocalizacion();
  const { sesionActiva, estaSeguimientoActivo, iniciarSeguimiento, agregarPunto, detenerSeguimiento } = useSeguimiento();
  const [direccion, setDireccion] = useState<DireccionActual | null>(null);
  const [lugares, setLugares] = useState<LugarCercano[]>([]);
  const [cargandoLugares, setCargandoLugares] = useState(false);
  const [red, setRed] = useState<EstadoRedMovil | null>(null);
  const [bateria, setBateria] = useState<EstadoBateria | null>(null);
  const [foto, setFoto] = useState<Awaited<ReturnType<typeof tomarFotoConMarca>> | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [procesandoFoto, setProcesandoFoto] = useState(false);
  const temporizadorInactividad = useRef<number | null>(null);

  const velocidadActualKmh = useMemo(() => {
    if (!posicion) {
      return 0;
    }

    if (posicion.velocidadMetrosSegundo != null) {
      return posicion.velocidadMetrosSegundo * 3.6;
    }

    if (sesionActiva && sesionActiva.puntos.length > 0) {
      const puntoAnterior = sesionActiva.puntos[sesionActiva.puntos.length - 1];
      const puntoActual: PuntoSeguimiento = { ...posicion, id: 'actual' };
      return calcularVelocidadKmh(puntoAnterior, puntoActual);
    }

    return 0;
  }, [posicion, sesionActiva]);

  useEffect(() => {
    void solicitarPermisoNotificaciones();

    void obtenerEstadoRed().then((estado) => setRed(estado));
    void obtenerBateria().then((estado) => setBateria(estado));

    const registrarRed = escucharEstadoRed((estado) => {
      setRed(estado);
      if (!estado.conectado) {
        setMensaje('Sin conexión a internet. Algunas funciones quedarán limitadas.');
        void notificar('Sin conexión', 'La app no tiene acceso a internet en este momento.');
      }
    });

    let activo = true;
    const intervaloBateria = window.setInterval(() => {
      void obtenerBateria().then((estadoActual) => {
        if (!activo) {
          return;
        }

        setBateria(estadoActual);
        if (estaSeguimientoActivo && !estadoActual.cargando && estadoActual.nivel < 0.15) {
          detenerSeguimiento('bateria-baja');
          setMensaje('Seguimiento detenido por batería baja.');
          void notificar('Batería baja', 'El seguimiento se detuvo automáticamente para ahorrar energía.');
        }
      });
    }, 60000);

    return () => {
      activo = false;
      window.clearInterval(intervaloBateria);
      void registrarRed.then((desregistrar) => desregistrar());
    };
  }, [detenerSeguimiento, estaSeguimientoActivo]);

  useEffect(() => {
    if (!posicion) {
      return;
    }

    const necesitaDireccion = !direccion || Math.abs(posicion.latitud - (sesionActiva?.puntos.at(-1)?.latitud ?? posicion.latitud)) > 0.0002;
    if (necesitaDireccion) {
      const temporizador = window.setTimeout(() => {
        void obtenerDireccionActual(posicion.latitud, posicion.longitud).then((resultado) => setDireccion(resultado));
      }, 900);

      return () => window.clearTimeout(temporizador);
    }

    return undefined;
  }, [direccion, posicion, sesionActiva]);

  useEffect(() => {
    if (!posicion) {
      return;
    }

    const ejecutarSmartTracking = async () => {
      if (velocidadActualKmh >= 2.5 && !estaSeguimientoActivo) {
        iniciarSeguimiento(posicion, direccion?.texto);
        setMensaje('Tracking iniciado automáticamente por detección de movimiento.');
        setToast('Tracking iniciado automáticamente');
        await vibrarInicio();
        void notificar('Tracking iniciado', 'Se detectó movimiento y el seguimiento comenzó.');
      }

      if (estaSeguimientoActivo) {
        agregarPunto(posicion);
      }

      if (temporizadorInactividad.current) {
        window.clearTimeout(temporizadorInactividad.current);
      }

      if (estaSeguimientoActivo && velocidadActualKmh < 1) {
        temporizadorInactividad.current = window.setTimeout(() => {
          detenerSeguimiento('sin-movimiento', direccion?.texto);
          setMensaje('Seguimiento detenido por inactividad.');
          setToast('Seguimiento detenido por inactividad');
          void notificar('Inactividad detectada', 'No hubo movimiento durante un periodo prolongado.');
        }, 180000);
      }
    };

    void ejecutarSmartTracking();
  }, [agregarPunto, detenerSeguimiento, direccion?.texto, estaSeguimientoActivo, iniciarSeguimiento, posicion, velocidadActualKmh]);

  useEffect(() => {
    if (!posicion || !red?.conectado) {
      return;
    }

    let cancelado = false;
    const cargarDatosRemotos = async () => {
      setCargandoLugares(true);
      const [direccionRemota, lugaresRemotos] = await Promise.all([
        obtenerDireccionActual(posicion.latitud, posicion.longitud),
        obtenerLugaresCercanos(posicion.latitud, posicion.longitud),
      ]);

      if (cancelado) {
        return;
      }

      setDireccion(direccionRemota);
      setLugares(lugaresRemotos);
      setCargandoLugares(false);
    };

    void cargarDatosRemotos();

    return () => {
      cancelado = true;
      setCargandoLugares(false);
    };
  }, [posicion, red?.conectado]);

  const manejarInicioManual = async () => {
    if (!posicion) {
      setToast('Aún no se obtuvo la ubicación actual');
      return;
    }

    iniciarSeguimiento(posicion, direccion?.texto);
    await vibrarInicio();
    setMensaje('Seguimiento iniciado manualmente.');
    setToast('Seguimiento iniciado');
    void notificar('Tracking iniciado', 'El seguimiento manual está activo.');
  };

  const manejarDetener = () => {
    detenerSeguimiento('manual', direccion?.texto);
    setMensaje('Seguimiento detenido manualmente.');
    setToast('Seguimiento detenido');
  };

  const manejarFoto = async () => {
    if (!posicion) {
      setToast('Necesitas una ubicación para tomar la foto');
      return;
    }

    setProcesandoFoto(true);
    try {
      const imagen = await tomarFotoConMarca(posicion.latitud, posicion.longitud);
      setFoto(imagen);
      setMensaje('Foto capturada con marca de ubicación.');
    } finally {
      setProcesandoFoto(false);
    }
  };

  return (
    <IonContent>
      <div className="pagina-contenido">
        <ControlesSeguimiento activo={estaSeguimientoActivo} cargando={cargandoGeo} onIniciar={manejarInicioManual} onDetener={manejarDetener} />

        <TarjetaEstado posicion={posicion} direccion={direccion} red={red} bateria={bateria} mensaje={mensaje ?? error} />

        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeLg="8">
              <div className="panel-mapa">
                <MapaComponente posicion={posicion} ruta={sesionActiva?.puntos ?? []} altura={420} />
              </div>
            </IonCol>
            <IonCol size="12" sizeLg="4">
              <CamaraConMarca foto={foto} cargando={procesandoFoto} onCapturar={manejarFoto} />
            </IonCol>
          </IonRow>
        </IonGrid>

        <LugaresCercanos lugares={cargandoLugares ? [] : lugares} />

        <IonButton expand="block" fill="outline" className="ion-margin-top" onClick={() => void obtenerBateria().then(setBateria)}>
          Actualizar batería
        </IonButton>

        <IonToast isOpen={Boolean(toast)} message={toast ?? ''} duration={2200} onDidDismiss={() => setToast(null)} position="bottom" />
      </div>
    </IonContent>
  );
}
