/* ============================================================
   VERIFICACIÓN DE LA ENTREGA 05_INSTITUTIONS — 28 sep 2026
   ============================================================
   Tres cosas que el manual v2 de Sustain pide demostrar antes de dar por
   cerrada la publicación, más las reglas duras del proyecto:

     1. Idempotencia: reimportar los JSON no crea seis acciones. Se vuelve a
        correr el importador sobre un archivo temporal y se compara byte a
        byte con el archivo versionado.
     2. Fuga de datos: el archivo generado (lo único que llega al navegador)
        no puede contener secciones restringidas del dashboard_sync.
     3. Invariantes de la carga: 3 acciones de Montessori y 1 de Posicionarte,
        SES según política (RECORD_ONLY sin puntaje; limpieza 8 + 4 + 4 sin
        sumar), acumulación por ancestro (colegio 3, sexto grado 2), Tandil
        fuera del KPI de árboles, sin CID, y anclaje verificado.
     4. Render: lo que las pantallas dicen de verdad, sobre el HTML.

   Correr con `npm run verify:institutional`.
   ============================================================ */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createServer } from 'vite';

const React = (await import('react')).default;
const { renderToString } = await import('react-dom/server');
const { StaticRouter } = await import('react-router');

let fail = 0;
const check = (ok, desc, detail = '') => {
  if (!ok) fail++;
  console.log(`${ok ? '✓' : '✗'} ${desc}${ok || !detail ? '' : `  (${detail})`}`);
};

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const { IMPORTED_ACTIONS } = await server.ssrLoadModule('/src/demo/data/institutional/imported.js');
const { INSTITUTIONAL_ACTIONS, institutionalHierarchy } = await server.ssrLoadModule('/src/demo/data/institutionalActions.js');
const { NODE_ACTIONS } = await server.ssrLoadModule('/src/demo/data/actions.js');
const App = (await server.ssrLoadModule('/src/App.jsx')).default;
const render = (r) => renderToString(React.createElement(StaticRouter, { location: r }, React.createElement(App)));

/* ── 1 · Idempotencia ───────────────────────────────────────── */
const generated = path.resolve('src/demo/data/institutional/imported.js');
const source = path.resolve('drive-files/05_INSTITUTIONS');
if (fs.existsSync(source)) {
  const tmp = fs.mkdtempSync(path.join(process.cwd(), 'node_modules/.tmp-import-'));
  const tmpOut = path.join(tmp, 'imported.js');
  try {
    const script = fs.readFileSync('scripts/import-dashboard-sync.mjs', 'utf8')
      .replace("const OUT = path.resolve('src/demo/data/institutional/imported.js');", `const OUT = ${JSON.stringify(tmpOut)};`);
    const tmpScript = path.join(tmp, 'import.mjs');
    fs.writeFileSync(tmpScript, script);
    execFileSync(process.execPath, [tmpScript, source], { stdio: 'pipe' });
    const same = fs.readFileSync(tmpOut, 'utf8') === fs.readFileSync(generated, 'utf8');
    check(same, 'idempotencia: reimportar produce exactamente el mismo archivo', 'el generado difiere del fuente; correr el importador');
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
} else {
  console.log('· idempotencia: drive-files/05_INSTITUTIONS no está en esta máquina; se omite la reimportación');
}

const ids = Object.keys(IMPORTED_ACTIONS);
check(ids.length === 4, 'importadas exactamente 4 acciones', `${ids.length}`);
check(new Set(ids).size === ids.length, 'action_id únicos');
check(ids.every((id) => IMPORTED_ACTIONS[id].actionId === id), 'la clave del objeto es el action_id');
check(new Set(INSTITUTIONAL_ACTIONS.map((a) => a.id)).size === INSTITUTIONAL_ACTIONS.length, 'universo canónico sin duplicados institucionales');
check(NODE_ACTIONS.filter((a) => a.nodeKey === 'montessori').length === 3, 'Montessori: 3 acciones en el universo canónico');
check(NODE_ACTIONS.filter((a) => a.nodeKey === 'posicionarte').length === 1, 'Posicionarte: 1 acción en el universo canónico');
check(NODE_ACTIONS.filter((a) => a.nodeKey === 'usuario').length === 14, 'nodo de Martín sigue con 14 acciones (no se mezclan)');

/* ── 2 · Fuga de datos ──────────────────────────────────────── */
const text = fs.readFileSync(generated, 'utf8');
const FORBIDDEN = [
  'restricted_location_ref', '00_EVIDENCE', 'evidence_manifest', 'node_state_projection',
  'participant_id', 'consent_status', 'post_anchor_originals', '"claims"', '"incentives"',
  '"lineage"', '"extensions"', 'internal_identifiers', 'original_filename', 'byte_for_byte',
];
for (const f of FORBIDDEN) check(!text.includes(f), `sin fuga: «${f}» no está en el archivo generado`);
const hashes = text.match(/"[0-9a-f]{64}"/g) ?? [];
const allowed = new Set();
for (const a of Object.values(IMPORTED_ACTIONS)) {
  allowed.add(`"${a.integrity.canonicalRoot.replace(/^sha256:/, '')}"`);
  allowed.add(`"${a.integrity.canonicalActionSha256}"`);
  allowed.add(`"${a.source.dashboardSyncSha256}"`);
  allowed.add(`"${a.source.technicalZipSha256}"`);
}
check(hashes.every((h) => allowed.has(h)), 'sin fuga: los únicos SHA-256 del generado son manifiesto, acción canónica, sync y ZIP', `${hashes.filter((h) => !allowed.has(h)).length} hashes de evidencia filtrados`);
const restrictedFieldNames = ['exact_coordinates', 'student_images', 'student_names', 'minor_photos', 'media_hashes'];
check(restrictedFieldNames.every((f) => !text.includes(`"${f}":`)), 'sin fuga: los campos restringidos no aparecen como claves con valor');

/* ── 3 · Invariantes de la carga ───────────────────────────── */
const byId = Object.fromEntries(INSTITUTIONAL_ACTIONS.map((a) => [a.id, a]));
const mont = INSTITUTIONAL_ACTIONS.filter((a) => a.nodeKey === 'montessori');
check(mont.every((a) => a.ses.policy === 'RECORD_ONLY' && a.ses.delta === null), 'Montessori: las 3 son RECORD_ONLY sin delta');
check(mont.every((a) => a.nodeId === 'spn_776c056a5d48505e28e48471'), 'Montessori: nodo canónico spn_776c…');
const limpieza = byId.spa_1d5ab097e8ef11a8c1f5a0b1;
check(limpieza?.ses.delta === 8, 'Posicionarte: SES 8 por la acción');
check(limpieza?.ses.allocations?.every((x) => x.attributedSesDelta === 4), 'Posicionarte: 4 a cada participante');
check(limpieza?.ses.organizationProjection?.sesDelta === 8, 'Posicionarte: referencia institucional 8, no aditiva');
check(limpieza?.metric.value === null, 'Posicionarte: kilos de residuo en null (no medido), no 0');
const tandil = byId.spa_e3f59a696ba3e4158a70eeef;
check(tandil?.metric.kpiEligible === false, 'Tandil: plantines visibles no entran al KPI de árboles');
check(tandil?.occurredOn === '2026-08-13', 'Tandil: fecha del hecho 13/08/2026');
check(byId.spa_28e2ea29d11c7e8200af48f2?.occurredOn === null && byId.spa_245c52c46011db10e4e0fe5c?.occurredOn === null, 'mensajes y huerta: fecha del hecho no informada (null)');
check(INSTITUTIONAL_ACTIONS.every((a) => a.anchor.cid === null && a.anchor.storageType === 'hash_only'), 'las 4 son hash_only sin CID');
check(INSTITUTIONAL_ACTIONS.every((a) => a.anchor.tx && a.anchor.blockNumber && a.anchor.chainId === 56), 'las 4 tienen tx, bloque y chain 56');
check(INSTITUTIONAL_ACTIONS.every((a) => a.anchor.verification?.verified === true), 'las 4 verificadas por nosotros contra la red (verify:onchain)');
check(INSTITUTIONAL_ACTIONS.every((a) => a.anchor.contract === '0x141cc96351d622fcf26fAA40E0fd2a1ba8D25e1B'), 'contrato del registro en las 4');

const h = institutionalHierarchy('montessori');
const count = (id) => h.nodes.find((n) => n.nodeId === id)?.count;
check(count('spn_776c056a5d48505e28e48471') === 3, 'acumulación: el colegio ve 3 acciones', `${count('spn_776c056a5d48505e28e48471')}`);
check(count('spn_4e42abca7b6c2d7644a70d2d') === 2, 'acumulación: sexto grado ve 2', `${count('spn_4e42abca7b6c2d7644a70d2d')}`);
check(count('spn_08b111bd05e294da507c274f') === 1, 'acumulación: salas de 5 ve 1');
check(h.nodes.filter((n) => n.nodeId === 'spn_4e42abca7b6c2d7644a70d2d').length === 1, 'sexto grado aparece una sola vez en el árbol');
check(h.external.every((c) => c.rollupEnabled === false), 'colaborador municipal sin acumulación');
const hp = institutionalHierarchy('posicionarte');
check(hp.nodes.find((n) => n.nodeId === 'spn_394da9811c6ea308b5841147')?.count === 1, 'Posicionarte: la organización ve 1 acción, no 3');

/* ── 4 · Render ─────────────────────────────────────────────── */
const CHECKS = [
  ['/demo/institucion/montessori/acciones', 'Plantación educativa de sexto grado en Tandil', true, 'Mis Acciones: Tandil listada'],
  ['/demo/institucion/montessori/acciones', 'No asignado', true, 'Mis Acciones: SES no asignado, no 0'],
  ['/demo/institucion/montessori/acciones', '+0 SES', false, 'Mis Acciones: nunca +0'],
  ['/demo/institucion/montessori/acciones', 'todavía no tiene acciones verificadas', false, 'Mis Acciones: el vacío ya no aplica'],
  ['/demo/institucion/montessori/acciones', 'EDESUR', false, 'Mis Acciones: sin facturas de Martín'],
  ['/demo/institucion/montessori/acciones/spa_e3f59a696ba3e4158a70eeef', 'No aplica · hash_only', true, 'ficha: CID no aplica'],
  ['/demo/institucion/montessori/acciones/spa_e3f59a696ba3e4158a70eeef', 'ipfs.io', false, 'ficha: sin enlace IPFS inventado'],
  ['/demo/institucion/montessori/acciones/spa_e3f59a696ba3e4158a70eeef', 'bscscan.com/tx/0x37158dbcb9a4264baae33190614aa21a9bf52f9ddfa55f86e144fe2647e0ba6a', true, 'ficha: enlace real al explorador'],
  ['/demo/institucion/montessori/acciones/spa_e3f59a696ba3e4158a70eeef', 'Anclaje verificado por Posicionarte', true, 'ficha: nuestra verificación con fecha'],
  ['/demo/institucion/montessori/acciones/spa_e3f59a696ba3e4158a70eeef', 'aguaribay', true, 'ficha: especie tentativa nombrada como no confirmada'],
  ['/demo/institucion/montessori/acciones/spa_28e2ea29d11c7e8200af48f2', 'Fecha no informada', true, 'ficha mensajes: fecha del hecho no informada'],
  ['/demo/institucion/montessori/acciones/spa_28e2ea29d11c7e8200af48f2', '01_mensajes_disenos_01.jpeg', true, 'ficha mensajes: candidatos listados sin publicar'],
  ['/demo/institucion/montessori/acciones/spa_28e2ea29d11c7e8200af48f2', 'src="/evidence', false, 'ficha mensajes: ningún candidato se sirve como imagen'],
  ['/demo/institucion/montessori/auditoria', 'Verificadas contra la red', true, 'auditoría: bloque de verificación'],
  ['/demo/institucion/montessori/auditoria', 'HASH_ONLY', true, 'auditoría: chip hash_only en vez de pendiente'],
  ['/demo/institucion/montessori/auditoria', 'Histórico documental', true, 'auditoría: el expediente sigue separado'],
  ['/demo/institucion/montessori', 'Acciones Verificadas Sustain', true, 'home: tarjeta de acciones'],
  ['/demo/institucion/montessori', 'Trayectoria institucional', true, 'home: la trayectoria sigue separada'],
  ['/demo/institucion/montessori/identidad', 'No asignado', true, 'identidad: puntaje no asignado'],
  ['/demo/institucion/montessori/identidad', 'Pendiente de anclaje', false, 'identidad: ya no dice pendiente de anclaje'],
  ['/demo/institucion/montessori/organizacion?s=estructura', 'Nodos Sustain', true, 'estructura: jerarquía de nodos'],
  ['/demo/institucion/montessori/organizacion?s=estructura', 'Nivel Secundario', true, 'estructura: la documental sigue'],
  ['/demo/institucion/montessori/impacto', 'RECORD_ONLY', true, 'impacto: aportes marcados RECORD_ONLY'],
  ['/demo/institucion/montessori/timeline', 'hash_only', true, 'timeline: IPFS explicado como hash_only'],
  ['/demo/institucion/montessori/timeline', 'Bicicleteada solidaria', true, 'timeline: el histórico sigue'],
  ['/demo/organizacion/posicionarte', 'Posicionarte Volunteer 01', true, 'Posicionarte: seudónimos'],
  ['/demo/organizacion/posicionarte', 'Nunca 8+4+4', true, 'Posicionarte: regla de no suma visible'],
  ['/demo/organizacion/posicionarte', '+12', false, 'Posicionarte: ningún 12 sumado'],
  ['/demo/organizacion/posicionarte', 'Cerón', false, 'Posicionarte: sin nombres reales'],
  ['/demo/organizacion/posicionarte/acciones/spa_1d5ab097e8ef11a8c1f5a0b1', 'No medido', true, 'Posicionarte ficha: kilos no medidos'],
  ['/demo/organizacion/posicionarte/acciones/spa_1d5ab097e8ef11a8c1f5a0b1', '0 kg', false, 'Posicionarte ficha: nunca 0 kg'],
  ['/demo/organizacion/posicionarte/auditoria', 'Verificadas contra la red', true, 'Posicionarte auditoría: verificación visible'],
  ['/demo/organizacion/posicionarte/auditoria', 'Histórico documental', false, 'Posicionarte auditoría: sin expediente ajeno'],
  ['/demo/escuela/posicionarte', 'Posicionarte Volunteer', false, 'ruta cruzada: /escuela/posicionarte no resuelve'],
  ['/demo', 'Posicionarte', true, 'hub: tarjeta de Posicionarte'],
  ['/demo/usuario/acciones', 'Tandil', false, 'nodo de Martín: sin acciones institucionales'],
];
const cache = {};
for (const [route, needle, shouldHave, desc] of CHECKS) {
  const html = cache[route] ??= render(route);
  check(html.includes(needle) === shouldHave, desc, `esperaba ${shouldHave ? 'presente' : 'ausente'}: "${needle}"`);
}

await server.close();
console.log(`\n${fail === 0 ? 'todas las verificaciones institucionales OK' : `${fail} verificaciones fallaron`}`);
process.exit(fail ? 1 : 0);
