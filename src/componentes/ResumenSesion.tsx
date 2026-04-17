import { IonCard, IonCardContent, IonItem, IonLabel, IonList, IonText } from '@ionic/react';
import type { SesionSeguimiento } from '../utilidades/tipos';
import { formatearFechaLarga } from '../utilidades/fecha';

interface ResumenSesionProps {
  sesiones: SesionSeguimiento[];
  onSeleccionar: (sesion: SesionSeguimiento) => void;
}

export default function ResumenSesion({ sesiones, onSeleccionar }: ResumenSesionProps) {
  return (
    <IonCard className="panel-lista">
      <IonCardContent>
        <IonText>
          <h2>Sesiones guardadas</h2>
        </IonText>
        <IonList inset>
          {sesiones.length === 0 ? <IonItem>No existen sesiones guardadas todavía.</IonItem> : null}
          {sesiones.map((sesion) => (
            <IonItem key={sesion.id} button detail onClick={() => onSeleccionar(sesion)}>
              <IonLabel>
                <h3>{formatearFechaLarga(sesion.inicio)}</h3>
                <p>
                  {sesion.puntos.length} puntos · {sesion.activa ? 'activa' : 'finalizada'}
                </p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
}
