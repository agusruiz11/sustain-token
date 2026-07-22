export const INSTITUTIONS = {
  montessori: {
    slug: 'montessori',
    name: 'Montessori School',
    tagline: 'Institución Educativa · Piloto Genesis',
    type: 'Institutional pilot · Evidence-anchored',
    location: 'Ciudad Autónoma de Buenos Aires, Argentina',
    memberSince: 'Jul 2026',
    accentColor: '#1E9E72',
    accentBg: 'rgba(30,158,114,0.08)',
    accentBorder: 'rgba(30,158,114,0.3)',
    initials: 'MS',
    initialsStyle: { background: 'linear-gradient(135deg, #1E9E72, #29DDF5)', color: '#fff' },

    stats: [
      { label: 'Acciones Verificadas', value: '8', icon: '✓', delta: 'Módulo Energía · 100% verificadas', deltaUp: null },
      { label: 'Energía Ahorrada (vs. línea base)', value: '211.2 kWh', icon: '⚡', delta: 'Acumulado histórico', deltaUp: null },
      { label: 'Puntaje SES Actual', value: '20', icon: '★', delta: '-30 en el último período', deltaUp: false },
      { label: 'Mejor Reducción Registrada', value: '23.1%', icon: '◉', delta: 'Feb 2026 · Exceptional Reduction', deltaUp: true },
    ],

    // Todas las series están calculadas 1:1 a partir de los baseline_report.json / ses_score.json
    // reales de las 8 facturas EDESUR verificadas (nodo spn_01ee6583da858ca1fa19323d).
    chartLine: {
      title: 'Energía: Consumo Real vs. Línea Base (kWh/día)',
      yMax: 22,
      yLabel: 'kWh/día',
      months: ['14 Nov', '18 Dic', '20 Ene', '20 Feb', '19 Mar', '21 Abr', '19 May', '22 Jun'],
      series: [
        {
          label: 'Consumo Real',
          color: '#29DDF5',
          points: '48,99 124,107 200,57 276,106 352,105 428,100 504,54 580,30',
          lastVal: '19.94 kWh/día',
        },
        {
          label: 'Línea Base (Smart Historical Baseline)',
          color: '#1E9E72',
          points: '48,99 124,99 200,88 276,88 352,88 428,88 504,96 580,88',
          lastVal: '11.55 kWh/día',
        },
      ],
    },

    chartDonut: {
      title: 'Progreso de Incorporación de Módulos',
      totalLabel: '1 / 9',
      totalSub: 'Módulos activos',
      r: 55,
      circumference: 345.6,
      segments: [
        { label: 'Energía (Activo, con datos reales)', pct: 11, color: '#1E9E72', dasharray: '38 346', dashoffset: '0' },
        { label: 'Agua, Gas y 6 módulos más (en incorporación)', pct: 89, color: '#2A4A7A', dasharray: '308 346', dashoffset: '-38' },
      ],
    },

    modules: [
      { name: 'Energía', icon: '⚡', status: 'active', statusLabel: 'Activo', metric: '8 acciones verificadas · 211.2 kWh ahorrados' },
      { name: 'Agua', icon: '💧', status: 'loading', statusLabel: 'En carga', metric: 'Facturas recibidas, mismo formato que Energía' },
      { name: 'Gas', icon: '🔥', status: 'loading', statusLabel: 'En carga', metric: 'Facturas recibidas, mismo formato que Energía' },
      { name: 'Reciclaje', icon: '♻️', status: 'pending', statusLabel: 'Próximo', metric: 'Módulo a incorporar' },
      { name: 'Compostaje', icon: '🌱', status: 'pending', statusLabel: 'Próximo', metric: 'Módulo a incorporar' },
      { name: 'Reforestación', icon: '🌳', status: 'pending', statusLabel: 'Próximo', metric: 'Módulo a incorporar' },
      { name: 'Botellas de Amor', icon: '🍼', status: 'pending', statusLabel: 'Próximo', metric: 'Módulo a incorporar' },
      { name: 'Compra Sostenible', icon: '🛒', status: 'pending', statusLabel: 'Próximo', metric: 'Módulo a incorporar' },
      { name: 'Mantenimiento Sostenible', icon: '🔧', status: 'scoping', statusLabel: 'Por definir', metric: 'Alcance pendiente de reunión con la escuela' },
    ],

    // Últimas 4 acciones reales (más reciente primero). Deltas y clasificación 1:1 con ses_score.json.
    recentActions: [
      { action: 'Factura EDESUR verificada · Periodo liquidado 6', date: '22 Jun 2026', delta: -30, note: 'Aumento de consumo 72.5% · Major Consumption Increase', verified: true },
      { action: 'Factura EDESUR verificada · Periodo liquidado 5', date: '19 May 2026', delta: -30, note: 'Aumento de consumo 58.4% · Major Consumption Increase', verified: true },
      { action: 'Factura EDESUR verificada · Periodo liquidado 4', date: '21 Abr 2026', delta: 30, note: 'Reducción 15.8% · Outstanding Reduction', verified: true },
      { action: 'Factura EDESUR verificada · Periodo liquidado 3', date: '19 Mar 2026', delta: 40, note: 'Reducción 21.3% · Exceptional Reduction', verified: true },
    ],

    // Data Room: evidencia agrupada, sin exponer identificadores privados (cliente, medidor, direcciones, códigos de pago).
    evidence: [
      { label: 'Factura EDESUR · Verificada', date: '22 Jun 2026', kind: 'Energía · PDF' },
      { label: 'Factura EDESUR · Verificada', date: '19 May 2026', kind: 'Energía · PDF' },
      { label: 'Factura EDESUR · Verificada', date: '21 Abr 2026', kind: 'Energía · PDF' },
      { label: 'Factura EDESUR · Verificada', date: '19 Mar 2026', kind: 'Energía · PDF' },
      { label: 'Factura EDESUR · Verificada', date: '20 Feb 2026', kind: 'Energía · PDF' },
      { label: 'Factura EDESUR · Verificada', date: '20 Ene 2026', kind: 'Energía · PDF' },
      { label: 'Factura EDESUR · Verificada', date: '18 Dic 2025', kind: 'Energía · PDF' },
      { label: 'Factura EDESUR · Verificada', date: '14 Nov 2025', kind: 'Energía · PDF' },
    ],

    badges: [
      { name: 'Primer Registro Verificado', date: '14 Nov 2025', color: '#29DDF5' },
      { name: 'Reducción Excepcional', date: '20 Feb 2026', color: '#1E9E72' },
      { name: 'Reducción Excepcional', date: '19 Mar 2026', color: '#1E9E72' },
      { name: 'Reducción Sobresaliente', date: '21 Abr 2026', color: '#B8860B' },
    ],

    roadmap: [
      { step: 'Mes 1', label: 'Centralizar información histórica y organizar evidencias' },
      { step: 'Mes 2', label: 'Configurar Dashboard Institucional y definir indicadores' },
      { step: 'Mes 3', label: 'Validar reportes, capacitar al equipo y definir siguiente etapa' },
    ],

    wallet: null,

    audit: {
      hash: '39f6dade1763705ec3b59146efb14b1bfc43374372deaa87683511d57d43f47f',
      ipfs: 'Pendiente de anclaje',
      tx: 'Pendiente de anclaje',
      blockchain: 'Pendiente de anclaje',
      timestamp: '22 Jun 2026 · 06:05:04 UTC',
      contract: 'SustainGenesisActionRegistry (pendiente)',
    },
  },
};

export const INSTITUTION_LIST = [
  { slug: 'montessori', name: 'Montessori School', tagline: 'Institución Educativa · Piloto Genesis', accentColor: '#1E9E72' },
];
