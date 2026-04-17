import { IonButton, IonCard, IonCardContent, IonImg, IonSpinner, IonText } from '@ionic/react';
import type { ImagenConMarca } from '../utilidades/tipos';

interface CamaraConMarcaProps {
  foto: ImagenConMarca | null;
  cargando: boolean;
  onCapturar: () => void;
}

export default function CamaraConMarca({ foto, cargando, onCapturar }: CamaraConMarcaProps) {
  return (
    <IonCard className="panel-camera">
      <IonCardContent>
        <IonText>
          <h2>Cámara</h2>
        </IonText>
        <IonButton expand="block" onClick={onCapturar} disabled={cargando}>
          {cargando ? <IonSpinner name="crescent" /> : <span style={{ marginRight: 8 }}>📷</span>}
          Capturar foto con ubicación
        </IonButton>

        {foto ? <IonImg className="imagen-captura ion-margin-top" src={foto.dataUrl} alt="Captura con marca de agua" /> : null}
      </IonCardContent>
    </IonCard>
  );
}
