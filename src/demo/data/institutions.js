/* ============================================================
   NODOS INSTITUCIONALES
   ============================================================
   ⚠ REESCRITO 18 ago 2026 — corrección de atribución

   Hasta hoy este archivo describía a Montessori con los datos de las 8
   facturas EDESUR: 8 acciones verificadas, 211.2 kWh ahorrados, SES 20, 4
   badges de energía y un chart de consumo vs. línea base.

   Nada de eso es de Montessori. Ese es el nodo personal de Martín
   (spn_01ee6583da858ca1fa19323d) y las facturas son fixtures de demo suyas y
   de familiares. Ver src/demo/data/sustainNodes.js y data/actions.js.

   Lo que Montessori sí tiene es un histórico institucional documentado y
   abundante —13 programas, 10 proyectos, 168 mediciones, 24 documentos, 32
   evidencias, desde 2018— pero CERO acciones que hayan pasado el pipeline de
   verificación Sustain. Esa distinción es la regla central del Entregable 3:

     historical_import ≠ sustain_verified

   Los 21 datasets canónicos viven en src/demo/data/montessori/ y se leen a
   través de su capa de acceso. Acá va sólo el perfil de presentación del nodo;
   los contadores se derivan del dato, no se escriben a mano.
   ============================================================ */

import { trajectorySummary, institution as mont, site as montSite } from './montessori/index.js';

const T = trajectorySummary();

export const INSTITUTIONS = {
  montessori: {
    slug: 'montessori',
    institutionId: mont.institution_id,
    name: mont.display_name,
    legalName: mont.legal_name,
    tagline: 'Institución Educativa · Piloto Genesis',
    type: 'Escuela · Histórico documentado',
    institutionType: 'school',

    /* address_public de sites.json. El domicilio exacto (Segurola 935) tiene
       access_level: institutional — no se expone en la UI pública. */
    location: montSite.address_public,
    country: 'AR',
    memberSince: 'Jul 2026',
    historicalDataStart: mont.historical_data_start,
    status: mont.status,

    /* Procedencia del nodo entero. Ningún KPI de acá alimenta SES. */
    recordOrigin: mont.record_origin,
    verificationStatus: mont.verification_status,
    sourceReference: mont.source_reference,

    accentColor: '#1E9E72',
    accentBg: 'rgba(30,158,114,0.08)',
    accentBorder: 'rgba(30,158,114,0.3)',
    initials: 'MS',
    initialsStyle: { background: 'linear-gradient(135deg, #1E9E72, #29DDF5)', color: '#fff' },

    /* ── Acciones verificadas por Sustain: ninguna todavía ──
       No es un hueco del mock. La escuela entra al piloto con su historia
       documentada; la verificación Sustain empieza cuando cargue evidencia
       por el pipeline. */
    sustainActions: {
      count: 0,
      ses: null,
      reason: 'historical_only',
      note: 'El histórico documentado no genera SES ni cuenta como acción verificada.',
    },

    /* ── Trayectoria institucional (record_counts de canonical/manifest.json) ──
       Estos son los KPI que reemplazan a los de energía. Cuentan historia
       documentada, no verificación. */
    stats: [
      { label: 'Programas Registrados', value: String(T.programs), icon: '▦', delta: `Histórico documentado · desde ${T.periodStart.slice(0, 4)}`, deltaUp: null },
      { label: 'Mediciones Históricas', value: String(T.measurements), icon: '◉', delta: `${T.indicators} indicadores · ${T.measurementsNeedsReview} por revisar`, deltaUp: null },
      { label: 'Evidencias y Documentos', value: String(T.documents + T.evidence), icon: '▤', delta: `${T.documents} documentos · ${T.evidence} evidencias`, deltaUp: null },
      { label: 'Acciones Verificadas Sustain', value: String(T.sustainVerified), icon: '✓', delta: 'El histórico no genera verificación', deltaUp: null },
    ],

    trajectory: T,

    /* COA es un framework EXTERNO asociado al nodo, no taxonomía core de
       Sustain (regla IR-010). El mismo sistema tiene que servir mañana para
       otra escuela con otra certificación. */
    frameworks: [
      {
        id: 'framework_coa_environmental_seal',
        name: 'Sello Ambiental COA',
        type: 'environmental_certification',
        version: 'Expediente 2025',
        status: 'configured_pilot',
        external: true,
        sourceReference: 'PDF completo',
      },
    ],

    /* ── Módulos ──
       Reemplaza al donut de "1/9 módulos activos" que contaba Energía como
       activo con las facturas de Martín. Ahora refleja el estado real: hay
       histórico documental en varias categorías y verificación en ninguna. */
    modules: [
      { name: 'Residuos y circularidad', icon: '♻️', status: 'historical', statusLabel: 'Histórico', metric: '2 programas · Botellas de Amor, Tapitas' },
      { name: 'Energía', icon: '⚡', status: 'historical', statusLabel: 'Histórico', metric: 'Fotovoltaico 30 paneles · PDF p.24-27' },
      { name: 'Agua', icon: '💧', status: 'historical', statusLabel: 'Histórico', metric: 'Gestión hídrica · PDF p.28-50' },
      { name: 'Biodiversidad', icon: '🌳', status: 'historical', statusLabel: 'Histórico', metric: 'Jardín vertical y forestación · PDF p.63-69' },
      { name: 'Compostaje', icon: '🌱', status: 'historical', statusLabel: 'Histórico', metric: 'Compostaje institucional · PDF p.53' },
      { name: 'Educación ambiental', icon: '📚', status: 'historical', statusLabel: 'Histórico', metric: 'VMA + sensibilización · 2 programas' },
      { name: 'Movilidad', icon: '🚲', status: 'historical', statusLabel: 'Histórico', metric: 'Bicicleteada solidaria · PDF p.21-22' },
      { name: 'Compras sostenibles', icon: '🛒', status: 'historical', statusLabel: 'Histórico', metric: 'Proveedores · PDF p.75, p.81-87' },
      { name: 'Gobernanza y mantenimiento', icon: '🔧', status: 'historical', statusLabel: 'Histórico', metric: 'Mantenimiento preventivo · PDF p.13-16' },
      { name: 'Inclusión', icon: '🤝', status: 'historical', statusLabel: 'Histórico', metric: 'Accesibilidad y diversidad · PDF p.88-91' },
    ],

    roadmap: [
      { step: 'Mes 1', label: 'Centralizar información histórica y organizar evidencias' },
      { step: 'Mes 2', label: 'Configurar Dashboard Institucional y definir indicadores' },
      { step: 'Mes 3', label: 'Validar reportes, capacitar al equipo y definir siguiente etapa' },
    ],

    wallet: null,

    /* ── Auditoría ──
       El hash que había acá (39f6dade…) es de una factura de Martín, no de
       Montessori. La escuela todavía no tiene ningún artefacto criptográfico
       propio porque no pasó ninguna acción por el pipeline.

       La trazabilidad de su histórico es DOCUMENTAL: referencia de expediente,
       no hash. Es exactamente lo que pide el Entregable 3 § 4.7. */
    audit: null,
    auditMode: 'documentary',
    auditNote: 'Trazabilidad documental por referencia de expediente. Sin anclaje criptográfico: ninguna acción pasó todavía por el pipeline Sustain.',
  },
};

export const INSTITUTION_LIST = [
  { slug: 'montessori', name: 'Montessori School', tagline: 'Institución Educativa · Piloto Genesis', accentColor: '#1E9E72' },
];
