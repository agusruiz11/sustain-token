/* Smoke test de renderizado: monta cada ruta del demo con react-dom/server y
   reporta cualquier excepción. Detecta los accesos a campos que dejaron de
   existir tras la corrección de atribución — cosas que `vite build` no ve. */
import { createServer } from 'vite';

// Vite resuelve la raíz desde el cwd (el proyecto).

const ROUTES = [
  '/demo',
  '/demo/usuario',
  '/demo/usuario/acciones',
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

await server.close();
console.log(`\n${ROUTES.length - fail}/${ROUTES.length} rutas OK`);
process.exit(fail ? 1 : 0);
