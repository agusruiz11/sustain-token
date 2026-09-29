/* ============================================================
   ACCIONES INSTITUCIONALES — entrega 05_INSTITUTIONS (28 sep 2026)
   ============================================================
   Adaptador. Traduce la proyección generada por scripts/import-dashboard-sync
   (data/institutional/imported.js) al sobre canónico que ya usan las
   acciones de energía, plástico y movilidad, para que Mis Acciones, Timeline,
   Auditoría, Reportes, Identidad y Data Room lean el mismo universo.

   Son las primeras acciones REALES de instituciones en el piloto:

     · Montessori (spn_776c056a5d48505e28e48471): 3 acciones, todas con
       política RECORD_ONLY. Se registran como hechas; NO suman SES ni KPI
       físico. La pantalla dice "Puntaje no asignado", nunca "impacto cero".
     · Posicionarte (spn_394da9811c6ea308b5841147): 1 limpieza comunitaria
       con SES 8 por la acción, 4 a cada participante y 8 al nodo como
       referencia no aditiva. Nunca 8+4+4.

   ------------------------------------------------------------
   QUÉ NO HACE ESTE ARCHIVO
   ------------------------------------------------------------
   No recalcula nada: cada valor sale literal de la proyección. Un `null` del
   paquete sigue siendo "no medido", no 0. No inventa fecha del hecho: si
   `occurred_on` es null, la ficha dice "Fecha de actividad no informada" y
   usa la fecha de recepción sólo para ordenar, con etiqueta distinta.

   ------------------------------------------------------------
   hash_only, NO IPFS
   ------------------------------------------------------------
   Estas acciones no tienen CID: la evidencia no se subió a IPFS. El campo
   histórico ipfsCid del contrato lleva un SHA-256 del manifiesto canónico.
   Por eso el paso CID se muestra como "No aplica · hash_only", que es un
   estado propio, distinto de "pendiente". Aviso de Martín del 28/09/2026.

   ------------------------------------------------------------
   ANCLAJE VERIFICADO POR NOSOTROS
   ------------------------------------------------------------
   Las cuatro transacciones se verificaron contra un nodo público de BNB
   Smart Chain con scripts/verify-onchain.mjs (ver onchainVerification.js).
   `anchor.verification` lleva ese resultado con fecha. Es la primera vez
   que el piloto tiene anclaje confirmado por bloque y no sólo declarado.
   ============================================================ */

import { IMPORTED_ACTIONS, IMPORTED_INSTITUTIONS } from './institutional/imported.js';
import { ONCHAIN_VERIFICATION, ONCHAIN_VERIFIED_AT } from './institutional/onchainVerification.js';
import { ACTION_STATUS, STEP_STATUS, ACTION_KIND } from './actionShape.js';
import { DATA_MODE } from './sustainNodes.js';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const dateLabelOf = (iso) => {
  if (!iso) return null;
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${Number(d)} ${MESES[Number(m) - 1]} ${y}`;
};

/** Nodo Sustain → clave de dashboard. Nunca se infiere del nombre. */
export const INSTITUTION_DASHBOARD_KEY = {
  spn_776c056a5d48505e28e48471: 'montessori',
  spn_394da9811c6ea308b5841147: 'posicionarte',
};

/** Módulo del paquete → tipo de acción y categoría del brief. */
const MODULE_MAP = {
  cleanup: { kind: ACTION_KIND.CLEANUP, categoryId: 'limpiezas' },
  environmental_education: { kind: ACTION_KIND.EDUCATION, categoryId: 'educacionAmbiental' },
  reforestation: { kind: ACTION_KIND.REFORESTATION, categoryId: 'reforestacion' },
};

/* Estados de custodia del access_policy, en castellano. El texto original
   queda en `source.media.schoolOnlyStatus`. */
const SCHOOL_ONLY_LABELS = {
  'five child photos school_only; technical ZIP contains restricted hashes and reported venue':
    'cinco fotos con menores quedan en la escuela; el ZIP técnico lleva hashes restringidos y el predio informado',
  'designs_candidate; installation photos omitted; child media school_only':
    'los diseños son candidatos editoriales; las fotos de instalación y el material con menores quedan en la escuela',
  'two garden photos candidate; additional child media school_only':
    'dos fotos de la huerta son candidatas editoriales; el resto del material con menores queda en la escuela',
};
const schoolOnlyLabel = (raw) => SCHOOL_ONLY_LABELS[raw] ?? raw;

/** Título editorial en castellano. El JSON fuente no se toca (manual v2). */
const EDITORIAL_TITLE = {
  spa_1d5ab097e8ef11a8c1f5a0b1: 'Limpieza comunitaria de espacio público · Mar del Plata',
};

/**
 * Qué se midió y qué resultó, por tipo. Todos son aportes (contribution):
 * no hay línea base contra la cual comparar, y la cantidad física casi
 * siempre es null porque el paquete no la mide. Lo que sí es verificable es
 * que la acción ocurrió y fue documentada: eso es lo que se cuenta.
 */
function envelopeOf(p) {
  const m = p.mrv.measurement ?? {};
  switch (p.module) {
    case 'cleanup':
      return {
        metric: {
          label: 'Residuo retirado',
          value: m.waste_mass_kg ?? null,
          unit: 'kg',
          status: m.waste_mass_kg === null || m.waste_mass_kg === undefined ? STEP_STATUS.UNAVAILABLE : STEP_STATUS.COMPLETE,
          note: m.qualitative_quantity ? `Cualitativo: ${m.qualitative_quantity}` : null,
        },
        outcome: {
          label: 'Limpieza verificada',
          value: p.mrv.result?.cleanup_activity_verified ? 1 : 0,
          unit: 'acción',
          deltaPct: null,
          direction: 'contribution',
          status: STEP_STATUS.COMPLETE,
        },
      };
    case 'reforestation':
      return {
        metric: {
          label: 'Plantines visibles en fotos (mínimo)',
          value: m.saplings_visible_min ?? null,
          unit: 'plantín',
          status: STEP_STATUS.COMPLETE,
          /* No es "árboles plantados": el total y la supervivencia no están.
             Se muestra como observación, no como cantidad medida. */
          kpiEligible: false,
          note: 'No es un total plantado ni sobreviviente; no entra al KPI de árboles.',
        },
        outcome: {
          label: 'Plantaciones documentadas',
          value: m.planting_events_documented ?? 1,
          unit: 'plantación',
          deltaPct: null,
          direction: 'contribution',
          status: STEP_STATUS.COMPLETE,
        },
      };
    default: { // environmental_education
      const designs = m.design_files_supplied ?? null;
      const beds = m.beds_observed_in_photos ?? null;
      return {
        metric: designs !== null
          ? { label: 'Diseños aportados', value: designs, unit: 'diseños', status: STEP_STATUS.COMPLETE, note: 'Cobertura total no inventariada.' }
          : { label: 'Canteros visibles en fotos', value: beds, unit: 'canteros', status: beds === null ? STEP_STATUS.UNAVAILABLE : STEP_STATUS.COMPLETE, kpiEligible: false, note: 'El total de canteros y plantas no está establecido.' },
        outcome: {
          label: 'Actividades documentadas',
          value: 1,
          unit: 'actividad',
          deltaPct: null,
          direction: 'contribution',
          status: STEP_STATUS.COMPLETE,
        },
      };
    }
  }
}

/** SES según la política aplicada. RECORD_ONLY no es cero. */
function sesOf(p) {
  const s = p.score;
  if (s.policyApplied === 'RECORD_ONLY') {
    return {
      delta: null,
      policy: 'RECORD_ONLY',
      band: null,
      label: 'Puntaje no asignado · RECORD_ONLY',
      reason: s.reason,
      status: STEP_STATUS.UNAVAILABLE,
    };
  }
  return {
    delta: s.grossSesDelta,
    policy: s.policyApplied,
    band: null,
    label: `${s.policyApplied} · ${s.grossSesDelta} por la acción`,
    reason: s.reason ?? null,
    allocations: s.collectiveAllocations,
    organizationProjection: s.organizationProjection,
    scientificStatus: s.scientificStatus ?? null,
    status: STEP_STATUS.COMPLETE,
  };
}

/** Pasos 7-9: hash del manifiesto, sin CID (hash_only), anclaje verificado. */
function anchorOf(p) {
  const oc = p.registryProof.onchain;
  const v = ONCHAIN_VERIFICATION[p.actionId] ?? null;
  return {
    hash: p.integrity.canonicalRoot?.replace(/^sha256:/, '') ?? null,
    hashLabel: 'SHA-256 del manifiesto canónico',
    hashStatus: p.integrity.canonicalRoot ? STEP_STATUS.COMPLETE : STEP_STATUS.PENDING,
    algorithm: 'SHA-256',
    storageType: p.registryProof.storageType,
    cid: null,
    cidStatus: STEP_STATUS.UNAVAILABLE,
    tx: oc.transactionHash,
    chainId: oc.chainId,
    network: oc.networkName,
    contract: oc.contractAddress,
    anchorMethod: oc.anchorMethod,
    chainStatus: oc.transactionHash ? STEP_STATUS.COMPLETE : STEP_STATUS.PENDING,
    blockNumber: oc.blockNumber,
    timestamp: oc.blockTimestamp,
    eventName: oc.eventName,
    proofValidationStatus: 'CONFIRMED',
    /* Nuestra verificación, no la de Sustain. */
    verification: v
      ? { verified: v.verified, verifiedAt: ONCHAIN_VERIFIED_AT, confirmations: v.confirmations, eventSignature: v.eventSignature }
      : null,
  };
}

/** Data Room: lo que existe y lo que está bajo custodia, sin fingir archivos. */
function dataRoomOf(p) {
  const evidence = p.media.candidates.map((name) => ({
    name,
    type: name.split('.').pop(),
    label: 'Candidato editorial · publicación pendiente de aprobación de la escuela',
    redacted: false,
  }));
  if (p.media.schoolOnlyStatus && p.media.candidateCount === 0) {
    evidence.push({
      name: 'evidencia_bajo_custodia',
      type: 'lock',
      label: `Custodia escolar · ${schoolOnlyLabel(p.media.schoolOnlyStatus)}`,
      redacted: true,
    });
  }
  if (p.media.technicalZipContainsOriginalMedia) {
    evidence.push({
      name: 'fotos_y_videos_originales',
      type: 'lock',
      label: 'En el ZIP técnico · archivo interno, no público',
      redacted: true,
    });
  }
  return {
    evidence,
    artifacts: [
      { name: 'ficha_publica.json', type: 'json', label: 'Proyección pública de la acción' },
      { name: 'dashboard_sync.json', type: 'json', label: 'Paquete de sincronización · interno, no se publica' },
    ],
    reports: [],
    redactedFields: p.privacy.restrictedFields,
    hash: p.integrity.canonicalRoot?.replace(/^sha256:/, '') ?? null,
  };
}

function institutionalAction(p) {
  const map = MODULE_MAP[p.module];
  const nodeKey = INSTITUTION_DASHBOARD_KEY[p.nodeId];
  if (!map || !nodeKey) return null;

  const occurredOn = p.dates.occurredOn;
  const receivedOn = p.dates.evidenceReceivedOn;
  /* Para ordenar hace falta una fecha. Si el hecho no tiene, se usa la de
     recepción, y la etiqueta lo dice. */
  const sortDate = occurredOn ?? receivedOn ?? p.dates.anchoredAt.slice(0, 10);
  const dateLabel = occurredOn
    ? dateLabelOf(occurredOn)
    : `Fecha no informada · recibida ${dateLabelOf(receivedOn) ?? dateLabelOf(sortDate)}`;

  return {
    id: p.actionId,
    kind: map.kind,
    nodeId: p.nodeId,
    platformActionId: p.actionId,
    nodeKey,
    categoryId: map.categoryId,
    sequence: null,
    title: EDITORIAL_TITLE[p.actionId] ?? p.title,
    subtitle: p.section,
    description: p.description,
    date: sortDate,
    dateLabel,
    occurredOn,
    evidenceReceivedOn: receivedOn,
    status: ACTION_STATUS.VERIFIED,
    verificationDepth: p.validation.depth,
    validationStatus: p.validation.status,
    evidenceQuality: p.validation.evidenceQuality,
    limitations: p.mrv.limitations.length ? p.mrv.limitations : p.validation.ambiguities,
    auditNotes: p.validation.auditNotes,
    sesAfter: null,

    dataMode: DATA_MODE.PRODUCTION,
    owner: p.nodeId,
    institutionAttribution: 'institutional',
    provenance: { metric: 'source', outcome: 'source', ses: 'source', hash: 'source', tx: 'source' },

    ...envelopeOf(p),

    baseline: {
      value: null,
      unit: null,
      method: 'No aplica · aporte sin línea base',
      strategy: p.baseline.applicability,
      confidence: null,
      status: STEP_STATUS.UNAVAILABLE,
    },

    detailPath: { module: 'acciones', query: null },

    evidence: {
      kind: p.media.candidateCount > 0
        ? `${p.media.candidateCount} ${p.media.candidateCount === 1 ? 'archivo candidato' : 'archivos candidatos'} · originales bajo custodia`
        : 'Evidencia bajo custodia, no entregada a la agencia',
      provider: p.nodeId === 'spn_776c056a5d48505e28e48471' ? 'Colegio Ana María Montessori' : 'Posicionarte',
      format: p.registryProof.storageType,
      receivedAt: receivedOn ?? sortDate,
      status: STEP_STATUS.COMPLETE,
    },

    ses: sesOf(p),

    mrv: {
      status: STEP_STATUS.COMPLETE,
      standard: p.mrv.methodology.id ? `${p.mrv.methodology.id} v${p.mrv.methodology.version}` : 'Sustain MRV',
      verifier: `Sustain Protocol · ${p.validation.status ?? 'sin estado'} · ${p.mrv.methodology.calculationType ?? ''}`.trim(),
      verifiedAt: p.dates.finalizedAt?.slice(0, 10) ?? sortDate,
      methodologyStatus: p.mrv.methodology.status,
    },

    anchor: anchorOf(p),
    dataRoom: dataRoomOf(p),

    location: p.location,
    hierarchy: p.hierarchy,
    attribution: p.attribution,
    privacy: p.privacy,
    media: p.media,
    computeFootprint: p.computeFootprint,
    idempotencyKey: p.synchronization.idempotencyKey,
    source: p,
  };
}

export const INSTITUTIONAL_ACTIONS = Object.values(IMPORTED_ACTIONS)
  .map(institutionalAction)
  .filter(Boolean);

/** Acciones de un nodo institucional por clave de dashboard. */
export const institutionalActionsFor = (nodeKey) =>
  INSTITUTIONAL_ACTIONS.filter((a) => a.nodeKey === nodeKey);

/* ============================================================
   JERARQUÍA Y ACUMULACIÓN
   ============================================================
   Cada acción viene con la foto de la jerarquía con la que se ancló (v1.0,
   v1.1, v1.2). No se reescriben: se unen y se cuenta cada action_id una sola
   vez por ancestro. Los colaboradores externos (la Dirección de Ambiente de
   Lomas de Zamora) no acumulan: rollup_enabled = false.
   ============================================================ */

/**
 * Árbol de nodos Sustain de una institución con las acciones que le llegan a
 * cada uno por acumulación. `count` deduplica por action_id.
 */
export function institutionalHierarchy(nodeKey) {
  const actions = institutionalActionsFor(nodeKey);
  const nodes = new Map();
  const parents = new Map(); // child → Set(parent)  (todas las versiones)
  const currentParent = new Map(); // child → { parent, version } de la versión más nueva
  const external = new Map();
  const pendingRollups = [];

  for (const a of actions) {
    for (const n of a.hierarchy.nodes) {
      const prev = nodes.get(n.nodeId);
      nodes.set(n.nodeId, { ...n, ...(prev ?? {}), actionIds: prev?.actionIds ?? new Set(), versions: prev?.versions ?? new Set() });
      nodes.get(n.nodeId).versions.add(a.hierarchy.version);
    }
    for (const e of a.hierarchy.edges) {
      if (!parents.has(e.child)) parents.set(e.child, new Set());
      parents.get(e.child).add(e.parent);
      /* Para dibujar el árbol se usa el padre de la versión más nueva; la
         foto histórica queda registrada en `parents`, no se reescribe. */
      const cur = currentParent.get(e.child);
      if (!cur || a.hierarchy.version > cur.version) currentParent.set(e.child, { parent: e.parent, version: a.hierarchy.version });
    }
    for (const c of a.hierarchy.externalCollaborators) {
      const prev = external.get(c.nodeId);
      external.set(c.nodeId, { ...c, actionIds: prev?.actionIds ?? new Set() });
      external.get(c.nodeId).actionIds.add(a.id);
    }
    /* La acción cuenta en el nodo al que pertenece directamente (la hoja de
       su jerarquía: el que no es padre de nadie en esa foto) y en todos sus
       ancestros. */
    const childIds = new Set(a.hierarchy.edges.map((e) => e.child));
    const parentIds = new Set(a.hierarchy.edges.map((e) => e.parent));
    const leaves = [...childIds].filter((id) => !parentIds.has(id));
    const start = leaves.length ? leaves : [a.nodeId];
    pendingRollups.push({ actionId: a.id, start });
  }

  /* La acumulación se resuelve al final, por el árbol ACTUAL (padre de la
     versión más nueva), para que un nivel creado en v1.2 reciba también las
     acciones que su cohorte ancló en v1.0. Cada action_id cuenta una vez por
     ancestro; la foto histórica de cada acción no se modifica. */
  for (const { actionId, start } of pendingRollups) {
    const seen = new Set();
    const stack = [...start];
    while (stack.length) {
      const id = stack.pop();
      if (seen.has(id)) continue;
      seen.add(id);
      nodes.get(id)?.actionIds.add(actionId);
      const p = currentParent.get(id)?.parent;
      if (p) stack.push(p);
    }
  }

  const list = [...nodes.values()].map((n) => ({
    nodeId: n.nodeId,
    displayName: n.displayName,
    nodeType: n.nodeType,
    publicIdentity: n.publicIdentity,
    parents: [...(parents.get(n.nodeId) ?? [])],
    parent: currentParent.get(n.nodeId)?.parent ?? null,
    /* Padres que tuvo en versiones anteriores y ya no: se informan, no se borran. */
    formerParents: [...(parents.get(n.nodeId) ?? [])].filter((p) => p !== currentParent.get(n.nodeId)?.parent),
    count: n.actionIds.size,
    actionIds: [...n.actionIds],
    versions: [...n.versions].sort(),
  }));

  /* Profundidad para indentar, por el padre actual. Raíz = sin padre. */
  const depthOf = (id, d = 0) => {
    const p = currentParent.get(id)?.parent;
    return p ? depthOf(p, d + 1) : d;
  };
  for (const n of list) n.depth = depthOf(n.nodeId);

  /* Orden: recorrido en profundidad desde la raíz, por el padre actual. */
  const childrenOf = (id) => list.filter((n) => n.parent === id);
  const ordered = [];
  const walk = (n) => { ordered.push(n); childrenOf(n.nodeId).forEach(walk); };
  list.filter((n) => n.depth === 0).forEach(walk);

  return {
    nodes: ordered,
    external: [...external.values()].map((c) => ({ ...c, count: c.actionIds.size, actionIds: [...c.actionIds] })),
    totalActions: actions.length,
  };
}

export { IMPORTED_INSTITUTIONS };
