export const formatearFechaLarga = (valorISO: string): string =>
  new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(valorISO));

export const formatearHora = (marcaTemporal: number): string =>
  new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(marcaTemporal));

export const formatearNumero = (valor: number, decimales = 5): string => valor.toFixed(decimales);
