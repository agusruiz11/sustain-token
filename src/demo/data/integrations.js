/* ============================================================
   INTEGRACIONES — Fase 6
   ============================================================
   § 7 del brief: "una tienda de integraciones" para ingesta automática de
   evidencia. El brief lista 18 ítems, encabezados por la palabra "Ejemplos:".

   ------------------------------------------------------------
   LO QUE APARECIÓ AL ANALIZAR LA LISTA
   ------------------------------------------------------------
   Los 18 no son 18 integraciones comparables:

     · 14 son servicios concretos con API conocida
     · 4 son CATEGORÍAS enteras (APIs, ERP, Sensores IoT, Medidores) — cada una
       puede ser más grande que los 14 juntos, y no se pueden cotizar sin
       definir cuál
     · 2 de los 14 no son viables como están planteados

   No viables:
     · Apple Photos → no existe API de servidor para terceros. iCloud Photos
       sólo permite leer desde un dispositivo del usuario, no desde un backend.
     · Medidores inteligentes → las distribuidoras argentinas (EDESUR, EDENOR)
       no publican API de consumo. Es exactamente el motivo por el que hoy se
       trabaja con PDFs de facturas. Requeriría convenio con la distribuidora.

   Decisión D2 del plan: vitrina con el catálogo completo + un solo conector
   funcional (Google Drive) como prueba de concepto. Mostrar 18 conectores
   "activos" que no existen sería el mismo error que inventar hashes.
   ============================================================ */

export const INTEGRATION_STATUS = {
  POC: 'poc',           // prueba de concepto prevista
  PLANNED: 'planned',   // viable, no implementada
  BLOCKED: 'blocked',   // no viable como está planteada
  SCOPE: 'scope',       // categoría abierta, falta definir alcance
};

export const INTEGRATION_STATUS_STYLE = {
  [INTEGRATION_STATUS.POC]: { label: 'Prueba de concepto', color: '#1E9E72' },
  [INTEGRATION_STATUS.PLANNED]: { label: 'Prevista', color: '#3E5E92' },
  [INTEGRATION_STATUS.BLOCKED]: { label: 'No viable', color: '#D64545' },
  [INTEGRATION_STATUS.SCOPE]: { label: 'Alcance por definir', color: '#B8860B' },
};

const S = INTEGRATION_STATUS;

export const INTEGRATION_GROUPS = [
  {
    group: 'Almacenamiento',
    hint: 'Carpetas donde la institución ya guarda sus facturas',
    items: [
      { name: 'Google Drive', status: S.POC, note: 'Conector elegido para la prueba de concepto de ingesta real.' },
      { name: 'OneDrive', status: S.PLANNED },
      { name: 'Dropbox', status: S.PLANNED },
    ],
  },
  {
    group: 'Correo',
    hint: 'Las facturas suelen llegar por mail',
    items: [
      { name: 'Gmail', status: S.PLANNED },
      { name: 'Outlook', status: S.PLANNED },
    ],
  },
  {
    group: 'Fotos',
    hint: 'Evidencia fotográfica de acciones presenciales',
    items: [
      { name: 'Google Photos', status: S.PLANNED },
      {
        name: 'Apple Photos',
        status: S.BLOCKED,
        note: 'No existe API de servidor para terceros. Sólo se puede leer desde un dispositivo del usuario, no desde un backend.',
      },
    ],
  },
  {
    group: 'Mensajería',
    hint: 'Carga rápida desde el celular',
    items: [
      { name: 'WhatsApp', status: S.PLANNED, note: 'Requiere WhatsApp Business API: aprobación de Meta y costo por conversación.' },
      { name: 'Telegram', status: S.PLANNED },
    ],
  },
  {
    group: 'Calendario',
    hint: 'Programar acciones y recordatorios',
    items: [
      { name: 'Google Calendar', status: S.PLANNED },
    ],
  },
  {
    group: 'Pagos',
    hint: 'Comprobantes de compras sostenibles',
    items: [
      { name: 'Stripe', status: S.PLANNED },
      { name: 'Mercado Pago', status: S.PLANNED },
    ],
  },
  {
    group: 'Wallets',
    hint: 'Identidad y anclaje en cadena',
    items: [
      { name: 'MetaMask', status: S.PLANNED },
      { name: 'WalletConnect', status: S.PLANNED },
    ],
  },
  {
    group: 'Sistemas y sensores',
    hint: 'Categorías abiertas del brief, no integraciones puntuales',
    items: [
      { name: 'APIs', status: S.SCOPE, note: 'Categoría genérica. Hay que definir contra qué sistema.' },
      { name: 'ERP', status: S.SCOPE, note: 'Es una familia: SAP, Oracle, Odoo, Tango. No cotizable sin definir cuál.' },
      { name: 'Sensores IoT', status: S.SCOPE, note: 'Depende del hardware y del protocolo.' },
      {
        name: 'Medidores inteligentes',
        status: S.BLOCKED,
        note: 'Las distribuidoras argentinas no publican API de consumo. Por eso hoy se trabaja con PDFs de facturas. Requeriría convenio con la distribuidora.',
      },
    ],
  },
];

export const ALL_INTEGRATIONS = INTEGRATION_GROUPS.flatMap((g) => g.items);

export function integrationSummary() {
  const by = (s) => ALL_INTEGRATIONS.filter((i) => i.status === s).length;
  return {
    total: ALL_INTEGRATIONS.length,
    poc: by(S.POC),
    planned: by(S.PLANNED),
    blocked: by(S.BLOCKED),
    scope: by(S.SCOPE),
  };
}
