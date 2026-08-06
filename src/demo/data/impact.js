/* ============================================================
   IMPACTO POR CATEGORÍA — Fase 5
   ============================================================
   § 4 del brief: el Impact Dashboard con las 13 categorías.

   ------------------------------------------------------------
   EL DATO INCÓMODO QUE ESTE MÓDULO TIENE QUE MOSTRAR
   ------------------------------------------------------------
   El brief pide 13 categorías. El piloto tiene **una sola con datos reales**:

     · Energía          → activa, 8 facturas verificadas
     · Agua, Gas        → facturas recibidas, sin procesar todavía
     · 5 categorías más → declaradas en el piloto, sin arrancar
     · 5 categorías     → ni siquiera están en el alcance del piloto

   Un Impact Dashboard que pinte 13 tarjetas con números sería mentir sobre 12
   de ellas. Este módulo cruza las 13 del brief con el estado real de cada una en
   `institutions.js` y muestra la diferencia: qué mide, qué falta y por qué.

   Para el cliente eso no es una debilidad — es el mapa de lo que queda por
   incorporar, que es exactamente la conversación que tiene con la escuela.
   ============================================================ */

import { CATEGORY_ORDER, CATEGORIES } from './categories.js';
import { ACTIONS, actionsByCategory } from './actions.js';
import { INSTITUTIONS } from './institutions.js';

export const COVERAGE = {
  ACTIVE: 'active',       // con datos reales cargados
  LOADING: 'loading',     // evidencia recibida, sin procesar
  PENDING: 'pending',     // declarada en el piloto, sin arrancar
  OUT_OF_SCOPE: 'out',    // no está en el alcance del piloto
};

export const COVERAGE_STYLE = {
  [COVERAGE.ACTIVE]: { label: 'Con datos', color: '#1E9E72' },
  [COVERAGE.LOADING]: { label: 'En carga', color: '#29DDF5' },
  [COVERAGE.PENDING]: { label: 'Próximo', color: '#3E5E92' },
  [COVERAGE.OUT_OF_SCOPE]: { label: 'Fuera de alcance', color: '#2A4A7A' },
};

/* Nombre del módulo en el piloto → id de categoría del brief.
   "Mantenimiento Sostenible" queda deliberadamente afuera: no es una de las 13
   y su alcance está pendiente de definición (decisión D6 del plan). */
const PILOT_MODULE_TO_CATEGORY = {
  'Energía': 'energia',
  'Agua': 'agua',
  'Gas': 'gas',
  'Reciclaje': 'reciclaje',
  'Compostaje': 'compostaje',
  'Reforestación': 'reforestacion',
  'Botellas de Amor': 'botellasDeAmor',
  'Compra Sostenible': 'comprasSostenibles',
};

const PILOT_STATUS_TO_COVERAGE = {
  active: COVERAGE.ACTIVE,
  loading: COVERAGE.LOADING,
  pending: COVERAGE.PENDING,
  scoping: COVERAGE.PENDING,
};

/** Métricas reales de una categoría que sí tiene acciones cargadas. */
function metricsFor(categoryId, nodeSlug) {
  const acts = actionsByCategory(categoryId)
    .filter((a) => a.nodeSlug === nodeSlug)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (!acts.length) return null;

  const reducciones = acts.filter((a) => a.result.direction === 'reduction');
  const mejor = reducciones.length
    ? reducciones.reduce((m, a) => (a.result.deltaPct < m.result.deltaPct ? a : m))
    : null;

  return {
    actions: acts.length,
    savedPerDay: Number(reducciones.reduce((s, a) => s + a.result.savedPerDay, 0).toFixed(2)),
    bestReductionPct: mejor ? mejor.result.deltaPct : null,
    bestReductionAt: mejor ? mejor.dateLabel : null,
    series: [
      { label: 'Consumo real', color: CATEGORIES[categoryId].color, values: acts.map((a) => a.consumption.value) },
      { label: 'Línea base', color: '#3E5E92', dashed: true, values: acts.map((a) => a.baseline.value) },
    ],
    unit: acts[0].consumption.unit,
  };
}

/**
 * Las 13 categorías del brief con su estado real en el nodo.
 * Orden: primero lo que tiene datos, después lo que falta.
 */
export function categoryCoverage(nodeSlug) {
  const inst = INSTITUTIONS[nodeSlug];
  const pilot = new Map();
  for (const m of inst?.modules ?? []) {
    const catId = PILOT_MODULE_TO_CATEGORY[m.name];
    if (catId) pilot.set(catId, m);
  }

  const rows = CATEGORY_ORDER.map((id) => {
    const mod = pilot.get(id);
    const coverage = mod
      ? PILOT_STATUS_TO_COVERAGE[mod.status] ?? COVERAGE.PENDING
      : COVERAGE.OUT_OF_SCOPE;
    return {
      category: CATEGORIES[id],
      coverage,
      note: mod?.metric ?? 'No incluida en el alcance del piloto',
      metrics: coverage === COVERAGE.ACTIVE ? metricsFor(id, nodeSlug) : null,
    };
  });

  const rank = {
    [COVERAGE.ACTIVE]: 0,
    [COVERAGE.LOADING]: 1,
    [COVERAGE.PENDING]: 2,
    [COVERAGE.OUT_OF_SCOPE]: 3,
  };
  return rows.sort((a, b) => rank[a.coverage] - rank[b.coverage]);
}

export function coverageSummary(rows) {
  const by = (c) => rows.filter((r) => r.coverage === c).length;
  return {
    total: rows.length,
    active: by(COVERAGE.ACTIVE),
    loading: by(COVERAGE.LOADING),
    pending: by(COVERAGE.PENDING),
    out: by(COVERAGE.OUT_OF_SCOPE),
  };
}

/** Módulos del piloto que no corresponden a ninguna de las 13 (ver D6). */
export function unmappedPilotModules(nodeSlug) {
  const inst = INSTITUTIONS[nodeSlug];
  return (inst?.modules ?? []).filter((m) => !PILOT_MODULE_TO_CATEGORY[m.name]);
}

/** Serie del SES acumulado a lo largo de las acciones del nodo. */
export function sesHistory(nodeSlug) {
  const acts = ACTIONS
    .filter((a) => a.nodeSlug === nodeSlug)
    .sort((a, b) => a.date.localeCompare(b.date));

  let acc = 0;
  return acts.map((a) => {
    // Las acciones sin SES cargado no suman ni restan: la serie se mantiene
    // plana en lugar de inventar un salto.
    if (a.ses.delta !== null) acc += a.ses.delta;
    return {
      id: a.id,
      label: a.dateLabel,
      delta: a.ses.delta,
      accumulated: acc,
      known: a.ses.delta !== null,
    };
  });
}
