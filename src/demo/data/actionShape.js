/* ============================================================
   FORMA DE UNA ACCIÓN — enums compartidos
   ============================================================
   Vive aparte de actions.js por una razón concreta: actions.js importa el
   adaptador de movilidad y el adaptador necesita estos enums. Sin este archivo
   habría un ciclo de imports.

   Cualquier consumidor puede seguir importando ACTION_STATUS y STEP_STATUS
   desde data/actions.js — se reexportan desde ahí.
   ============================================================ */

/** Estado de la acción como registro. */
export const ACTION_STATUS = {
  VERIFIED: 'verified',
  PROCESSING: 'processing',
  PENDING: 'pending',
  REJECTED: 'rejected',
};

/** Estado de un paso de la cadena de trazabilidad. */
export const STEP_STATUS = {
  COMPLETE: 'complete',
  PENDING: 'pending',
  UNAVAILABLE: 'unavailable',
};

/**
 * Naturaleza de la acción. Determina qué contiene los primeros cuatro pasos de
 * la cadena y dónde se abre su ficha; el resto de la cadena —SES, MRV, Hash,
 * CID, Blockchain, Reportes— es idéntico para todas.
 */
export const ACTION_KIND = {
  ENERGY: 'energy',
  MOBILITY: 'mobility',
  PLASTIC: 'plastic_recovery',
};
