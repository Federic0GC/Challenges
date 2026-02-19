export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      console.log('✓ Service Worker registrado correctamente:', registration);
      
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('✓ Nueva versión del SW disponible');
          }
        });
      });
    } catch (error) {
      console.error('✗ Error al registrar Service Worker:', error);
    }
  } else {
    console.warn('⚠ Service Workers no soportados en este navegador');
  }
};
