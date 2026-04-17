import { IonCard, IonCardContent, IonGrid, IonIcon, IonRow, IonCol, IonText } from '@ionic/react';
import { batteryChargingOutline, navigateOutline, cloudyNightOutline, wifiOutline, warningOutline } from 'ionicons/icons';
import type { CoordenadaGeo, EstadoBateria, EstadoRedMovil, DireccionActual } from '../utilidades/tipos';
import { formatearNumero } from '../utilidades/fecha';

interface TarjetaEstadoProps {
  posicion: CoordenadaGeo | null;
  direccion: DireccionActual | null;
  red: EstadoRedMovil | null;
  bateria: EstadoBateria | null;
  mensaje: string | null;
}

const EstadoItem = ({ icono, titulo, valor }: { icono: string; titulo: string; valor: string }) => (
  <div className="ion-padding-vertical">
    <div className="ion-display-flex ion-align-items-center ion-gap-8">
      <IonIcon icon={icono} />
      <strong>{titulo}</strong>
    </div>
    <div>{valor}</div>
  </div>
);

export default function TarjetaEstado({ posicion, direccion, red, bateria, mensaje }: TarjetaEstadoProps) {
  return (
    <IonCard className="tarjeta-destacada">
      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="6">
              <EstadoItem
                icono={navigateOutline}
                titulo="Ubicación"
                valor={posicion ? `${formatearNumero(posicion.latitud)} / ${formatearNumero(posicion.longitud)}` : 'Obteniendo ubicación...'}
              />
              <EstadoItem icono={cloudyNightOutline} titulo="Dirección" valor={direccion?.texto ?? 'Sin dirección'} />
            </IonCol>
            <IonCol size="12" sizeMd="6">
              <EstadoItem icono={wifiOutline} titulo="Conexión" valor={red ? (red.conectado ? `Conectado (${red.tipo})` : 'Sin conexión') : 'Revisando red...'} />
              <EstadoItem icono={batteryChargingOutline} titulo="Batería" valor={bateria ? `${Math.round(bateria.nivel * 100)}% ${bateria.cargando ? '(cargando)' : ''}` : 'Sin datos'} />
            </IonCol>
          </IonRow>
        </IonGrid>

        {mensaje ? (
          <div className="ion-margin-top">
            <IonIcon icon={warningOutline} /> {mensaje}
          </div>
        ) : null}
      </IonCardContent>
    </IonCard>
  );
}
