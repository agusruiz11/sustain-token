export const USER = {
  name: 'Martín',
  fullName: 'Martín Cerón',
  handle: 'sustainorg.eth',
  avatar: null,
  sesScore: 842,
  sesLevel: 'Nivel Avanzado',
  sesLevelNum: 4,
  sesLevelMax: 7,
  sesProgress: 84,
  sesNextLevel: 1000,
  globalRank: 'Top 4.2%',
  globalRankNum: '#12,845',
  verifiedActions: 24,
  activeStreak: 18,
  wallet: '178.45',

  recentActions: [
    { icon: '⚡', name: 'Reducción de Energía', detail: 'Factura Edesur · Feb 2026', value: '-10.57%', pts: 42, date: '20 Feb 2026', verified: true, color: '#B8860B' },
    { icon: '💧', name: 'Ahorro de Agua', detail: 'Factura AySA · Ene 2026', value: '-8.20%', pts: 32, date: '18 Feb 2026', verified: true, color: '#29DDF5' },
    { icon: '♻️', name: 'Reciclaje', detail: 'Plástico, Papel, Vidrio', value: '5.8 kg', pts: 28, date: '15 Feb 2026', verified: true, color: '#1E9E72' },
    { icon: '🌱', name: 'Compostaje', detail: 'Compostera Sitopia', value: '3.2 kg', pts: 45, date: '14 Feb 2026', verified: true, color: '#1E9E72' },
    { icon: '🧹', name: 'Limpieza de Espacio', detail: 'Plaza Palermo, CABA', value: '1 acción', pts: 30, date: '10 Feb 2026', verified: true, color: '#E8BEE0' },
    { icon: '🛍️', name: 'Compra Sostenible', detail: 'Compostera Sitopia', value: '1 compra', pts: 25, date: '08 Feb 2026', verified: true, color: '#29DDF5' },
  ],

  impactTotals: [
    { icon: '⚡', label: 'Energía Ahorrada', value: '-234 kWh', color: '#B8860B' },
    { icon: '💧', label: 'Agua Ahorrada', value: '-2,350 L', color: '#29DDF5' },
    { icon: '♻️', label: 'Residuos Reciclados', value: '18.6 kg', color: '#1E9E72' },
    { icon: '🌱', label: 'Compost Generado', value: '25.4 kg', color: '#1E9E72' },
    { icon: '🌍', label: 'CO₂e Evitado', value: '-112.7 kg', color: '#E8BEE0' },
  ],

  chartLine: {
    title: 'Evolución de tu Impacto',
    subtitle: 'Últimos 6 meses',
    months: ['Sep 2025','Oct 2025','Nov 2025','Dic 2025','Ene 2026','Feb 2026'],
    series: [
      {
        label: 'SES Total',
        color: '#29DDF5',
        points: '60,140 164,125 268,108 372,88 476,65 580,40',
        lastVal: '842',
      },
      {
        label: 'Energía (kWh)',
        color: '#B8860B',
        points: '60,155 164,148 268,140 372,130 476,118 580,105',
        lastVal: '234',
      },
      {
        label: 'Agua (L)',
        color: '#1E9E72',
        points: '60,160 164,155 268,148 372,138 476,125 580,110',
        lastVal: '2350',
      },
      {
        label: 'Residuos (kg)',
        color: '#E8BEE0',
        points: '60,168 164,164 268,159 372,152 476,143 580,133',
        lastVal: '18.6',
      },
    ],
  },

  badges: [
    { icon: '🌱', name: 'Primer Paso', color: '#1E9E72', earned: true },
    { icon: '⚡', name: 'Ahorro Energético', color: '#B8860B', earned: true },
    { icon: '♻️', name: 'Reciclador', color: '#29DDF5', earned: true },
    { icon: '🌿', name: 'Composteador', color: '#1E9E72', earned: true },
    { icon: '🧹', name: 'Limpieza Activa', color: '#E8BEE0', earned: true },
    { icon: '🛍️', name: 'Comprador Consciente', color: '#29DDF5', earned: true },
  ],

  communityInspired: 37,
  communityAvatars: ['M', 'L', 'S', 'D', 'A'],

  audit: {
    hash: 'b9f1e3d7c4a2b8e1f5d3c7a0...d47a',
    ipfs: 'bafybeif2x8qmz3o9r1m...j5wt',
    tx: '0xc2d5f1....e7a3b9d4',
    blockchain: 'Polygon Mainnet',
    timestamp: '20 Feb 2026 · 18:23:07 UTC',
    contract: 'SustainGenesisActionRegistry',
  },
};
