# Carga de la entrega 05_INSTITUTIONS en el demo — 28 sep 2026

Estado al cierre del día. Fuente: `drive-files/05_INSTITUTIONS/` (3 acciones de Montessori, 1 de Posicionarte), manual v2 de Sustain, transcripción en `docs/comercial/transcripcion-audio-y-entrega-05-institutions-2026-09-28.md`.

## Qué funciona de verdad

| Ítem | Estado |
|---|---|
| Verificación on-chain de las 4 transacciones contra un nodo público de BNB Smart Chain (contrato, firmante, bloque, hash de bloque, timestamp, evento `ActionAnchored` con action_id y anchor_ref) | hecho · `npm run verify:onchain` · resultado con fecha en `src/demo/data/institutional/onchainVerification.js` |
| Importador con el contrato del manual (schema 2.2, ready_for_agency, action_id contra índice, SHA-256 del sync contra índice, directivas sin recálculo), UPSERT por action_id, proyección de campos permitidos | hecho · `npm run import:institutional` · genera `src/demo/data/institutional/imported.js` |
| Prueba de idempotencia (reimportar produce el mismo archivo) y de no fuga (evidencia, actores, claims, extensiones y hashes de fotos no llegan al bundle) | hecho · `npm run verify:institutional` (77 comprobaciones) |
| Nodo Montessori (`spn_776c…`) con sus 3 acciones en Mis Acciones, ficha, Timeline, Auditoría, Data Room, Impacto, Identidad y Reportes; histórico documental intacto y separado | hecho |
| Nodo Posicionarte (`spn_394d…`) como tipo nuevo `organizacion` en `/demo/organizacion/posicionarte`, con home propio, dos integrantes con seudónimo y SES 8 / 4 / 4 sin sumar | hecho |
| Sección Limpiezas (categoría ya existía) y nuevos tipos de acción cleanup / environmental_education / reforestation como aporte sin línea base | hecho |
| RECORD_ONLY en pantalla como «No asignado», nunca 0 ni pendiente; hash_only como «No aplica», nunca enlace IPFS; fecha del hecho `null` como «Fecha no informada · recibida …» | hecho |
| Jerarquía de nodos Sustain en Instituciones → Estructura, con acumulación por ancestro deduplicada por action_id (colegio 3, Primario 2, sexto grado 2, Jardín 1, sala de 5 1; municipio sin acumulación) | hecho |
| Auditoría: contador «Verificadas contra la red» separado de «Ancladas», chip HASH_ONLY, nota de nuestra verificación con fecha | hecho |
| Reportes: el CSV/JSON de acciones exporta almacenamiento, transacción, bloque, verificación de la agencia con fecha y política SES | hecho |
| Verificadores previos (`verify:attribution` 81/81, `verify:canonical`, `smoke` 73 rutas) actualizados y en verde | hecho |
| Build de producción (`VITE_BASE_PATH=/demo/ npm run build`) | hecho, sin desplegar |

## Qué está simulado o no existe

- Los medios candidatos (8 diseños, 2 fotos de huerta) se listan por nombre en el Data Room pero no se muestran ni se sirven: `publication_authorized_by_this_package: false` en los cuatro `access_policy.json`. Se publican sólo cuando la escuela apruebe y quede registrado.
- El `dashboard_sync.json` figura en el Data Room como artefacto interno sin contenido: no se sirve desde el navegador, por pedido del manual.
- Posicionarte no tiene expediente, así que Instituciones muestra únicamente la jerarquía de nodos Sustain. Reportes e Impacto funcionan sobre su única acción.
- La descripción de la limpieza y las limitaciones del MRV vienen en inglés en el paquete y se muestran así, con etiqueta. El título de la limpieza se tradujo (edición editorial permitida por el manual).
- Sigue sin existir login, carga de facturas ni conectores.

## Lo que Sustain pide de vuelta (manual v2, criterio de aceptación)

Capturas de las tres fichas de Montessori, del agregado del colegio, de las secciones Educación Ambiental y Reforestación, y el resultado de la prueba de reimportación. Todo eso hoy se puede generar desde el demo local; queda pendiente sacar las capturas y mandarlas junto con la confirmación de que la estructura de carpetas y los campos del manual resultan claros.

## Observaciones para Martín

- La huerta (`spa_245c…`) viene con `log_index: 0` y `gas_used: null` en el registry_proof. En la red el evento está en el índice 237 del bloque y gastó 28258 de gas, igual que las otras tres. No afecta la validez; es un dato de empaquetado incompleto.
- La carpeta se llama `05_INSTITUTIONS` en Drive y `02_INSTITUTIONS` en los dos manuales y en todos los `path` de los índices. El importador no depende del nombre, pero conviene unificarlo.
- Las descripciones y limitaciones del paquete de Posicionarte están en inglés; las de Montessori en castellano. Si la ficha pública tiene que salir en castellano, hace falta que el paquete lo traiga así o que quede acordado que la agencia lo traduce.
- El contrato `0x141c…` no tiene código verificado en BscScan (o al menos no pudimos comprobarlo). La firma del evento la reconocimos por hash de `ActionAnchored(address,string,string,uint256)`; publicar el ABI evitaría adivinar.

## Cómo reproducir

```
node scripts/import-dashboard-sync.mjs      # lee drive-files/05_INSTITUTIONS, escribe imported.js
npm run verify:onchain                      # consulta BNB Smart Chain, escribe onchainVerification.js
npm run verify:institutional                # contrato, idempotencia, fuga, invariantes, render
npm run verify:attribution && npm run verify:canonical && npm run smoke
npm run dev                                 # /demo/institucion/montessori · /demo/organizacion/posicionarte
```

Nota sobre el pipeline: `drive-files/` no está en el repo (es material del cliente), así que `verify:institutional` omite la reimportación cuando la carpeta no existe y verifica todo lo demás.

## Archivos tocados

Nuevos: `scripts/import-dashboard-sync.mjs`, `scripts/verify-onchain.mjs`, `scripts/verify-institutional.mjs`, `src/demo/data/institutional/imported.js` (generado), `src/demo/data/institutional/onchainVerification.js` (generado), `src/demo/data/institutionalActions.js`, `src/demo/modules/HomeOrganizacion.jsx`.

Modificados: `package.json`, `scripts/assert-attribution.mjs`, `scripts/smoke.mjs`, `scripts/verify-canonical.mjs`, `src/demo/DemoHub.jsx`, `src/demo/data/{actionShape,actions,dataRoom,impact,institutions,nodeTypes,nodes,reports,sustainNodes}.js`, `src/demo/modules/{ActionDetail,Auditoria,HomeEscuela,Identity,Impacto,Instituciones,MisAcciones,Reportes,Timeline,index}.jsx`.

Corrección colateral: el hub mostraba «SES Score» sobre la tercera tarjeta de Montessori, que en realidad es «Evidencias y Documentos» (56). La etiqueta ahora sale del dato.
