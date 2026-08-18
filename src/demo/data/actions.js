/* ============================================================
   MODELO DE ACCIÓN — Dashboard v2.0
   ============================================================
   Entidad central del producto. Cuatro módulos del brief son cuatro VISTAS
   de este mismo objeto, no cuatro modelos distintos:

     § 2  Mis Acciones  → ficha con la cadena de 10 pasos  (buildTraceability)
     § 3  Data Room     → los archivos y artefactos          (action.dataRoom)
     § 5  Timeline      → los 6 hitos en el tiempo           (buildTimeline)
     § 10 Auditoría     → los pasos criptográficos           (action.anchor)

   Cadena de trazabilidad del brief (§ 2):
     Factura → Consumo → Baseline → Resultado → SES → MRV → Hash → CID →
     Blockchain → Reportes

   ------------------------------------------------------------
   ⚠ ATRIBUCIÓN — CORREGIDO 18 ago 2026
   ------------------------------------------------------------
   Estas 8 acciones NO son de Montessori School. Pertenecen al nodo personal
   de Martín Ceron (spn_01ee6583da858ca1fa19323d, node_type: individual,
   founder_wallet) y son FIXTURES DE DEMO: facturas de él y de familiares que
   pasó para construir y probar el flujo.

   Lo aclaró tres veces —"son para mi dashboard, son mías"— y lo formalizó el
   Implementation Package en config/demo_data_policy.json:

     "Las 8 facturas EDESUR utilizadas en el demo no constituyen consumos
      reales de Montessori."

   Por eso llevan `dataMode: DATA_MODE.DEMO` y viven en /demo/usuario.
   No deben alimentar: mediciones históricas institucionales, SES oficial,
   auditorías oficiales, reportes oficiales, evidencia de certificación ni
   anclajes de producción.

   Ver src/demo/data/sustainNodes.js para la identidad del nodo.

   ------------------------------------------------------------
   PROCEDENCIA DE LOS DATOS  ⚠ LEER ANTES DE MODIFICAR
   ------------------------------------------------------------
   Los valores no son inventados. Cada uno está marcado con su origen:

     'source'   → tomado literal de src/demo/data/institutions.js, que a su vez
                  se calculó 1:1 desde los baseline_report.json / ses_score.json
                  reales del pipeline.
     'derived'  → reconstruido desde las coordenadas SVG de institutions.js
                  chartLine, con el mapa lineal calibrado sobre los dos lastVal
                  conocidos (y=30 → 19.94 kWh/día; y=88 → 11.55 kWh/día).
                  Precisión ≈ ±0.15 kWh/día por redondeo de las coordenadas.
     'inferred' → deducido de los badges + las bandas SES confirmadas.
     null       → NO SE CONOCE. No inventar: reemplazar con el valor real del
                  ses_score.json correspondiente.

   Verificación cruzada que valida la reconstrucción (los 4 dan ✓):
     22 Jun → (19.94-11.55)/11.55 = +72.6%  vs. +72.5% declarado
     19 May → (16.47-10.39)/10.39 = +58.5%  vs. +58.4% declarado
     19 Mar → 11.55 × (1-0.213)   = 9.09    vs. y=105 reconstruido
     14 Nov → consumo == baseline == 9.96   → primer registro, coherente con
              el badge "Primer Registro Verificado" del 14 Nov 2025.

   PENDIENTE DE DATO REAL:
     · sesDelta de las acciones 2 (18 Dic) y 3 (20 Ene) → hoy null.
     · periodDays de las 8 → hoy null. Sin días no se puede convertir kWh/día a
       kWh totales. El acumulado declarado (211.2 kWh) reconcilia con un
       promedio de ~26 días por período sobre los 4 períodos de reducción.
     · Los ses_score.json / baseline_report.json NO están versionados en el repo.
       Conviene incorporarlos a drive-files/ para poder regenerar esto.

   ⚠ ANCLAJE: IPFS, transacción y blockchain están "Pendiente de anclaje".
   Solo la acción del 22 Jun tiene hash calculado. Esto NO es un hueco del
   mock: es el estado real. Verificado el 18 ago 2026 sobre todo el material
   entregado — no existe un solo CID ni tx hash real en ningún archivo. El
   AGENCY_IMPLEMENTATION_BRIEF.md lo prohíbe explícitamente:

     "Do NOT invent or hardcode fake CIDs or transaction hashes and present
      them as real."

   Las vistas de Timeline, Data Room y Auditoría tienen que renderizar el
   estado 'pending' como caso de primera clase, no como error.
   ============================================================ */

import { DATA_MODE, dashboardKeyOf } from './sustainNodes.js';

export const ACTION_STATUS = {
  VERIFIED: 'verified',
  PROCESSING: 'processing',
  PENDING: 'pending',
  REJECTED: 'rejected',
};

export const STEP_STATUS = {
  COMPLETE: 'complete',
  PENDING: 'pending',
  UNAVAILABLE: 'unavailable',
};

/**
 * Bandas de clasificación SES.
 * `confirmed: true` = observada en los datos reales del piloto.
 * `confirmed: false` = banda plausible pero NO verificada; confirmar con el
 * equipo antes de mostrarla como regla del producto.
 */
export const SES_BANDS = [
  { id: 'exceptional_reduction', label: 'Exceptional Reduction', minPct: -Infinity, maxPct: -20, delta: 40, confirmed: true },
  { id: 'outstanding_reduction', label: 'Outstanding Reduction', minPct: -20, maxPct: -15, delta: 30, confirmed: true },
  { id: 'significant_reduction', label: 'Significant Reduction', minPct: -15, maxPct: -5, delta: null, confirmed: false },
  { id: 'stable', label: 'Stable Consumption', minPct: -5, maxPct: 5, delta: null, confirmed: false },
  { id: 'baseline_established', label: 'Baseline Establishment', minPct: null, maxPct: null, delta: 0, confirmed: true },
  { id: 'moderate_increase', label: 'Moderate Consumption Increase', minPct: 5, maxPct: 50, delta: null, confirmed: false },
  { id: 'major_increase', label: 'Major Consumption Increase', minPct: 50, maxPct: Infinity, delta: -30, confirmed: true },
];

const NODE = 'spn_01ee6583da858ca1fa19323d';

/** Artefactos que el pipeline produce por acción (brief § 3 Data Room). */
const energyDataRoom = (n, { hash }) => ({
  evidence: [
    { name: `factura_edesur_periodo_${n}.pdf`, type: 'pdf', label: 'Factura original', redacted: true },
  ],
  artifacts: [
    { name: 'consumption_data.json', type: 'json', label: 'Datos de consumo extraídos' },
    { name: 'baseline_report.json', type: 'json', label: 'Baseline Report' },
    { name: 'ses_score.json', type: 'json', label: 'SES Score' },
  ],
  reports: [
    { name: 'mrv_report.pdf', type: 'pdf', label: 'MRV Report', status: STEP_STATUS.COMPLETE },
    { name: 'validation_report.pdf', type: 'pdf', label: 'Validation Report', status: STEP_STATUS.COMPLETE },
    { name: 'action_report.pdf', type: 'pdf', label: 'Action Report', status: STEP_STATUS.COMPLETE },
    { name: 'dashboard_update.json', type: 'json', label: 'Dashboard Update', status: STEP_STATUS.COMPLETE },
  ],
  // Campos que NUNCA se exponen en la UI. institutions.js ya aplica este
  // criterio; el Data Room tiene que respetarlo al mostrar la factura.
  redactedFields: ['nº de cliente', 'nº de medidor', 'domicilio', 'código de pago', 'CUIT'],
  hash,
});

/**
 * Fábrica de acción de energía. Mantiene las 8 entradas legibles y evita
 * repetir la estructura de 10 pasos ocho veces.
 */
function energyAction({
  n, id, date, dateLabel, period,
  consumption, baseline, deltaPct, sesDelta, sesBand,
  hash = null, provenance,
}) {
  return {
    id,
    nodeId: NODE,
    /** Dashboard donde se muestra. El nodo de Martín es /demo/usuario. */
    nodeKey: 'usuario',
    categoryId: 'energia',
    sequence: n,
    title: `Factura EDESUR · Período liquidado ${period}`,
    date,
    dateLabel,
    status: ACTION_STATUS.VERIFIED,
    provenance,

    /* Fixture de demo, no consumo institucional real.
       config/demo_data_policy.json del Implementation Package. */
    dataMode: DATA_MODE.DEMO,
    owner: 'demo_fixture',
    institutionAttribution: 'simulated',

    // ── Paso 1 · Factura (evidencia original)
    evidence: {
      kind: 'Factura de electricidad',
      provider: 'EDESUR',
      format: 'PDF',
      receivedAt: date,
      status: STEP_STATUS.COMPLETE,
    },

    // ── Paso 2 · Consumo
    consumption: {
      value: consumption,
      unit: 'kWh/día',
      periodDays: null, // ← pendiente de dato real, ver cabecera
      totalKwh: null,   // = value × periodDays
      status: STEP_STATUS.COMPLETE,
    },

    // ── Paso 3 · Baseline
    baseline: {
      value: baseline,
      unit: 'kWh/día',
      method: 'Smart Historical Baseline',
      status: STEP_STATUS.COMPLETE,
    },

    // ── Paso 4 · Resultado
    result: {
      deltaPct,
      direction: deltaPct === 0 ? 'baseline' : deltaPct < 0 ? 'reduction' : 'increase',
      savedPerDay: baseline - consumption, // >0 ahorro, <0 exceso
      unit: 'kWh/día',
      status: STEP_STATUS.COMPLETE,
    },

    // ── Paso 5 · SES
    ses: {
      delta: sesDelta,
      band: sesBand,
      label: SES_BANDS.find((b) => b.id === sesBand)?.label ?? null,
      status: sesDelta === null ? STEP_STATUS.PENDING : STEP_STATUS.COMPLETE,
    },

    // ── Paso 6 · MRV
    mrv: {
      status: STEP_STATUS.COMPLETE,
      standard: 'Sustain MRV v1',
      verifier: 'Sustain Protocol · Verificación automatizada',
      verifiedAt: date,
    },

    // ── Pasos 7-9 · Hash, CID, Blockchain
    anchor: {
      hash,
      hashStatus: hash ? STEP_STATUS.COMPLETE : STEP_STATUS.PENDING,
      algorithm: 'SHA-256',
      cid: null,
      cidStatus: STEP_STATUS.PENDING,
      tx: null,
      network: null,
      contract: 'SustainGenesisActionRegistry',
      chainStatus: STEP_STATUS.PENDING,
      timestamp: null,
    },

    // ── Paso 10 · Reportes + Data Room (§ 3)
    dataRoom: energyDataRoom(n, { hash }),
  };
}

export const ACTIONS = [
  energyAction({
    n: 1, id: 'act_martin_energia_01', date: '2025-11-14', dateLabel: '14 Nov 2025', period: 1,
    consumption: 9.96, baseline: 9.96, deltaPct: 0,
    sesDelta: 0, sesBand: 'baseline_established',
    provenance: { consumption: 'derived', baseline: 'derived', deltaPct: 'derived', ses: 'inferred' },
  }),
  energyAction({
    n: 2, id: 'act_martin_energia_02', date: '2025-12-18', dateLabel: '18 Dic 2025', period: 2,
    consumption: 8.80, baseline: 9.96, deltaPct: -11.6,
    sesDelta: null, sesBand: 'significant_reduction',
    provenance: { consumption: 'derived', baseline: 'derived', deltaPct: 'derived', ses: null },
  }),
  energyAction({
    n: 3, id: 'act_martin_energia_03', date: '2026-01-20', dateLabel: '20 Ene 2026', period: 3,
    consumption: 16.03, baseline: 11.55, deltaPct: 38.8,
    sesDelta: null, sesBand: 'moderate_increase',
    provenance: { consumption: 'derived', baseline: 'derived', deltaPct: 'derived', ses: null },
  }),
  energyAction({
    n: 4, id: 'act_martin_energia_04', date: '2026-02-20', dateLabel: '20 Feb 2026', period: 4,
    consumption: 8.88, baseline: 11.55, deltaPct: -23.1,
    sesDelta: 40, sesBand: 'exceptional_reduction',
    provenance: { consumption: 'derived', baseline: 'derived', deltaPct: 'source', ses: 'inferred' },
  }),
  energyAction({
    n: 5, id: 'act_martin_energia_05', date: '2026-03-19', dateLabel: '19 Mar 2026', period: 5,
    consumption: 9.09, baseline: 11.55, deltaPct: -21.3,
    sesDelta: 40, sesBand: 'exceptional_reduction',
    provenance: { consumption: 'derived', baseline: 'derived', deltaPct: 'source', ses: 'source' },
  }),
  energyAction({
    n: 6, id: 'act_martin_energia_06', date: '2026-04-21', dateLabel: '21 Abr 2026', period: 6,
    consumption: 9.73, baseline: 11.55, deltaPct: -15.8,
    sesDelta: 30, sesBand: 'outstanding_reduction',
    provenance: { consumption: 'derived', baseline: 'derived', deltaPct: 'source', ses: 'source' },
  }),
  energyAction({
    n: 7, id: 'act_martin_energia_07', date: '2026-05-19', dateLabel: '19 May 2026', period: 7,
    consumption: 16.47, baseline: 10.39, deltaPct: 58.4,
    sesDelta: -30, sesBand: 'major_increase',
    provenance: { consumption: 'derived', baseline: 'derived', deltaPct: 'source', ses: 'source' },
  }),
  energyAction({
    n: 8, id: 'act_martin_energia_08', date: '2026-06-22', dateLabel: '22 Jun 2026', period: 8,
    consumption: 19.94, baseline: 11.55, deltaPct: 72.5,
    sesDelta: -30, sesBand: 'major_increase',
    hash: '39f6dade1763705ec3b59146efb14b1bfc43374372deaa87683511d57d43f47f',
    provenance: { consumption: 'source', baseline: 'source', deltaPct: 'source', ses: 'source', hash: 'source' },
  }),
];

/* ============================================================
   ACCIONES CONOCIDAS SIN PAQUETE — no inventar
   ============================================================
   node_state.json declara 14 acciones verificadas en el nodo de Martín:
   8 de energía + 1 de recuperación de plástico + 5 de movilidad.

   De la de plástico sabemos que existe y su métrica agregada
   (love_bottles_prepared: 1, plastic_prepared_kg: 0.3), pero NO llegó su
   paquete: no tenemos action_id, fecha, evidencia ni hash.

   La regla 6 del implementation_manifest.json es "No inventar datos
   faltantes", así que no se fabrica una ficha. Se declara el hueco para que
   la UI pueda decir "1 acción sin detalle disponible" en vez de mentir o de
   mostrar un total que no cierra.
   ============================================================ */
export const MISSING_ACTION_PACKAGES = [
  {
    module: 'plastic_recovery',
    nodeId: NODE,
    nodeKey: 'usuario',
    count: 1,
    knownMetrics: { loveBottlesPrepared: 1, plasticPreparedKg: 0.3 },
    missing: ['action_id', 'action_date', 'evidence', 'hash', 'ses_delta'],
    request: 'Pedir a Martín el paquete de la acción de recuperación de plástico.',
  },
];

/* ============================================================
   DERIVACIONES — una sola fuente, cuatro vistas
   ============================================================ */

/** § 2 Mis Acciones — la cadena de 10 pasos de la ficha. */
export function buildTraceability(action) {
  const { consumption, baseline, result, ses, mrv, anchor, dataRoom, evidence } = action;
  return [
    { step: 1, key: 'evidence', label: 'Factura', value: `${evidence.provider} · ${evidence.format}`, status: evidence.status },
    { step: 2, key: 'consumption', label: 'Consumo', value: `${consumption.value} ${consumption.unit}`, status: consumption.status },
    { step: 3, key: 'baseline', label: 'Baseline', value: `${baseline.value} ${baseline.unit}`, status: baseline.status },
    { step: 4, key: 'result', label: 'Resultado', value: `${result.deltaPct > 0 ? '+' : ''}${result.deltaPct}%`, status: result.status },
    { step: 5, key: 'ses', label: 'SES', value: ses.delta === null ? 'Pendiente' : `${ses.delta > 0 ? '+' : ''}${ses.delta}`, status: ses.status },
    { step: 6, key: 'mrv', label: 'MRV', value: mrv.standard, status: mrv.status },
    { step: 7, key: 'hash', label: 'Hash', value: anchor.hash, status: anchor.hashStatus },
    { step: 8, key: 'cid', label: 'CID', value: anchor.cid, status: anchor.cidStatus },
    { step: 9, key: 'chain', label: 'Blockchain', value: anchor.tx, status: anchor.chainStatus },
    { step: 10, key: 'reports', label: 'Reportes', value: `${dataRoom.reports.length} documentos`, status: STEP_STATUS.COMPLETE },
  ];
}

/** § 5 Timeline — los 6 hitos del brief, sobre el mismo objeto. */
export function buildTimeline(action) {
  const { evidence, mrv, anchor, ses, dateLabel } = action;
  return [
    { key: 'action', label: 'Acción registrada', detail: action.title, at: dateLabel, status: evidence.status },
    { key: 'validation', label: 'Validación', detail: mrv.verifier, at: dateLabel, status: mrv.status },
    { key: 'hash', label: 'Hash', detail: anchor.hash ?? 'Pendiente de cálculo', at: null, status: anchor.hashStatus },
    { key: 'ipfs', label: 'IPFS', detail: anchor.cid ?? 'Pendiente de anclaje', at: null, status: anchor.cidStatus },
    { key: 'blockchain', label: 'Blockchain', detail: anchor.tx ?? 'Pendiente de anclaje', at: null, status: anchor.chainStatus },
    { key: 'ses', label: 'Actualización del SES', detail: ses.delta === null ? 'Pendiente' : `${ses.delta > 0 ? '+' : ''}${ses.delta} pts`, at: dateLabel, status: ses.status },
  ];
}

/* ── Consultas ────────────────────────────────────────────── */

export const getAction = (id) => ACTIONS.find((a) => a.id === id) ?? null;

/**
 * Acciones Sustain de un nodo del dashboard.
 *
 * Recibe el nodo entero y no un slug porque el usuario final no tiene slug
 * (es un solo nodo, no una colección) — `dashboardKeyOf` resuelve ese caso.
 * Antes esto se llamaba `actionsByNode(node.slug)` y devolvía las 8 facturas
 * para Montessori, que era justamente la atribución equivocada.
 *
 * Un nodo sin acciones Sustain devuelve `[]`, que es un estado legítimo y no
 * un error: hoy es el caso de Montessori, que sólo tiene histórico documental.
 */
export const actionsForNode = (node) => {
  const key = dashboardKeyOf(node);
  return key ? ACTIONS.filter((a) => a.nodeKey === key) : [];
};

export const actionsByCategory = (categoryId) => ACTIONS.filter((a) => a.categoryId === categoryId);

/** Acciones más recientes primero. No muta el array original. */
export const recentActions = (limit = 4) =>
  [...ACTIONS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);

/**
 * Ahorro acumulado en los períodos de reducción, en kWh/día.
 * Devuelve null en kWh totales hasta que se carguen los periodDays reales.
 * Referencia canónica (node_state.json): 211.190949 kWh acumulados.
 *
 * Sólo mira acciones de energía: desde que el nodo tiene movilidad y plástico,
 * `ACTIONS` ya no es homogéneo y `a.result` no existe en todas.
 */
export function totalSavings(actions = ACTIONS) {
  const energy = actions.filter((a) => a.categoryId === 'energia');
  const perDay = energy
    .filter((a) => a.result.direction === 'reduction')
    .reduce((sum, a) => sum + a.result.savedPerDay, 0);
  const hasAllDays = energy.every((a) => a.consumption.periodDays !== null);
  return {
    perDay: Number(perDay.toFixed(2)),
    totalKwh: hasAllDays
      ? energy.reduce((s, a) => s + Math.max(0, a.result.savedPerDay) * a.consumption.periodDays, 0)
      : null,
    declaredTotalKwh: 211.190949,
  };
}
