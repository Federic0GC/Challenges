import { useCallback, useState } from 'react';
import {
  Device,
  DeviceInfo,
  BatteryInfo,
  DeviceId,
} from '@capacitor/device';

export interface UseDeviceResult {
  info: DeviceInfo | null;
  batteryInfo: BatteryInfo | null;
  deviceId: DeviceId | null;
  loading: boolean;
  error: string | null;
  loadDeviceData: () => Promise<void>;
}

export const useDevice = (): UseDeviceResult => {
  const [info, setInfo] = useState<DeviceInfo | null>(null);
  const [batteryInfo, setBatteryInfo] = useState<BatteryInfo | null>(null);
  const [deviceId, setDeviceId] = useState<DeviceId | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDeviceData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [infoResult, batteryResult, idResult] = await Promise.all([
        Device.getInfo(),
        Device.getBatteryInfo(),
        Device.getId(),
      ]);
      setInfo(infoResult);
      setBatteryInfo(batteryResult);
      setDeviceId(idResult);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    info,
    batteryInfo,
    deviceId,
    loading,
    error,
    loadDeviceData,
  };
};
