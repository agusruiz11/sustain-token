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
  ['/demo/institucion/montessori/organizacion', 'Ciudad Autónoma', false, 'estructura: CABA inventada eliminada'],
  ['/demo/institucion/montessori/organizacion', 'Sala de 3', false, 'estructura: cursos inventados eliminados'],
  ['/demo/institucion/montessori/organizacion', 'Nivel Maternal', true, 'estructura: 8 unidades canónicas'],
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
