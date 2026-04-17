import { Device } from '@capacitor/device';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Network } from '@capacitor/network';
import type { EstadoBateria, EstadoRedMovil } from '../utilidades/tipos';

export const obtenerEstadoRed = async (): Promise<EstadoRedMovil> => {
  const estado = await Network.getStatus();

  return {
    conectado: estado.connected,
    tipo: estado.connectionType,
    wifi: estado.connectionType === 'wifi',
  };
};

export const escucharEstadoRed = async (callback: (estado: EstadoRedMovil) => void): Promise<() => Promise<void>> => {
  const listener = await Network.addListener('networkStatusChange', (estado) => {
    callback({
      conectado: estado.connected,
      tipo: estado.connectionType,
      wifi: estado.connectionType === 'wifi',
    });
  });

  return async () => {
    await listener.remove();
  };
};

export const obtenerBateria = async (): Promise<EstadoBateria> => {
  const informacion = await Device.getBatteryInfo();

  return {
    nivel: informacion.batteryLevel ?? 0,
    cargando: Boolean(informacion.isCharging),
  };
};

export const vibrarInicio = async (): Promise<void> => {
  await Haptics.impact({ style: ImpactStyle.Medium });
};
