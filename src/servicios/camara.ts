import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import type { ImagenConMarca } from '../utilidades/tipos';

const cargarImagen = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const imagen = new Image();
    imagen.onload = () => resolve(imagen);
    imagen.onerror = () => reject(new Error('No fue posible cargar la imagen capturada'));
    imagen.src = src;
  });

const dibujarMarcaDeAgua = async (src: string, latitud: number, longitud: number): Promise<string> => {
  const imagen = await cargarImagen(src);
  const canvas = document.createElement('canvas');
  const ancho = 1280;
  const relacion = imagen.naturalHeight / imagen.naturalWidth;
  const alto = Math.round(ancho * relacion);

  canvas.width = ancho;
  canvas.height = alto + 120;

  const contexto = canvas.getContext('2d');
  if (!contexto) {
    return src;
  }

  contexto.fillStyle = '#06111f';
  contexto.fillRect(0, 0, canvas.width, canvas.height);
  contexto.drawImage(imagen, 0, 0, ancho, alto);

  contexto.fillStyle = 'rgba(6, 17, 31, 0.88)';
  contexto.fillRect(0, alto, canvas.width, 120);
  contexto.fillStyle = '#e5eefb';
  contexto.font = 'bold 28px sans-serif';
  contexto.fillText('Challenge-08', 28, alto + 42);
  contexto.font = '22px sans-serif';
  contexto.fillText(`Lat: ${latitud.toFixed(6)} | Lng: ${longitud.toFixed(6)}`, 28, alto + 78);
  contexto.fillText(new Date().toLocaleString('es-ES'), 28, alto + 108);

  return canvas.toDataURL('image/jpeg', 0.92);
};

export const tomarFotoConMarca = async (latitud: number, longitud: number): Promise<ImagenConMarca> => {
  const foto = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.Base64,
    source: CameraSource.Camera,
  });

  const original = `data:image/${foto.format};base64,${foto.base64String ?? ''}`;
  const dataUrl = await dibujarMarcaDeAgua(original, latitud, longitud);

  return {
    dataUrl,
    latitud,
    longitud,
    fecha: new Date().toISOString(),
  };
};
