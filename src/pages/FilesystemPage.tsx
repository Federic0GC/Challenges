import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useState } from 'react';
import { useFilesystem } from '../hooks/useFilesystem';

const FilesystemPage: React.FC = () => {
  const {
    lastFilePath,
    lastContent,
    writing,
    reading,
    error,
    writeTextFile,
    readTextFile,
  } = useFilesystem();

  const [path, setPath] = useState(lastFilePath);
  const [content, setContent] = useState('Hola desde Filesystem');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Filesystem</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="stacked">Nombre del archivo (Documents)</IonLabel>
            <IonInput
              value={path}
              onIonChange={(e) => setPath(e.detail.value ?? '')}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Contenido a escribir</IonLabel>
            <IonTextarea
              autoGrow
              value={content}
              onIonChange={(e) => setContent(e.detail.value ?? '')}
            />
          </IonItem>
        </IonList>

        <IonButton
          expand="block"
          onClick={() => writeTextFile(path, content)}
          disabled={writing}
        >
          {writing ? <IonSpinner name="dots" /> : 'Guardar archivo'}
        </IonButton>

        <IonButton
          expand="block"
          color="secondary"
          onClick={() => readTextFile(path)}
          disabled={reading}
        >
          {reading ? <IonSpinner name="dots" /> : 'Leer archivo'}
        </IonButton>

        <IonList>
          <IonItem>
            <IonLabel position="stacked">Último archivo leído/escrito</IonLabel>
            <p>{lastFilePath}</p>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Contenido leído</IonLabel>
            <p style={{ whiteSpace: 'pre-wrap' }}>{lastContent}</p>
          </IonItem>

          {error && (
            <IonItem color="danger">
              <IonLabel>{error}</IonLabel>
            </IonItem>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default FilesystemPage;
