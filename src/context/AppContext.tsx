import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Position } from '@capacitor/geolocation';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';
import { auth } from '../firebase/config';
import { getProgressFromFirebase, saveProgressToFirebase } from '../firebase/progress';
import { Mission, ProgressData } from '../types';
import { useGeolocation } from '../hooks/useGeolocation';

type AppContextValue = {
  user: User | null;
  loadingAuth: boolean;
  missions: Mission[];
  points: number;
  completedCount: number;
  progressPercent: number;
  moveTracking: boolean;
  stillTracking: boolean;
  takePhotoMission: () => Promise<void>;
  startMoveMission: () => Promise<void>;
  startStillMission: () => Promise<void>;
  logout: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY = 'examen02-progress';
const MOVE_DISTANCE_METERS = 30;
const STILLNESS_DISTANCE_TOLERANCE = 3;
const STILLNESS_SECONDS = 10;

const baseMissions = (): Mission[] => [
  { id: 1, title: 'Tomar foto', points: 100, completed: false, enabled: true },
  { id: 2, title: 'Moverse al menos 50 metros', points: 150, completed: false, enabled: true },
  { id: 3, title: 'Permanecer quieto 10 segundos', points: 200, completed: false, enabled: false }
];

const getStorageKey = (uid?: string | null) => (uid ? `${STORAGE_KEY}-${uid}` : `${STORAGE_KEY}-guest`);

const readLocalProgress = (uid?: string | null): ProgressData | null => {
  const raw = localStorage.getItem(getStorageKey(uid));
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as ProgressData;
    if (typeof parsed.points !== 'number' || !Array.isArray(parsed.missions)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

const writeLocalProgress = (progress: ProgressData, uid?: string | null) => {
  localStorage.setItem(getStorageKey(uid), JSON.stringify(progress));
};

const applyProgressToMissions = (progress: ProgressData): { missions: Mission[]; points: number } => {
  const mapped = baseMissions().map((mission) => {
    const done = progress.missions.find((m) => m.id === mission.id)?.completed ?? false;
    return {
      ...mission,
      completed: done
    };
  });

  if (mapped.find((m) => m.id === 2)?.completed) {
    const m3 = mapped.find((m) => m.id === 3);
    if (m3) {
      m3.enabled = true;
    }
  }

  return {
    missions: mapped,
    points: progress.points
  };
};

const toProgressData = (missions: Mission[], points: number): ProgressData => ({
  points,
  missions: missions.map((m) => ({ id: m.id, completed: m.completed }))
});

const distanceInMeters = (a: Position['coords'], b: Position['coords']) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earth = 6371000;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const q = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q));
  return earth * c;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [missions, setMissions] = useState<Mission[]>(baseMissions());
  const [points, setPoints] = useState(0);
  const [moveTracking, setMoveTracking] = useState(false);
  const [stillTracking, setStillTracking] = useState(false);
  const geolocation = useGeolocation();

  const moveWatchIdRef = useRef<string | null>(null);
  const moveStartRef = useRef<Position['coords'] | null>(null);
  const stillWatchIdRef = useRef<string | null>(null);
  const stillIntervalRef = useRef<number | null>(null);
  const stillAnchorRef = useRef<Position['coords'] | null>(null);
  const stillLastMoveRef = useRef<number>(Date.now());

  const completedCount = useMemo(() => missions.filter((m) => m.completed).length, [missions]);
  const progressPercent = useMemo(() => Math.round((completedCount / missions.length) * 100), [completedCount, missions.length]);

  const requestNotificationPermission = async () => {
    await LocalNotifications.requestPermissions();
  };

  const requestLocationPermission = async () => {
    try {
      await geolocation.requestPermission();
    } catch {
      return;
    }
  };

  const notifyMissionCompletion = async (title: string, remaining: number) => {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: Date.now() % 1000000,
          title: 'Has completado una mision',
          body: `${title} completada`
        }
      ]
    });

    if (remaining === 1) {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: (Date.now() + 1) % 1000000,
            title: 'Te falta 1 mision para completar',
            body: 'Ya casi terminas todas las misiones'
          }
        ]
      });
    }

    if (remaining === 0) {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: (Date.now() + 2) % 1000000,
            title: 'Completaste todas las misiones',
            body: 'Excelente, terminaste todos los retos'
          }
        ]
      });
    }
  };

  const vibrateMissionStart = async () => {
    await Haptics.impact({ style: ImpactStyle.Light });
  };

  const vibrateMissionEnd = async () => {
    await Haptics.impact({ style: ImpactStyle.Heavy });
  };

  const clearMoveWatcher = async () => {
    if (moveWatchIdRef.current) {
      await geolocation.clearWatch(moveWatchIdRef.current);
      moveWatchIdRef.current = null;
    }
    moveStartRef.current = null;
    setMoveTracking(false);
  };

  const clearStillTracking = async () => {
    if (stillWatchIdRef.current) {
      await geolocation.clearWatch(stillWatchIdRef.current);
      stillWatchIdRef.current = null;
    }
    if (stillIntervalRef.current) {
      window.clearInterval(stillIntervalRef.current);
      stillIntervalRef.current = null;
    }
    stillAnchorRef.current = null;
    setStillTracking(false);
  };

  const persistState = async (nextMissions: Mission[], nextPoints: number, authUser: User | null) => {
    const payload = toProgressData(nextMissions, nextPoints);
    writeLocalProgress(payload, authUser?.uid);
    if (authUser) {
      await saveProgressToFirebase(authUser.uid, payload);
    }
  };

  const completeMission = async (id: number) => {
    const target = missions.find((m) => m.id === id);
    if (!target || target.completed || !target.enabled) {
      return;
    }

    const nextMissions = missions.map((m) => {
      if (m.id === id) {
        return { ...m, completed: true };
      }
      if (m.id === 3 && id === 2) {
        return { ...m, enabled: true };
      }
      return m;
    });

    const nextPoints = points + target.points;
    const remaining = nextMissions.filter((m) => !m.completed).length;

    setMissions(nextMissions);
    setPoints(nextPoints);
    await persistState(nextMissions, nextPoints, user);
    await vibrateMissionEnd();
    await notifyMissionCompletion(target.title, remaining);
  };

  const loadInitialProgress = async (currentUser: User | null) => {
    const local = readLocalProgress(currentUser?.uid);
    const remote = currentUser ? await getProgressFromFirebase(currentUser.uid) : null;
    const selected = remote ?? local;

    if (!selected) {
      const freshMissions = baseMissions();
      setMissions(freshMissions);
      setPoints(0);
      await persistState(freshMissions, 0, currentUser);
      return;
    }

    const { missions: hydratedMissions, points: hydratedPoints } = applyProgressToMissions(selected);
    setMissions(hydratedMissions);
    setPoints(hydratedPoints);
    await persistState(hydratedMissions, hydratedPoints, currentUser);
  };

  useEffect(() => {
    requestNotificationPermission();
    requestLocationPermission();
    const unsubscribe = onAuthStateChanged(auth, async (sessionUser) => {
      setUser(sessionUser);
      await loadInitialProgress(sessionUser);
      setLoadingAuth(false);
    });

    return () => {
      unsubscribe();
      clearMoveWatcher();
      clearStillTracking();
    };
  }, []);

  const takePhotoMission = async () => {
    const m1 = missions.find((m) => m.id === 1);
    if (!m1 || m1.completed) {
      return;
    }
    await vibrateMissionStart();
    await Camera.requestPermissions();
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 70
    });
    if (photo.path || photo.webPath) {
      await completeMission(1);
    }
  };

  const startMoveMission = async () => {
    const m2 = missions.find((m) => m.id === 2);
    if (!m2 || m2.completed || moveTracking) {
      return;
    }

    await vibrateMissionStart();
    const firstPosition = await geolocation.getCurrent();
    moveStartRef.current = firstPosition.coords;

    const watchId = await geolocation.watch(
      async (position) => {
        if (!moveStartRef.current) {
          moveStartRef.current = position.coords;
          return;
        }
        const traveled = distanceInMeters(moveStartRef.current, position.coords);
        if (traveled >= MOVE_DISTANCE_METERS) {
          await clearMoveWatcher();
          await completeMission(2);
        }
      },
      async () => {
        await clearMoveWatcher();
      }
    );

    moveWatchIdRef.current = watchId;
    setMoveTracking(true);
  };

  const startStillMission = async () => {
    const m2 = missions.find((m) => m.id === 2);
    const m3 = missions.find((m) => m.id === 3);
    if (!m2?.completed || !m3 || m3.completed || stillTracking) {
      return;
    }

    await vibrateMissionStart();
    const firstPosition = await geolocation.getCurrent();
    stillAnchorRef.current = firstPosition.coords;
    stillLastMoveRef.current = Date.now();

    const watchId = await geolocation.watch(
      async (position) => {
        if (!stillAnchorRef.current) {
          stillAnchorRef.current = position.coords;
          return;
        }
        const movement = distanceInMeters(stillAnchorRef.current, position.coords);
        if (movement > STILLNESS_DISTANCE_TOLERANCE) {
          stillAnchorRef.current = position.coords;
          stillLastMoveRef.current = Date.now();
        }
      },
      async () => {
        await clearStillTracking();
      }
    );

    stillWatchIdRef.current = watchId;
    setStillTracking(true);

    stillIntervalRef.current = window.setInterval(async () => {
      const elapsed = Date.now() - stillLastMoveRef.current;
      if (elapsed >= STILLNESS_SECONDS * 1000) {
        await clearStillTracking();
        await completeMission(3);
      }
    }, 1000);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value: AppContextValue = {
    user,
    loadingAuth,
    missions,
    points,
    completedCount,
    progressPercent,
    moveTracking,
    stillTracking,
    takePhotoMission,
    startMoveMission,
    startStillMission,
    logout
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('AppContext no inicializado');
  }
  return ctx;
};
