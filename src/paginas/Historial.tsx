import { useMemo, useState } from 'react';
import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonItem, IonLabel, IonList, IonRow, IonText, useIonViewWillEnter } from '@ionic/react';
import MapaComponente from '../componentes/MapaComponente';
import ResumenSesion from '../componentes/ResumenSesion';
import { limpiarHistorial, obtenerSesionesGuardadas } from '../servicios/almacenamiento';
import type { SesionSeguimiento } from '../utilidades/tipos';
import { formatearFechaLarga } from '../utilidades/fecha';

export default function Historial() {
  const [sesiones, setSesiones] = useState<SesionSeguimiento[]>([]);
  const [seleccionada, setSeleccionada] = useState<SesionSeguimiento | null>(null);

  const cargar = () => {
    const datos = obtenerSesionesGuardadas();
    setSesiones(datos);
    setSeleccionada((actual) => actual ?? datos[0] ?? null);
  };

  useIonViewWillEnter(() => {
    cargar();
  });

  const rutaSeleccionada = useMemo(() => seleccionada?.puntos ?? [], [seleccionada]);

  const manejarLimpiar = () => {
    limpiarHistorial();
    setSesiones([]);
    setSeleccionada(null);
  };

  return (
    <IonContent>
      <div className="pagina-contenido">
        <IonCard className="panel-sesion">
          <IonCardContent>
            <IonText>
              <h2>Historial de tracking</h2>
            </IonText>
            <p className="subtitulo-seccion">Las sesiones se guardan localmente para poder revisarlas después.</p>
            <IonButton color="danger" fill="outline" onClick={manejarLimpiar}>
              Limpiar historial
            </IonButton>
          </IonCardContent>
        </IonCard>

        <ResumenSesion sesiones={sesiones} onSeleccionar={setSeleccionada} />

        {seleccionada ? (
          <IonGrid>
            <IonRow>
              <IonCol size="12" sizeLg="7">
                <div className="panel-mapa">
                  <MapaComponente posicion={seleccionada.puntos.at(-1)} ruta={rutaSeleccionada} altura={380} />
                </div>
              </IonCol>
              <IonCol size="12" sizeLg="5">
                <IonCard className="panel-lista">
                  <IonCardContent>
                    <IonText>
                      <h2>Detalles</h2>
                    </IonText>
                    <IonList inset>
                      <IonItem>
                        <IonLabel>
                          <h3>Inicio</h3>
                          <p>{formatearFechaLarga(seleccionada.inicio)}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Fin</h3>
                          <p>{seleccionada.fin ? formatearFechaLarga(seleccionada.fin) : 'Sesión activa'}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Puntos</h3>
                          <p>{seleccionada.puntos.length}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Motivo de fin</h3>
                          <p>{seleccionada.motivoFin ?? 'No registrado'}</p>
                        </IonLabel>
                      </IonItem>
                    </IonList>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        ) : null}
      </div>
    </IonContent>
  );
}
