/* ============================================================
   TAXONOMÍA DE CATEGORÍAS DE IMPACTO — Dashboard v2.0
   ============================================================
   Las 13 categorías del brief (drive-files/txt.txt § 4 "Impact Dashboard").
   Fuente única de verdad para: Impact Dashboard, Mis Acciones, Data Room,
   Reportes y la config por tipo de nodo (nodeTypes.js).

   DISTINCIÓN ESTRUCTURAL — `measurement`
   Las 13 categorías no se miden igual, y eso cambia la UI de cada una:

     'reduction'    → se mide contra una línea base (baseline). El resultado es
                      un % de variación y puede ser positivo o NEGATIVO para el
                      SES. Evidencia típica: factura de servicio.
                      Necesita: gráfico consumo-vs-baseline + delta %.

     'contribution' → cantidad absoluta aportada. Nunca es negativa; no hay
                      baseline contra el cual comparar. Evidencia típica: foto,
                      remito, certificado de disposición.
                      Necesita: gráfico acumulado + total.

   Mezclar ambos tipos en un mismo componente de gráfico es el error a evitar:
   un donut de "reducción" no tiene sentido y una serie baseline-vs-real
   tampoco lo tiene para "cantidad de limpiezas".

   ICONOS: se mantiene el set emoji ya en uso en institutions.js / user.js para
   no romper las vistas actuales. La unificación a un set de íconos de línea
   está pendiente (ver docs/dashboard-v2-plan.md § 6).

   COLORES: tomados de src/styles/tokens.css. Las dos variantes de verde
   marcadas ↯ no existen todavía como token y deberían agregarse a tokens.css
   como --green-400 / --green-800 antes de usarlas en producción.
   ============================================================ */

export const MEASUREMENT = {
  REDUCTION: 'reduction',
  CONTRIBUTION: 'contribution',
};

export const CATEGORIES = {
  energia: {
    id: 'energia',
    name: 'Energía',
    icon: '⚡',
    color: '#B8860B', // --amber-600
    measurement: MEASUREMENT.REDUCTION,
    unit: 'kWh',
    rateUnit: 'kWh/día',
    baselineMethod: 'Smart Historical Baseline',
    evidenceTypes: ['Factura de electricidad (PDF)', 'Lectura de medidor', 'Datos de medidor inteligente'],
    providers: ['EDESUR', 'EDENOR', 'EPE', 'EPEC'],
    indicators: [
      { key: 'consumption', label: 'Consumo real', unit: 'kWh/día' },
      { key: 'baseline', label: 'Línea base', unit: 'kWh/día' },
      { key: 'deltaPct', label: 'Variación vs. línea base', unit: '%' },
      { key: 'saved', label: 'Energía ahorrada', unit: 'kWh' },
      { key: 'co2e', label: 'CO₂e evitado', unit: 'kg' },
    ],
  },

  agua: {
    id: 'agua',
    name: 'Agua',
    icon: '💧',
    color: '#29DDF5', // --brand-500
    measurement: MEASUREMENT.REDUCTION,
    unit: 'L',
    rateUnit: 'L/día',
    baselineMethod: 'Smart Historical Baseline',
    evidenceTypes: ['Factura de agua (PDF)', 'Lectura de medidor'],
    providers: ['AySA', 'Aguas Provinciales'],
    indicators: [
      { key: 'consumption', label: 'Consumo real', unit: 'L/día' },
      { key: 'baseline', label: 'Línea base', unit: 'L/día' },
      { key: 'deltaPct', label: 'Variación vs. línea base', unit: '%' },
      { key: 'saved', label: 'Agua ahorrada', unit: 'L' },
    ],
  },

  gas: {
    id: 'gas',
    name: 'Gas',
    icon: '🔥',
    color: '#D64545', // --red-600
    measurement: MEASUREMENT.REDUCTION,
    unit: 'm³',
    rateUnit: 'm³/día',
    baselineMethod: 'Smart Historical Baseline',
    evidenceTypes: ['Factura de gas (PDF)', 'Lectura de medidor'],
    providers: ['Metrogas', 'Naturgy', 'Camuzzi'],
    indicators: [
      { key: 'consumption', label: 'Consumo real', unit: 'm³/día' },
      { key: 'baseline', label: 'Línea base', unit: 'm³/día' },
      { key: 'deltaPct', label: 'Variación vs. línea base', unit: '%' },
      { key: 'saved', label: 'Gas ahorrado', unit: 'm³' },
      { key: 'co2e', label: 'CO₂e evitado', unit: 'kg' },
    ],
  },

  reciclaje: {
    id: 'reciclaje',
    name: 'Reciclaje',
    icon: '♻️',
    color: '#1E9E72', // --green-600
    measurement: MEASUREMENT.CONTRIBUTION,
    unit: 'kg',
    baselineMethod: null,
    evidenceTypes: ['Fotografía del material', 'Remito de cooperativa', 'Certificado de disposición'],
    materials: ['Plástico', 'Papel y cartón', 'Vidrio', 'Metal', 'Tetra Brik'],
    indicators: [
      { key: 'weight', label: 'Material desviado', unit: 'kg' },
      { key: 'byMaterial', label: 'Desglose por material', unit: 'kg' },
      { key: 'co2e', label: 'CO₂e evitado', unit: 'kg' },
    ],
  },

  compostaje: {
    id: 'compostaje',
    name: 'Compostaje',
    icon: '🌱',
    color: '#57C08A', // ↯ tint de --green-600, agregar como --green-400
    measurement: MEASUREMENT.CONTRIBUTION,
    unit: 'kg',
    baselineMethod: null,
    evidenceTypes: ['Fotografía de compostera', 'Registro de pesaje'],
    indicators: [
      { key: 'weight', label: 'Orgánico compostado', unit: 'kg' },
      { key: 'compostProduced', label: 'Compost generado', unit: 'kg' },
      { key: 'co2e', label: 'CH₄ evitado (CO₂e)', unit: 'kg' },
    ],
  },

  limpiezas: {
    id: 'limpiezas',
    name: 'Limpiezas',
    icon: '🧹',
    color: '#E8BEE0', // --soft-300
    measurement: MEASUREMENT.CONTRIBUTION,
    unit: 'acciones',
    baselineMethod: null,
    evidenceTypes: ['Fotografía antes/después', 'Geolocalización', 'Listado de participantes'],
    indicators: [
      { key: 'events', label: 'Limpiezas realizadas', unit: 'acciones' },
      { key: 'weight', label: 'Residuo retirado', unit: 'kg' },
      { key: 'participants', label: 'Participantes', unit: 'personas' },
      { key: 'area', label: 'Superficie intervenida', unit: 'm²' },
    ],
  },

  botellasDeAmor: {
    id: 'botellasDeAmor',
    name: 'Botellas de Amor',
    icon: '🍼',
    color: '#1EC0D8', // --brand-700
    measurement: MEASUREMENT.CONTRIBUTION,
    unit: 'unidades',
    baselineMethod: null,
    evidenceTypes: ['Fotografía de botellas', 'Remito de entrega', 'Registro de pesaje'],
    indicators: [
      { key: 'units', label: 'Botellas entregadas', unit: 'unidades' },
      { key: 'weight', label: 'Plástico flexible desviado', unit: 'kg' },
    ],
  },

  textil: {
    id: 'textil',
    name: 'Textil',
    icon: '🧵',
    color: '#97ECF9', // --brand-300
    measurement: MEASUREMENT.CONTRIBUTION,
    unit: 'kg',
    baselineMethod: null,
    evidenceTypes: ['Fotografía de prendas', 'Remito de donación o reciclado'],
    indicators: [
      { key: 'weight', label: 'Textil recuperado', unit: 'kg' },
      { key: 'garments', label: 'Prendas', unit: 'unidades' },
      { key: 'destination', label: 'Destino', unit: null },
    ],
  },

  raee: {
    id: 'raee',
    name: 'RAEE',
    fullName: 'Residuos de Aparatos Eléctricos y Electrónicos',
    icon: '🔌',
    color: '#3E5E92', // --ink-500
    measurement: MEASUREMENT.CONTRIBUTION,
    unit: 'kg',
    baselineMethod: null,
    evidenceTypes: ['Fotografía del equipo', 'Certificado de disposición final', 'Manifiesto de transporte'],
    indicators: [
      { key: 'weight', label: 'RAEE gestionado', unit: 'kg' },
      { key: 'units', label: 'Equipos', unit: 'unidades' },
      { key: 'operator', label: 'Operador habilitado', unit: null },
    ],
  },

  reforestacion: {
    id: 'reforestacion',
    name: 'Reforestación',
    icon: '🌳',
    color: '#14664A', // ↯ shade de --green-600, agregar como --green-800
    measurement: MEASUREMENT.CONTRIBUTION,
    unit: 'árboles',
    baselineMethod: null,
    evidenceTypes: ['Fotografía de plantación', 'Geolocalización', 'Especie y cantidad', 'Seguimiento de supervivencia'],
    indicators: [
      { key: 'trees', label: 'Árboles plantados', unit: 'árboles' },
      { key: 'species', label: 'Especies', unit: null },
      { key: 'survivalRate', label: 'Tasa de supervivencia', unit: '%' },
      { key: 'co2e', label: 'CO₂e capturado (proyectado)', unit: 'kg/año' },
    ],
  },

  comprasSostenibles: {
    id: 'comprasSostenibles',
    name: 'Compras Sostenibles',
    icon: '🛒',
    color: '#F2D4EF', // --soft-200
    measurement: MEASUREMENT.CONTRIBUTION,
    unit: 'compras',
    baselineMethod: null,
    evidenceTypes: ['Factura o comprobante', 'Certificación del producto', 'Datos del proveedor'],
    indicators: [
      { key: 'purchases', label: 'Compras registradas', unit: 'compras' },
      { key: 'amount', label: 'Monto', unit: 'ARS' },
      { key: 'certifiedShare', label: 'Proveedores certificados', unit: '%' },
    ],
  },

  movilidad: {
    id: 'movilidad',
    name: 'Movilidad',
    icon: '🚲',
    color: '#6F88AE', // --ink-300
    measurement: MEASUREMENT.REDUCTION,
    unit: 'km',
    baselineMethod: 'Modal Shift Baseline',
    evidenceTypes: ['Registro de viaje', 'Geolocalización', 'Comprobante de transporte'],
    indicators: [
      { key: 'distance', label: 'Distancia en modo sostenible', unit: 'km' },
      { key: 'baseline', label: 'Línea base (modo habitual)', unit: 'km' },
      { key: 'co2e', label: 'CO₂e evitado', unit: 'kg' },
    ],
  },

  educacionAmbiental: {
    id: 'educacionAmbiental',
    name: 'Educación Ambiental',
    icon: '📚',
    color: '#2A4A7A', // --ink-700
    measurement: MEASUREMENT.CONTRIBUTION,
    unit: 'actividades',
    baselineMethod: null,
    evidenceTypes: ['Fotografía de la actividad', 'Listado de asistentes', 'Material didáctico', 'Certificado'],
    indicators: [
      { key: 'activities', label: 'Actividades realizadas', unit: 'actividades' },
      { key: 'participants', label: 'Participantes alcanzados', unit: 'personas' },
      { key: 'hours', label: 'Horas de formación', unit: 'h' },
    ],
  },
};

/** Orden canónico de presentación — el del brief. */
export const CATEGORY_ORDER = [
  'energia',
  'agua',
  'gas',
  'reciclaje',
  'compostaje',
  'limpiezas',
  'botellasDeAmor',
  'textil',
  'raee',
  'reforestacion',
  'comprasSostenibles',
  'movilidad',
  'educacionAmbiental',
];

export const CATEGORY_LIST = CATEGORY_ORDER.map((id) => CATEGORIES[id]);

export const getCategory = (id) => CATEGORIES[id] ?? null;

export const categoriesByMeasurement = (measurement) =>
  CATEGORY_LIST.filter((c) => c.measurement === measurement);
