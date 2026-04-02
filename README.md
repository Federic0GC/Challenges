# Challenge 07 - Sensors App

Aplicación Ionic + React que muestra el uso de varios sensores/APIs de Capacitor mediante **Custom Hooks** y una página por sensor.

## Estructura general

- Home: pantalla principal con botones, uno por cada sensor/API.
- Cada botón navega a una página que utiliza un custom hook para encapsular la lógica de la API correspondiente.

## Sensores / APIs implementados

### 1. Local Notifications

- API: `@capacitor/local-notifications`
- Hook: `useLocalNotifications`
- Página: `LocalNotificationsPage`
- Ejemplos: solicitar permisos, programar una notificación local de prueba, listar y cancelar notificaciones pendientes.

### 2. Push Notifications

- API: `@capacitor/push-notifications`
- Hook: `usePushNotifications`
- Página: `PushNotificationsPage`
- Ejemplos: registrar el dispositivo, mostrar el token, listar notificaciones recibidas y última acción.

### 3. Geolocalización

- API: `@capacitor/geolocation`
- Hook: `useGeolocation`
- Página: `GeolocationPage`
- Ejemplos: obtener ubicación actual y comenzar/detener seguimiento con `watchPosition`.

### 4. Cámara

- API: `@capacitor/camera`
- Hook: `useCamera`
- Página: `CameraPage`
- Ejemplos: tomar una foto y mostrar el preview en pantalla.

### 5. Movimiento (Acelerómetro / Orientación)

- API: `@capacitor/motion`
- Hook: `useAccelerometer`
- Página: `MotionPage`
- Ejemplos: escuchar eventos de acelerómetro (`accel`) y orientación (`orientation`) y mostrar los valores en tiempo real.

### 6. Información del dispositivo

- API: `@capacitor/device`
- Hook: `useDevice`
- Página: `DevicePage`
- Ejemplos: mostrar modelo, sistema operativo, nivel de batería e ID del dispositivo.

### 7. Haptics / Vibración

- API: `@capacitor/haptics`
- Hook: `useHaptics`
- Página: `HapticsPage`
- Ejemplos: disparar impactos ligeros/medios/fuertes y vibración del dispositivo.

### 8. Filesystem

- API: `@capacitor/filesystem`
- Hook: `useFilesystem`
- Página: `FilesystemPage`
- Ejemplos: escribir y leer archivos de texto simples en el directorio `Documents`.

## Cómo ejecutar la app

```bash
cd challenge07
ionic serve
```

Luego abre la ruta `/home` en el navegador y navega a cada sensor usando los botones de la pantalla principal.
