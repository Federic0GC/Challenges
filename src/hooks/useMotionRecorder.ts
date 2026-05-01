import { useCallback, useEffect, useRef, useState } from "react";
import type { Sample } from "@/lib/dtw";

type DMEventLike = {
  acceleration?: { x: number | null; y: number | null; z: number | null } | null;
  accelerationIncludingGravity?: { x: number | null; y: number | null; z: number | null } | null;
  rotationRate?: { alpha: number | null; beta: number | null; gamma: number | null } | null;
};

export type PermissionState = "unknown" | "granted" | "denied" | "unsupported";

export function useMotionRecorder() {
  const [permission, setPermission] = useState<PermissionState>("unknown");
  const [isRecording, setIsRecording] = useState(false);
  const [liveSample, setLiveSample] = useState<Sample | null>(null);
  const [duration, setDuration] = useState(0);
  const samplesRef = useRef<Sample[]>([]);
  const startRef = useRef(0);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("DeviceMotionEvent" in window)) {
      setPermission("unsupported");
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    const DM: any = (window as any).DeviceMotionEvent;
    if (!DM) {
      setPermission("unsupported");
      return false;
    }
    if (typeof DM.requestPermission === "function") {
      try {
        const res = await DM.requestPermission();
        const ok = res === "granted";
        setPermission(ok ? "granted" : "denied");
        return ok;
      } catch {
        setPermission("denied");
        return false;
      }
    }
    setPermission("granted");
    return true;
  }, []);

  const handler = useCallback((e: Event) => {
    const ev = e as DeviceMotionEvent as unknown as DMEventLike;
    const a = ev.acceleration?.x != null ? ev.acceleration : ev.accelerationIncludingGravity;
    const ax = a?.x ?? 0;
    const ay = a?.y ?? 0;
    const az = a?.z ?? 0;
    const r = ev.rotationRate;
    const gx = r?.alpha ?? 0;
    const gy = r?.beta ?? 0;
    const gz = r?.gamma ?? 0;
    const sample: Sample = [ax, ay, az, gx, gy, gz];
    samplesRef.current.push(sample);
    setLiveSample(sample);
  }, []);

  const start = useCallback(async () => {
    const ok = permission === "granted" ? true : await requestPermission();
    if (!ok) return false;
    samplesRef.current = [];
    startRef.current = Date.now();
    setDuration(0);
    setIsRecording(true);
    window.addEventListener("devicemotion", handler);
    tickRef.current = window.setInterval(() => {
      setDuration((Date.now() - startRef.current) / 1000);
    }, 100);
    return true;
  }, [permission, requestPermission, handler]);

  const stop = useCallback((): Sample[] => {
    window.removeEventListener("devicemotion", handler);
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    setIsRecording(false);
    return samplesRef.current.slice();
  }, [handler]);

  useEffect(() => {
    return () => {
      window.removeEventListener("devicemotion", handler);
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [handler]);

  return { permission, requestPermission, isRecording, start, stop, liveSample, duration };
}
