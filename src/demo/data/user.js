/* ============================================================
   NODO USUARIO — Martín Ceron
   ============================================================
   ⚠ VALORES CANÓNICOS — corregido 18 ago 2026

   Este es el nodo spn_01ee6583da858ca1fa19323d. Hasta hoy la maqueta mostraba
   cifras inventadas (SES 842, 24 acciones, "Nivel Avanzado 4/7"). Los valores
   reales salen de node_state.json y son bastante más chicos:

       SES 35 · 14 acciones · Level 1 — Verified Participant

   Es un nodo joven en escala 0-1000, no un nodo avanzado. No volver a subirlo
   "para que se vea mejor": el punto del producto es que la cifra sea auditable.

   Acá viven además las 8 facturas EDESUR y los 5 viajes en bici, porque el
   nodo es de Martín como persona física — no de Montessori.
   Ver src/demo/data/sustainNodes.js.
   ============================================================ */

export const USER = {
  name: 'Martín',
  fullName: 'Martín Ceron',
  handle: 'sustainorg.eth',
  avatar: null,
  nodeId: 'spn_01ee6583da858ca1fa19323d',

  // node_state.json · score
  sesScore: 35,
  sesPrevious: 32,
  sesLastDelta: 3,
  sesScaleMax: 1000,
  sesLevel: 'Level 1 — Verified Participant',
  sesLevelName: 'Verified',
  sesLevelNum: 1,
  sesMode: 'score_only',
  sesPolicy: 'Mobility_SES_v1.0',

  // node_state.json · activity_summary
  verifiedActions: 14,
  verifiedSince: '2025-11-14',

  /* El ranking global no existe en la fuente canónica. No se inventa:
     null hace que la UI lo omita en lugar de mostrar un puesto falso. */
  globalRank: null,
  globalRankNum: null,
  activeStreak: null,

  /* reward_enabled: false — el nodo está en modo score_only, sin tokens. */
  wallet: null,

  /* Actividad reciente. Las de agua, reciclaje, compostaje, limpieza y compra
     sostenible que había acá antes eran inventadas: el nodo tiene 0 en todas
     esas categorías según lifetime_metrics. Sólo quedan las que existen.
     La lista larga se deriva de data/actions.js con actionsForNode(). */
  recentActions: [
    { icon: '🚲', name: 'Movilidad verificada', detail: 'Bicicleta · 7.28 km · MRV-M1', value: '+3 SES', pts: 3, date: '27 Jul 2026', verified: true, color: '#29DDF5' },
    { icon: '⚡', name: 'Reducción de Energía', detail: 'Factura EDESUR · Período 8', value: '+72.5%', pts: -30, date: '22 Jun 2026', verified: true, color: '#B8860B' },
    { icon: '⚡', name: 'Reducción de Energía', detail: 'Factura EDESUR · Período 7', value: '+58.4%', pts: -30, date: '19 May 2026', verified: true, color: '#B8860B' },
    { icon: '⚡', name: 'Reducción de Energía', detail: 'Factura EDESUR · Período 6', value: '-15.8%', pts: 30, date: '21 Abr 2026', verified: true, color: '#B8860B' },
  ],

  /* lifetime_metrics de node_state.json. Todo lo que no está acá está en cero
     en la fuente: agua, gas, residuos, compost, árboles, textil, RAEE, etc.
     No volver a poner valores de relleno. */
  impactTotals: [
    { icon: '⚡', label: 'Energía Ahorrada', value: '211.19 kWh', color: '#B8860B' },
    { icon: '🚲', label: 'Movilidad en Bici', value: '44.87 km', color: '#29DDF5' },
    { icon: '🌍', label: 'CO₂e Evitado (estimado)', value: '1.687 kg', color: '#E8BEE0', note: 'Estimación modelada, no medición directa' },
    { icon: '♻️', label: 'Plástico Recuperado', value: '0.3 kg', color: '#1E9E72', note: '1 botella de amor' },
  ],

  /* Evolución del SES.
     Las series de agua y residuos que había acá antes eran inventadas — el
     nodo tiene 0 en ambas. Y los 842 puntos nunca existieron.

     Este tramo sí es canónico punto por punto: cada viaje trae su
     previous_ses/current_ses en el dashboard_update.json de su paquete.
       23 (baseline) → 23 → 26 → 29 → 32 → 35

     El tramo de energía (nov 2025 – jun 2026) NO se grafica: nuestros sesDelta
     de esas 8 acciones son 'inferred'/'derived', no dato canónico, y dos están
     en null. Graficarlos sería inventar la curva. Se recupera cuando lleguen
     los ses_score.json de energía.

     Coordenadas SVG sobre el viewBox 600×200 de ChartLine (yMax 50). */
  chartLine: {
    title: 'Evolución del SES',
    subtitle: 'Módulo Movilidad · jul 2026 · escala 0-1000',
    yMax: 50,
    months: ['Previo', '14 Jul', '14 Jul', '22 Jul', '22 Jul', '27 Jul'],
    series: [
      {
        label: 'SES acumulado',
        color: '#29DDF5',
        points: '48,98.1 154.4,98.1 260.8,89.0 367.2,79.8 473.6,70.7 580,61.6',
        lastVal: '35',
      },
    ],
  },

  /* Los 5 badges reales de node_state.json, con su action_id canónico.
     Los de reciclaje/compostaje/limpieza/compra que había antes no existen. */
  badges: [
    { code: 'FIRST_VERIFIED_ENERGY_RECORD', icon: '⚡', name: 'Primer Registro de Energía', color: '#B8860B', date: '2025-11-14', earned: true, actionId: null },
    { code: 'EXCEPTIONAL_ENERGY_REDUCTION', icon: '◉', name: 'Reducción Excepcional', color: '#1E9E72', date: '2026-02-20', earned: true, actionId: 'spa_8f2f331331f1c26535f54f6d' },
    { code: 'EXCEPTIONAL_ENERGY_REDUCTION', icon: '◉', name: 'Reducción Excepcional', color: '#1E9E72', date: '2026-03-19', earned: true, actionId: 'spa_8b9bcd5cd034356756aefbe9' },
    { code: 'OUTSTANDING_ENERGY_REDUCTION', icon: '★', name: 'Reducción Destacada', color: '#B8860B', date: '2026-04-21', earned: true, actionId: 'spa_1d4967a1d22647ba47723787' },
    { code: 'FIRST_VERIFIED_MOBILITY_RECORD', icon: '🚲', name: 'Primer Registro de Movilidad', color: '#29DDF5', date: '2026-07-14', earned: true, actionId: 'spa_0edd3a757c582d3152a79010' },
  ],

  /* No existe métrica de comunidad en la fuente canónica. */
  communityInspired: null,
  communityAvatars: [],

  /* ⚠ Estos campos tenían un CID y un tx hash INVENTADOS
     ('bafybeif2x8qmz3o9r1m...j5wt', '0xc2d5f1....e7a3b9d4', Polygon Mainnet).
     El AGENCY_IMPLEMENTATION_BRIEF.md lo prohíbe expresamente. No existe un
     solo anclaje real en todo el material entregado: todo está en 'pending'.

     El contrato y la red sí son reales — salen de dashboard_sync.json — pero
     todavía no se ejecutó ningún anchor contra ellos. */
  audit: {
    hash: '39f6dade1763705ec3b59146efb14b1bfc43374372deaa87683511d57d43f47f',
    hashStatus: 'complete',
    ipfs: null,
    ipfsStatus: 'pending',
    tx: null,
    chainStatus: 'pending',
    blockchain: 'BNB Smart Chain Mainnet',
    chainId: 56,
    contract: '0x141cc96351d622fcf26fAA40E0fd2a1ba8D25e1B',
    anchorMethod: 'anchorAction(string,string)',
    timestamp: '22 Jun 2026 · 06:05:04 UTC',
  },
};
