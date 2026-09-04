/* Smoke test de renderizado: monta cada ruta del demo con react-dom/server y
   reporta cualquier excepción. Detecta los accesos a campos que dejaron de
   existir tras la corrección de atribución — cosas que `vite build` no ve. */
import { createServer } from 'vite';

// Vite resuelve la raíz desde el cwd (el proyecto).

const ROUTES = [
  '/demo',
  '/demo/usuario',
  '/demo/usuario/acciones',
  '/demo/usuario/movilidad',
  '/demo/usuario/movilidad?trip=spa_0edd3a757c582d3152a79010',
  '/demo/usuario/movilidad?trip=spa_192f38f6fc7dc2ef7126e968',
  '/demo/usuario/acciones/act_martin_energia_08',
  '/demo/usuario/data-room',
  '/demo/usuario/impacto',
  '/demo/usuario/timeline',
  '/demo/usuario/identidad',
  '/demo/usuario/integraciones',
  '/demo/usuario/reportes',
  '/demo/usuario/auditoria',
  '/demo/usuario/configuracion',
  '/demo/institucion/montessori',
  '/demo/institucion/montessori/acciones',
  '/demo/institucion/montessori/data-room',
  '/demo/institucion/montessori/data-room?repo=sustain',
  '/demo/institucion/montessori/data-room?repo=archive',
  '/demo/institucion/montessori/impacto',
  '/demo/institucion/montessori/impacto?ind=gas_consumption_m3',
  '/demo/institucion/montessori/impacto?ind=waste_love_bottles_kg',
  '/demo/institucion/montessori/impacto?ind=solar_capacity_kwp',
  '/demo/institucion/montessori/timeline',
  '/demo/institucion/montessori/identidad',
  '/demo/institucion/montessori/organizacion',
  '/demo/institucion/montessori/organizacion?s=estructura',
  '/demo/institucion/montessori/organizacion?s=responsables',
  '/demo/institucion/montessori/organizacion?s=programas',
  '/demo/institucion/montessori/organizacion?s=programas&prog=prog_solar_energy',
  '/demo/institucion/montessori/organizacion?s=proyectos',
  '/demo/institucion/montessori/organizacion?s=indicadores',
  '/demo/institucion/montessori/organizacion?s=frameworks',
  '/demo/institucion/montessori/reportes',
  '/demo/institucion/montessori/auditoria',
  '/demo/institucion/montessori/configuracion',
  '/demo/empresa/zigzag',
  '/demo/empresa/zigzag/acciones',
  '/demo/empresa/zigzag/auditoria',
];

const server = await createServer({

  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

// react y react-dom son CJS: se importan directo. ssrLoadModule sólo para
// el código fuente del proyecto, que sí necesita pasar por el pipeline de Vite.
const React = (await import('react')).default;
const { renderToString } = await import('react-dom/server');
const { StaticRouter } = await import('react-router');
const App = (await server.ssrLoadModule('/src/App.jsx')).default;

/* La ficha de CADA acción del nodo, derivada del universo canónico y no
   escrita a mano. Antes la lista fija sólo cubría una factura de energía, y
   por eso no se detectó que la ficha de la Botella de Amor rompía: leía
   campos que sólo existen en las acciones de energía. Con esto, cualquier
   acción nueva queda cubierta el día que se agrega. */
const A = await server.ssrLoadModule('/src/demo/data/actions.js');
for (const a of A.NODE_ACTIONS) {
  const mod = a.detailPath?.module ?? 'acciones';
  ROUTES.push(a.detailPath?.query
    ? `/demo/usuario/${mod}?${a.detailPath.query}`
    : `/demo/usuario/${mod}/${a.id}`);
}

let fail = 0;
for (const route of ROUTES) {
  try {
    const html = renderToString(
      React.createElement(StaticRouter, { location: route }, React.createElement(App)),
    );
    const len = html.length;
    if (len < 200) {
      console.log(`⚠ ${route} — render vacío (${len} bytes)`);
      fail++;
    } else {
      console.log(`✓ ${route} (${len} bytes)`);
    }
  } catch (e) {
    fail++;
    console.log(`✗ ${route}\n    ${e.message.split('\n')[0]}`);
  }
}


/* ── Tokens CSS: usados vs. definidos ─────────────────────────
   Un `var(--x)` sin fallback que no está definido no rompe el build ni el
   render: la declaración se descarta en silencio y el elemento hereda el color
   del padre. Así se coló `--ink-100`, que dejaba el texto principal del
   dashboard casi negro sobre fondo oscuro y sólo legible en hover.
   Esto lo detecta antes de que llegue a producción. */
import { readFileSync } from 'node:fs';

const CSS_DEF = ['src/styles/tokens.css', 'src/index.css', 'src/App.css', 'src/demo/demo.css'];
const CSS_USE = ['src/demo/demo.css', 'src/index.css'];
const leer = (f) => { try { return readFileSync(f, 'utf8'); } catch { return ''; } };

const definidos = new Set();
for (const f of CSS_DEF) {
  for (const m of leer(f).matchAll(/^\s*(--[\w-]+)\s*:/gm)) definidos.add(m[1]);
}
const huerfanos = new Map();
for (const f of CSS_USE) {
  for (const m of leer(f).matchAll(/var\(\s*(--[\w-]+)\s*([,)])/g)) {
    if (m[2] === ')' && !definidos.has(m[1])) {
      huerfanos.set(m[1], (huerfanos.get(m[1]) ?? 0) + 1);
    }
  }
}
if (huerfanos.size) {
  fail++;
  for (const [t, n] of huerfanos) console.log(`\u2717 token CSS sin definir: ${t} (${n} usos sin fallback)`);
} else {
  console.log(`\u2713 tokens CSS: los ${definidos.size} usados están definidos`);
}

await server.close();
console.log(`\n${ROUTES.length - fail}/${ROUTES.length} rutas OK`);
process.exit(fail ? 1 : 0);
