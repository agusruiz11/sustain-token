import { STEP_STATUS } from '../data/actions';

/**
 * Presentación de los estados de paso.
 *
 * `pending` NO es un error: en el piloto real el anclaje en IPFS y blockchain
 * está genuinamente pendiente, así que es un estado de primera clase y se
 * muestra como tal, con su propio color.
 *
 * Vive fuera de StatusChip.jsx porque exportar funciones junto a componentes
 * rompe Fast Refresh.
 */
const STEP_STYLE = {
  [STEP_STATUS.COMPLETE]: { label: 'Completo', color: '#1E9E72', mark: '●' },
  [STEP_STATUS.PENDING]: { label: 'Pendiente', color: '#B8860B', mark: '◐' },
  [STEP_STATUS.UNAVAILABLE]: { label: 'No disponible', color: '#3E5E92', mark: '○' },
};

export function stepStyle(status) {
  return STEP_STYLE[status] ?? STEP_STYLE[STEP_STATUS.UNAVAILABLE];
}
