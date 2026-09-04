/* ============================================================
   MOVILIDAD COMO ACCIÓN CANÓNICA — 24 ago 2026
   ============================================================
   Adaptador. Traduce los 5 viajes de mobility.js al mismo sobre que usan las
   acciones de energía, para que las seis pantallas del nodo (Mis Acciones,
   Timeline, Impact, Reportes, Auditoría, Environmental Identity) lean un único
   universo de acciones en vez de armar cada una el suyo.

   Es lo que pidió Martín el 24 ago:

     «El objetivo es que Mis Acciones, Timeline, Impact Dashboard, Reportes,
      Auditoría y Environmental Identity lean el mismo universo canónico de
      acciones, evitando que cada pantalla termine mostrando conjuntos
      diferentes.»

   ------------------------------------------------------------
   QUÉ HACE Y QUÉ NO HACE ESTE ARCHIVO
   ------------------------------------------------------------
   NO recalcula nada. Cada valor sale literal de mobility.js, que a su vez está
   copiado del dashboard_sync y de los cinco paquetes. El adaptador sólo
   reetiqueta campos para que tengan la misma forma que los de energía.

   NO inventa CID ni transacción. Los cinco viajes traen `ipfs_cid: "pending"` y
   `chain_anchor_tx: "pending"` en la fuente, y así salen acá. Lo único real del
   anclaje es el SHA-256 de la evidencia, que sí se muestra como completo porque
   está verificado contra el JPEG.

   ------------------------------------------------------------
   POR QUÉ NO COMPARTEN LA FICHA DE DETALLE
   ------------------------------------------------------------
   Una acción de energía se explica con Factura → Consumo → Baseline → Resultado.
   Un viaje se explica con Evidencia → Distancia → Baseline genesis → CO₂e. Son
   la misma cadena de trazabilidad con distinto contenido en los primeros cuatro
   pasos, así que comparten el listado pero cada una abre en su vista: la de
   energía en la ficha de acción, la de movilidad en el módulo Movilidad, que ya
   muestra metodología de carbono y controles de validación.

   `detailPath` es lo que resuelve eso sin cablear rutas en las pantallas.
   ============================================================ */

import { MOBILITY_ACTIONS, MOBILITY_MODULE, ANCHOR_STATE } from './mobility.js';
import { ACTION_STATUS, STEP_STATUS } from './actionShape.js';
import { DATA_MODE } from './sustainNodes.js';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

/** '2026-07-14' → '14 Jul 2026'. Mismo formato que los dateLabel de energía. */
function dateLabelOf(iso) {
  const [y, m, d] = iso.split('-');
  return `${Number(d)} ${MESES[Number(m) - 1]} ${y}`;
}

/**
 * Data Room del viaje.
 *
 * La evidencia es el JPEG real del paquete. Los artefactos JSON se generan
 * desde el dato del viaje (ver la nota de dataRoom.js): contenido real →
 * hash real. El mrv_report y el action_report son PDFs del paquete que no
 * están en el repo, así que se listan sin contenido.
 */
const mobilityDataRoom = (t) => ({
  evidence: [
    {
      name: `evidencia_viaje_${String(t.seq).padStart(2, '0')}.jpeg`,
      type: 'jpeg',
      label: 'Captura de la actividad',
      redacted: false,
    },
  ],
  artifacts: [
    { name: 'mobility_activity.json', type: 'json', label: 'Actividad normalizada' },
    { name: 'carbon_estimate.json', type: 'json', label: 'Estimación de CO₂e' },
    { name: 'ses_score.json', type: 'json', label: 'SES Score' },
  ],
  reports: [
    { name: 'mrv_report.pdf', type: 'pdf', label: 'MRV Report', status: STEP_STATUS.COMPLETE },
    { name: 'action_report.pdf', type: 'pdf', label: 'Action Report', status: STEP_STATUS.COMPLETE },
  ],
  /* El privacy_mode LIMITED del paquete: la captura no expone el recorrido
     exacto de origen a destino ni la cuenta del proveedor. */
  redactedFields: ['recorrido exacto', 'cuenta del proveedor', 'domicilio de origen'],
  hash: t.sha256,
});

/** Un viaje con la forma de acción canónica. */
function tripAsAction(t) {
  return {
    id: t.id,
    kind: 'mobility',
    nodeId: MOBILITY_MODULE.nodeId,
    nodeKey: MOBILITY_MODULE.nodeKey,
    categoryId: 'movilidad',
    sequence: t.seq,
    title: `Viaje verificado · ${t.transportModeLabel} · ${t.distanceKm} km`,
    date: t.date,
    dateLabel: dateLabelOf(t.date),
    status: ACTION_STATUS.VERIFIED,

    /* Dato productivo del nodo de Martín, no un fixture: los cinco paquetes
       existen, con evidencia y hash verificable. Es la diferencia con las 8
       facturas EDESUR, que sí son fixtures de demo. */
    dataMode: DATA_MODE.PRODUCTION,
    owner: MOBILITY_MODULE.nodeId,
    institutionAttribution: 'none',

    provenance: {
      distance: 'source',
      co2e: 'source',
      ses: 'source',
      hash: 'source',
    },

    /* ── Sobre común: qué se midió y qué resultó ────────────── */
    metric: {
      label: 'Distancia',
      value: t.distanceKm,
      unit: 'km',
      status: STEP_STATUS.COMPLETE,
    },
    outcome: {
      label: 'CO₂e evitado',
      value: t.co2eAvoidedKg,
      unit: 'kg',
      /* Movilidad no compara contra una línea base de consumo propio, así que
         no hay variación porcentual. `null` es el dato correcto: no es un
         hueco a completar. */
      deltaPct: null,
      direction: t.isGenesis ? 'baseline' : 'reduction',
      status: STEP_STATUS.COMPLETE,
    },
    baseline: {
      value: null,
      unit: null,
      method: t.isGenesis
        ? 'Genesis Baseline de la categoría'
        : `Modo de referencia · ${'autocar térmico'}`,
      status: STEP_STATUS.COMPLETE,
    },

    evidence: {
      kind: 'Captura de actividad',
      provider: t.sourceProvider,
      format: 'JPEG',
      receivedAt: t.date,
      status: STEP_STATUS.COMPLETE,
    },

    ses: {
      delta: t.sesDelta,
      band: t.isGenesis ? 'genesis_baseline' : null,
      label: t.isGenesis ? 'Genesis Baseline' : 'Viaje verificado',
      status: STEP_STATUS.COMPLETE,
    },

    mrv: {
      status: STEP_STATUS.COMPLETE,
      standard: t.mrvClass.replace('_', ' · '),
      verifier: `Sustain Protocol · profundidad ${t.verificationDepth}`,
      verifiedAt: t.date,
    },

    /* Hash real y verificable; CID y transacción pendientes en la fuente. */
    anchor: {
      hash: t.sha256,
      hashStatus: STEP_STATUS.COMPLETE,
      algorithm: 'SHA-256',
      cid: t.ipfsCid,
      cidStatus: t.ipfsCid ? STEP_STATUS.COMPLETE : STEP_STATUS.PENDING,
      tx: t.chainAnchorTx,
      chainId: ANCHOR_STATE.chainId,
      network: ANCHOR_STATE.network,
      contract: ANCHOR_STATE.contract,
      chainStatus: t.chainAnchorTx ? STEP_STATUS.COMPLETE : STEP_STATUS.PENDING,
      blockNumber: null,
      timestamp: null,
    },

    dataRoom: mobilityDataRoom(t),

    /** Módulo donde se abre el detalle de esta acción. */
    detailPath: { module: 'movilidad', query: `trip=${t.id}` },

    /** El viaje original, para las vistas que necesitan el dato completo. */
    source: t,
  };
}

export const MOBILITY_AS_ACTIONS = MOBILITY_ACTIONS.map(tripAsAction);
