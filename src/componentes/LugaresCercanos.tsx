import { IonCard, IonCardContent, IonItem, IonLabel, IonList, IonText, IonBadge } from '@ionic/react';
import type { LugarCercano } from '../utilidades/tipos';

interface LugaresCercanosProps {
  lugares: LugarCercano[];
}

export default function LugaresCercanos({ lugares }: LugaresCercanosProps) {
  return (
    <IonCard className="panel-lista">
      <IonCardContent>
        <IonText>
          <h2>Lugares cercanos</h2>
        </IonText>
        <p className="subtitulo-seccion">Primero intenta mostrar lugares reales de OpenStreetMap. Si no hay respuesta, usa sugerencias locales para no dejar vacío el panel.</p>
        <IonList inset>
          {lugares.length === 0 ? <IonItem>No hay lugares disponibles por ahora.</IonItem> : null}
          {lugares.map((lugar) => (
            <IonItem key={lugar.id} lines="full">
              <IonLabel>
                <h3>{lugar.nombre}</h3>
                <p>{lugar.descripcion ?? lugar.categoria}</p>
                <p className="subtitulo-seccion">{lugar.fuente === 'fallback' ? 'Sugerencia local' : 'Datos de OpenStreetMap'}</p>
              </IonLabel>
              <IonBadge color="medium">{Math.round(lugar.distanciaMetros)} m</IonBadge>
            </IonItem>
          ))}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
}
