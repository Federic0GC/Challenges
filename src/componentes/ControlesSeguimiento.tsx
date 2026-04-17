import { IonButton, IonCard, IonCardContent, IonIcon, IonSpinner, IonText } from '@ionic/react';
import { play, stop } from 'ionicons/icons';

interface ControlesSeguimientoProps {
  activo: boolean;
  cargando: boolean;
  onIniciar: () => void;
  onDetener: () => void;
}

export default function ControlesSeguimiento({ activo, cargando, onIniciar, onDetener }: ControlesSeguimientoProps) {
  return (
    <IonCard className="panel-sesion">
      <IonCardContent>
        <div className="ion-padding-bottom">
          <IonText color={activo ? 'success' : 'medium'}>
            <h2>{activo ? 'Seguimiento activo' : 'Seguimiento detenido'}</h2>
          </IonText>
          <p className="subtitulo-seccion">El sistema guarda puntos, hora y ruta en almacenamiento local.</p>
        </div>

        <div className="ion-display-flex ion-justify-content-between ion-wrap ion-gap-12">
          <IonButton expand="block" disabled={cargando || activo} onClick={onIniciar}>
            {cargando ? <IonSpinner name="crescent" /> : <IonIcon icon={play} slot="start" />}
            Iniciar tracking
          </IonButton>
          <IonButton expand="block" color="danger" disabled={!activo || cargando} onClick={onDetener}>
            <IonIcon icon={stop} slot="start" />
            Detener tracking
          </IonButton>
        </div>
      </IonCardContent>
    </IonCard>
  );
}
