/* Verificación de la corrección de atribución de nodos (Fase 0, 18 ago 2026).
   Bloquea la regresión de volver a atribuir a Montessori las 8 facturas EDESUR
   de Martín, o de reintroducir CIDs/tx inventados. Correr con `npm run verify:attribution`. */
/* Verifica la corrección de atribución sobre el HTML realmente renderizado. */
import { createServer } from 'vite';
const React = (await import('react')).default;
const { renderToString } = await import('react-dom/server');
const { StaticRouter } = await import('react-router');
const server = await createServer({ server:{middlewareMode:true}, appType:'custom', logLevel:'error' });
const App = (await server.ssrLoadModule('/src/App.jsx')).default;
const render = (r) => renderToString(React.createElement(StaticRouter,{location:r},React.createElement(App)));

const CHECKS = [
  // Las 8 facturas tienen que estar en el dashboard de Martín...
  ['/demo/usuario/acciones', 'EDESUR', true, 'facturas EDESUR en nodo usuario'],
  ['/demo/usuario', '35', true, 'SES canónico 35'],
  ['/demo/usuario', '842', false, 'SES inventado 842 eliminado'],
  ['/demo/usuario', 'bafybeif2x8qmz3o9r1m', false, 'CID inventado eliminado'],
  ['/demo/usuario', '0xc2d5f1', false, 'tx inventado eliminado'],
  ['/demo/usuario', 'Polygon', false, 'red equivocada eliminada'],
  ['/demo/usuario', '178.45', false, 'saldo de wallet inventado eliminado'],
  ['/demo/usuario', 'Top 4.2%', false, 'ranking global inventado eliminado'],
  // ...y NO en el de la escuela.
  ['/demo/institucion/montessori', 'EDESUR', false, 'sin EDESUR en Montessori'],
  ['/demo/institucion/montessori', '211.2 kWh', false, 'sin kWh de Martín en Montessori'],
  ['/demo/institucion/montessori/acciones', 'EDESUR', false, 'Mis Acciones de Montessori sin EDESUR'],
  ['/demo/institucion/montessori/auditoria', '39f6dade', false, 'sin hash de Martín en auditoría de Montessori'],
  ['/demo/institucion/montessori', 'Trayectoria institucional', true, 'bloque de trayectoria presente'],
  ['/demo/institucion/montessori', 'Turdera', true, 'ubicación corregida'],
  ['/demo/institucion/montessori', '168', true, 'mediciones históricas'],
  ['/demo/institucion/montessori', 'Sello Ambiental COA', true, 'COA como framework externo'],
  ['/demo/institucion/montessori/organizacion', 'Turdera', true, 'estructura: sede canónica'],
  ['/demo/institucion/montessori/organizacion?s=estructura', 'Ciudad Autónoma', false, 'estructura: CABA inventada eliminada'],
  ['/demo/institucion/montessori/organizacion?s=estructura', 'Sala de 3', false, 'estructura: cursos inventados eliminados'],
  ['/demo/institucion/montessori/organizacion?s=estructura', 'Nivel Secundario', true, 'estructura: 8 unidades canónicas'],
  ['/demo/institucion/montessori/impacto', 'Histórico documental', true, 'impacto: procedencia histórica visible'],
  ['/demo/usuario/impacto', 'Verificado Sustain', true, 'impacto usuario: energía verificada'],
  ['/demo/usuario/acciones', 'fixtures de demostración', true, 'nota de fixture demo en nodo usuario'],
  ['/demo/institucion/montessori/acciones', 'todavía no tiene acciones verificadas', true, 'empty state correcto'],
  ['/demo', '178.45', false, 'hub sin saldo inventado'],
  ['/demo/usuario', 'null días', false, 'topbar sin racha nula'],
  ['/demo/usuario', 'Racha:', false, 'topbar sin racha inventada'],
  ['/demo/usuario', 'SALDO DISPONIBLE', false, 'sidebar sin saldo $SUS'],
  ['/demo/usuario', 'respaldadas en blockchain', false, 'footer sin afirmar anclaje inexistente'],
  ['/demo/usuario', 'Pendiente de anclaje', true, 'audit trail muestra anclaje pendiente'],
  ['/demo/usuario', 'spn_01ee6583da858ca1fa19323d', true, 'nodo identificado por SPN'],

  // ── Fase 2 · histórico navegable ──
  ['/demo/institucion/montessori/timeline', 'Bicicleteada solidaria', true, 'timeline: hito histórico de 2019'],
  ['/demo/institucion/montessori/timeline', 'Timeline ambiental del nodo', true, 'timeline: título del § 4.4'],
  ['/demo/institucion/montessori/timeline', 'PDF p.21-p.22', true, 'timeline: referencia de expediente visible'],
  ['/demo/institucion/montessori/timeline', 'tl-milestones', false, 'timeline: histórico sin cadena de hitos MRV'],
  ['/demo/institucion/montessori/data-room', 'Archivo institucional', true, 'data room: selector de repositorio'],
  ['/demo/institucion/montessori/data-room', 'Referencia en expediente', true, 'data room: no finge archivo original'],
  ['/demo/institucion/montessori/data-room', 'Relevamiento de Trayectorias Escolares', false, 'data room: doc audit_restricted oculto a nivel institución'],
  ['/demo/institucion/montessori/organizacion?s=responsables', 'Alejandro Viola', false, 'responsables: persona restricted no se expone'],
  ['/demo/institucion/montessori/organizacion?s=indicadores', 'Todas en revisión', true, 'indicadores: gas sin total dice por qué'],
  ['/demo/institucion/montessori/organizacion?s=programas&prog=prog_solar_energy', 'No genera SES', true, 'ficha de programa: histórico no genera SES'],
  ['/demo/institucion/montessori/organizacion?s=estructura', 'Nivel Maternal', true, 'estructura: unidad canónica'],

  // ── Fase 3 · procedencia por KPI ──
  ['/demo/institucion/montessori/impacto', 'Histórico documental', true, 'impacto: procedencia histórica'],
  ['/demo/institucion/montessori/impacto', 'Botellas de Amor recuperadas', true, 'impacto: indicador canónico en tarjeta'],
  ['/demo/institucion/montessori/impacto', 'fuera del KPI público', true, 'impacto: excluidas nombradas, no descontadas en silencio'],
  ['/demo/institucion/montessori/impacto', 'Accesibilidad, inclusión y diversidad', true, 'impacto: categoría canónica sin equivalente Sustain'],
  ['/demo/institucion/montessori/impacto?ind=gas_consumption_m3', 'Medido', true, 'detalle: procedencia por medición'],
  ['/demo/institucion/montessori/impacto?ind=gas_consumption_m3', 'Requiere revisión', true, 'detalle: calidad needs_review visible'],
  ['/demo/institucion/montessori/impacto?ind=gas_consumption_m3', 'no alimentan el KPI público', true, 'detalle: explica la exclusión'],
  ['/demo/institucion/montessori/impacto?ind=solar_capacity_kwp', 'Último valor', true, 'detalle: respeta aggregation_method latest'],
  ['/demo/usuario/impacto', 'Verificado Sustain', true, 'impacto usuario: energía verificada'],

  // ── Fase 4 · auditoría documental y reportes ──
  ['/demo/institucion/montessori/auditoria', 'Histórico documental', true, 'auditoría: sección documental'],
  ['/demo/institucion/montessori/auditoria', 'no aplicado', true, 'auditoría: MRV no aplicado al histórico'],
  ['/demo/institucion/montessori/auditoria', 'Excel DATOS POR AÑO', true, 'auditoría: fuente hasta la celda del Excel'],
  ['/demo/institucion/montessori/auditoria', 'Estado de anclaje', false, 'auditoría: sin bloque de anclaje donde no hay acciones'],
  ['/demo/usuario/auditoria', 'Acciones Sustain', true, 'auditoría usuario: sección criptográfica'],
  ['/demo/usuario/auditoria', 'Histórico documental', false, 'auditoría usuario: sin expediente institucional'],
  ['/demo/institucion/montessori/reportes', 'Sello Ambiental COA', true, 'reportes: COA como marco externo'],
  ['/demo/institucion/montessori/reportes', 'Histórico institucional', true, 'reportes: los 6 tipos'],
  ['/demo/institucion/montessori/reportes', 'record origin', true, 'reportes: procedencia en la vista previa'],
  ['/demo/institucion/montessori/reportes', 'verification status', true, 'reportes: verificación en la vista previa'],

  // ── Fases 5-6 · identidad y configuración ──
  ['/demo/institucion/montessori/identidad', 'Trayectoria institucional documentada', true, 'identity: trayectoria separada del SES'],
  ['/demo/institucion/montessori/identidad', 'No otorga SES', true, 'identity: el histórico no da puntaje'],
  ['/demo/institucion/montessori', 'Ver histórico institucional', true, 'home: acceso al histórico'],
  ['/demo/institucion/montessori/configuracion', 'Acceso temporal de auditor externo', true, 'config: scaffolding de auditor'],
  ['/demo/institucion/montessori/configuracion', 'Revocable en cualquier momento', true, 'config: invitación revocable con plazo'],
  ['/demo/institucion/montessori/configuracion', 'Taxonomía ambiental', true, 'config: taxonomía configurable'],
  ['/demo/institucion/montessori/configuracion', 'Archivo histórico', true, 'config: catálogo de fuentes'],
  ['/demo/institucion/montessori/configuracion', 'Permisos de publicación', true, 'config: niveles de publicación'],
  ['/demo/usuario/configuracion', 'Acceso temporal de auditor externo', false, 'config usuario: sin auditoría institucional'],
];

let fail = 0;
const cache = {};
for (const [route, needle, shouldHave, desc] of CHECKS) {
  const html = cache[route] ??= render(route);
  const has = html.includes(needle);
  const ok = has === shouldHave;
  if (!ok) fail++;
  console.log(`${ok ? '✓' : '✗'} ${desc}${ok ? '' : `  (esperaba ${shouldHave ? 'presente' : 'ausente'}: "${needle}")`}`);
}
await server.close();
console.log(`\n${CHECKS.length - fail}/${CHECKS.length} verificaciones OK`);
process.exit(fail ? 1 : 0);
