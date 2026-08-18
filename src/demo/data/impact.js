/* ============================================================
   IMPACTO POR CATEGORÍA — Fase 5
   ============================================================
   § 4 del brief: el Impact Dashboard con las 13 categorías.

   ------------------------------------------------------------
   EL DATO INCÓMODO QUE ESTE MÓDULO TIENE QUE MOSTRAR
   ------------------------------------------------------------
   El brief pide 13 categorías. Ningún nodo las tiene todas, y las que tiene no
   son todas de la misma naturaleza. Un Impact Dashboard que pinte 13 tarjetas
   con números sería mentir sobre la mayoría.

   Este módulo cruza las 13 del brief con el estado real de cada una en el nodo
   y muestra la diferencia: qué mide, qué falta y por qué.

   ------------------------------------------------------------
   ⚠ ACTUALIZADO 18 ago 2026 — procedencia
   ------------------------------------------------------------
   Se agrega el estado HISTORICAL. El Entregable 3 § 4.5 exige que cada KPI
   muestre su procedencia y que "needs_review no alimente KPI públicos": un
   dato documentado en el expediente de la escuela y un dato verificado por el
   pipeline no pueden pintarse igual aunque los dos "tengan número".

   Las funciones pasaron de recibir `nodeSlug` a recibir el nodo entero, por el
   mismo motivo que actionsForNode: el usuario final no tiene slug.
   ============================================================ */

import { CATEGORY_ORDER, CATEGORIES } from './categories.js';
import { ACTIONS, actionsByCategory } from './actions.js';
import { INSTITUTIONS } from './institutions.js';
import { dashboardKeyOf } from './sustainNodes.js';
import { categoryIndicators, unmappedCanonicalCategories } from './montessori/index.js';

export const COVERAGE = {
  ACTIVE: 'active',         // verificada por Sustain, con datos cargados
  HISTORICAL: 'historical', // documentada en el expediente, sin verificar
  LOADING: 'loading',       // evidencia recibida, sin procesar
  PENDING: 'pending',       // declarada en el piloto, sin arrancar
  OUT_OF_SCOPE: 'out',      // no está en el alcance del piloto
};

export const COVERAGE_STYLE = {
  [COVERAGE.ACTIVE]: { label: 'Verificado Sustain', color: '#1E9E72' },
  [COVERAGE.HISTORICAL]: { label: 'Histórico documental', color: '#8A7BB8' },
  [COVERAGE.LOADING]: { label: 'En carga', color: '#29DDF5' },
  [COVERAGE.PENDING]: { label: 'Próximo', color: '#3E5E92' },
  [COVERAGE.OUT_OF_SCOPE]: { label: 'Fuera de alcance', color: '#2A4A7A' },
};

/* Nombre del módulo del nodo → id de categoría del brief.
   Incluye los nombres del histórico institucional de Montessori. Mantenimiento
   se mapea a gobernanza/eficiencia operativa por indicación del Entregable 3
   § 4.5, que cierra la discrepancia D6 abierta en nodeTypes.js. */
const PILOT_MODULE_TO_CATEGORY = {
  'Energía': 'energia',
  'Agua': 'agua',
  'Gas': 'gas',
  'Reciclaje': 'reciclaje',
  'Compostaje': 'compostaje',
  'Reforestación': 'reforestacion',
  'Botellas de Amor': 'botellasDeAmor',
  'Compra Sostenible': 'comprasSostenibles',
  'Residuos y circularidad': 'reciclaje',
  'Biodiversidad': 'reforestacion',
  'Educación ambiental': 'educacionAmbiental',
  'Movilidad': 'movilidad',
  'Compras sostenibles': 'comprasSostenibles',
};

const PILOT_STATUS_TO_COVERAGE = {
  active: COVERAGE.ACTIVE,
  historical: COVERAGE.HISTORICAL,
  loading: COVERAGE.LOADING,
  pending: COVERAGE.PENDING,
  scoping: COVERAGE.PENDING,
};

/** Métricas reales de una categoría que sí tiene acciones cargadas. */
function metricsFor(categoryId, nodeKey) {
  const acts = actionsByCategory(categoryId)
    .filter((a) => a.nodeKey === nodeKey)
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
export function categoryCoverage(node) {
  const nodeKey = dashboardKeyOf(node);
  const inst = INSTITUTIONS[nodeKey];

  const pilot = new Map();
  for (const m of inst?.modules ?? []) {
    const catId = PILOT_MODULE_TO_CATEGORY[m.name];
    if (catId) pilot.set(catId, m);
  }

  /* Los indicadores canónicos sólo existen para el nodo institucional. Un nodo
     personal no tiene expediente del que importar mediciones. */
  const canonical = nodeKey === 'montessori';

  const rows = CATEGORY_ORDER.map((id) => {
    const mod = pilot.get(id);
    /* Un nodo sin `modules` declarados (el usuario final) deriva su cobertura
       de las acciones que realmente tiene. Antes esto devolvía todo fuera de
       alcance porque sólo miraba INSTITUTIONS. */
    const metrics = metricsFor(id, nodeKey);
    const indicators = canonical ? categoryIndicators(id) : [];

    let coverage;
    if (metrics) coverage = COVERAGE.ACTIVE;
    else if (mod) coverage = PILOT_STATUS_TO_COVERAGE[mod.status] ?? COVERAGE.PENDING;
    else if (indicators.length) coverage = COVERAGE.HISTORICAL;
    else coverage = COVERAGE.OUT_OF_SCOPE;

    const conDato = indicators.filter((i) => i.total).length;

    return {
      category: CATEGORIES[id],
      coverage,
      note: mod?.metric
        ?? (metrics ? `${metrics.actions} acciones verificadas` : 'No incluida en el alcance del piloto'),
      // El histórico documental no trae serie de consumo/baseline: no pasó por
      // el pipeline, así que no hay línea base que graficar.
      metrics: coverage === COVERAGE.ACTIVE ? metrics : null,
      /* Indicadores del expediente. Alimentan la tarjeta cuando la categoría es
         histórica: números reales con su procedencia, sin línea base. */
      indicators,
      indicatorsWithData: conDato,
    };
  });

  const rank = {
    [COVERAGE.ACTIVE]: 0,
    [COVERAGE.HISTORICAL]: 1,
    [COVERAGE.LOADING]: 2,
    [COVERAGE.PENDING]: 3,
    [COVERAGE.OUT_OF_SCOPE]: 4,
  };
  return rows.sort((a, b) => rank[a.coverage] - rank[b.coverage]);
}

export function coverageSummary(rows) {
  const by = (c) => rows.filter((r) => r.coverage === c).length;
  return {
    total: rows.length,
    active: by(COVERAGE.ACTIVE),
    historical: by(COVERAGE.HISTORICAL),
    loading: by(COVERAGE.LOADING),
    pending: by(COVERAGE.PENDING),
    out: by(COVERAGE.OUT_OF_SCOPE),
  };
}

/**
 * Lo que el nodo tiene y la taxonomía Sustain no contempla.
 *
 * Dos fuentes: los módulos declarados que no mapean a ninguna de las 13, y las
 * categorías canónicas del expediente sin equivalente (governance y
 * social_sustainability). El § 4.5 pide no inventarles categoría propia hasta
 * que se defina la taxonomía definitiva.
 */
export function unmappedPilotModules(node) {
  const key = dashboardKeyOf(node);
  const inst = INSTITUTIONS[key];
  const fromModules = (inst?.modules ?? [])
    .filter((m) => !PILOT_MODULE_TO_CATEGORY[m.name])
    .map((m) => ({ name: m.name, metric: m.metric }));

  const fromCanonical = key === 'montessori'
    ? unmappedCanonicalCategories().map((u) => ({
        name: u.programs.map((p) => p.name).join(', '),
        metric: `Categoría canónica «${u.category}» · ${u.programs.length} programa${u.programs.length === 1 ? '' : 's'}`,
      }))
    : [];

  return [...fromModules, ...fromCanonical];
}

/** Serie del SES acumulado a lo largo de las acciones del nodo. */
export function sesHistory(node) {
  const nodeKey = dashboardKeyOf(node);
  const acts = ACTIONS
    .filter((a) => a.nodeKey === nodeKey)
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
