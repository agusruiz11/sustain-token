# Análisis de handoffs Sustain — 18 ago 2026

Revisión completa de los tres paquetes que mandó Martín (Entregable 3, Implementation
Package Montessori, Mobility Handoff) contra el estado actual del código.

**TL;DR:** llegaron tres entregas que se pisan entre sí, con una contradicción de
fondo que hay que resolver antes de escribir una línea: **el nodo del piloto
energético (8 facturas EDESUR) no es de Montessori, es de Martín**, y nuestro código
lo tiene atribuido a la escuela. Además, **los anclajes on-chain que Martín dice que
existen no están en ninguno de los archivos que mandó** — el Dashboard Sync dice
literalmente `pending`.

Los audios (transcriptos, ver
[docs/transcripcion-audios-2026-08-13-14.md](transcripcion-audios-2026-08-13-14.md))
resuelven la prioridad: **Montessori primero, Movilidad después, sin apuro**. Y Martín
llegó por su cuenta al mismo hallazgo del nodo.

---

## 1. Cronología de lo que pidió

| Fecha | Mensaje | Qué pide | Estado |
|---|---|---|---|
| 11 ago 09:29 | Audio Martín (vía Santi) | **Frenar.** No avanzar hasta reunirnos. Revisar "Dashboard Sync" por los anclajes | Superado |
| 11 ago 09:35 | Audio Martín | Ya procesó el PDF de 109 pág + Excel. Tiene Word + JSON listos | — |
| 11 ago 11:13 | Entregable 3 + Implementation Package v1.0 | Alimentar los 11 módulos con histórico institucional real. No rediseñar | **Sin empezar ← PRIORIDAD** |
| 11 ago (s/h) | Adenda auditor externo | Dejar arquitectura preparada para acceso temporal read-only de auditor | **Sin empezar** |
| 13 ago 08:10 | 🎙️ Audio | Movilidad para la reunión de La Caja de las 11. *"Si se puede, golazo; si no, no hay drama"* | Deadline muerto (ver 14 ago) |
| 13 ago 08:38 | 🎙️ Audio | 💰 **Que le coticemos** el piloto de 20-30 empleados de La Caja | **Sin responder** |
| 14 ago 12:14 | 🎙️ Audio | La reunión ya se hizo y salió bien **sin necesidad del dashboard** | Cerrado |
| 14 ago 12:15 | 🎙️ Audio | **"Frenalo [Movilidad], es más importante lo de la escuela"** + confirma que las facturas son de él | Repriorizado |

### 1.1 Lo que aportan los audios (y que no estaba en los resúmenes escritos)

Los cuatro audios estaban sin escuchar. Son los que definen la prioridad real:

1. **El deadline de Movilidad está muerto.** La reunión de La Caja se hizo el 13 a las 11,
   salió bien, y *"no fue necesario mostrar el dashboard, porque estaban buscando otra
   cosa: algo más estimado o autodeclarado"*. La Caja quiere una campaña de concientización
   por encuesta, **no** medición real de viajes. Movilidad es una apuesta a futuro
   ("desde el momento que decidan empezar a medir, entramos de cabeza"), no una urgencia.

2. **Martín repriorizó explícitamente:** *"si quieren, esto de las biclas frenalo, es más
   importante lo de la escuela… es más importante la escuela, que es el primer cliente,
   a que me suban estos viajes en bici a mi usuario"*. Y agrega: *"sin ningún tipo de
   presión con el tiempo, no hay apuro"*. → **Montessori pasa a ser Fase 1.**

3. **Confirma el hallazgo de atribución del nodo por su cuenta** (§2.1 de este doc):
   *"esas facturas de luz también son mías. Capaz que tendríamos que revisar cómo están
   recibiendo ustedes los datos por nodo para identificar que son mías… por el número SPN
   no termina de quedar todo clarísimo"*. Va a agregar nombres de pila a cada nodo.
   → Ya no hace falta preguntárselo: está confirmado y él está actuando sobre eso.

4. **Hay un pedido comercial sin responder** (13 ago 08:38): quiere que le coticemos cuánto
   le cobraríamos a La Caja por subir la data de 20-30 empleados al dashboard, y sugiere
   que la agencia le facture directo. Es tema de Agus/Santi, pero lleva 5 días sin respuesta.

5. **Montessori no le dio feedback todavía:** *"Ahí no me dieron feedback, calculo que
   todavía… no sé si se han podido poner"*. Los 12 `open_queries` siguen abiertos.

---

## 2. Hallazgos críticos

### 2.1 🔴 El nodo `spn_01ee6583da858ca1fa19323d` es de Martín, no de Montessori

`node_state.json` del handoff de Movilidad lo dice sin ambigüedad:

```json
"node_id": "spn_01ee6583da858ca1fa19323d",
"node_type": "individual",
"owner": "MARTIN PABLO CERON",
"wallet": "0xB4E8004E4047838c9fd8d4e2a0ba12791935b758",
"wallet_status": "founder_wallet"
```

Y su `activity_summary` desglosa las 14 acciones verificadas del nodo:
**8 energy + 1 plastic_recovery + 5 mobility**.

Esas 8 acciones de energía son exactamente las 8 facturas EDESUR que nuestro código
atribuye a la escuela:

- [src/demo/data/actions.js:20](src/demo/data/actions.js#L20) — *"Estas 8 acciones son el
  piloto REAL de Montessori School (nodo spn_01ee...)"* → **es falso**
- [src/demo/data/institutions.js:23](src/demo/data/institutions.js#L23) — mismo comentario
- [src/demo/data/actions.js:85](src/demo/data/actions.js#L85) — `const NODE = 'spn_01ee...'`
  usado como nodo de Montessori

Esto coincide exactamente con lo que Martín viene repitiendo en los tres mensajes:
*"son facturas de él y de familiares"*, *"son para mi dashboard, son mías"*.

✅ **Confirmado por el propio Martín en el audio del 14 ago 12:15**, sin que se lo
preguntáramos: *"esas facturas de luz también son mías. Capaz que tendríamos que revisar
cómo están recibiendo ustedes los datos por nodo para identificar que son mías. Capaz que
en la carpeta del Drive no se entiende bien eso. Voy a ver si les agrego un nombre inicial
a cada nodo… por el número SPN no termina de quedar todo clarísimo."*

O sea que llegó a la misma conclusión que nosotros y ya está tomando acción sobre la
causa raíz (identificar los nodos por nombre y no por SPN). Esto deja de ser una pregunta
abierta y pasa a ser una corrección acordada.

**Consecuencia:** las 8 facturas + el 1 de plastic_recovery + los 5 viajes **van todas
al dashboard de usuario** (`/demo/usuario`), no al de la institución. Y Montessori se
queda temporalmente sin acciones Sustain verificadas — su dashboard pasa a alimentarse
100% del histórico institucional (que es justamente lo que pide el Entregable 3).

Esto no es un ajuste cosmético: hoy `HomeEscuela`, `Impacto`, `Auditoria`, `DataRoom`
y `Timeline` de Montessori leen de ese dataset. Hay que mudarlo.

### 2.2 🔴 Los anclajes on-chain NO existen en ningún archivo entregado

Martín dijo: *"las facturas de demo sí tienen anclaje on-chain... revisen el Dashboard
Sync, probablemente miraron otro archivo"*. Revisé el Dashboard Sync que mandó (el de
Movilidad, `01_dashboard/dashboard_sync.json`) y **contradice esa afirmación**:

```json
"pilot_ui_simulation": {
  "warning": "DEMO ONLY — the five mobility packages have not been supplied here with real...",
  "display_ipfs_status": "simulated_anchored",
  "display_blockchain_status": "simulated_anchored",
  "real_cid": null,
  "real_transaction_hash": null
}
```

Y cada una de las 5 acciones trae `"ipfs_cid": "pending"`, `"chain_anchor_tx": "pending"`.
Los `action_report.json` de los 5 paquetes también: `"ipfs_cid": "pending"`,
`"chain_anchor_tx": "pending"`, `"ipfs_status": "pending"`, `"blockchain_status": "pending"`.

Hice un grep de hashes de transacción y CIDs sobre **todo** `drive-files/`. Los únicos
`0x…` que aparecen son el address del contrato (`0x141cc963…`) y la wallet de Martín.
**Cero CIDs IPFS, cero tx hashes.** El propio brief nos prohíbe inventarlos:

> *"Do NOT invent or hardcode fake CIDs or transaction hashes and present them as real."*

**Conclusión:** nuestro dashboard mostraba "8 pendientes" **porque es el estado correcto**.
No hay discrepancia de nuestro lado. O bien Martín se refiere a otro Dashboard Sync que
nunca nos llegó (uno de Energía, distinto de este de Movilidad), o los anchors todavía no
se hicieron — cosa que él mismo admite en el mensaje del 14: *"todavía no hice esos anchors"*.

👉 **Pedirle explícitamente:** el `dashboard_sync.json` del módulo **Energía**, si existe.
El que tenemos es `"purpose": "agency_mobility_dashboard_pilot"`, solo cubre movilidad.

### 2.3 🟠 Tres escalas de SES incompatibles conviviendo

| Fuente | SES | Escala | Acciones | Nivel |
|---|---|---|---|---|
| `node_state.json` (canónico) | **35** | 0–1000 acumulativo | 14 | Level 1 — Verified Participant |
| [src/demo/data/user.js](src/demo/data/user.js) | 842 | ?/1000 | 24 | Nivel Avanzado 4/7 |
| [src/demo/data/institutions.js](src/demo/data/institutions.js) | 20 | ? | 8 | — |

El canónico manda: SES 35, 14 acciones, Level 1. Los 842/24 de `user.js` son inventados
de la maqueta original y hay que reemplazarlos. Ojo que esto **degrada visualmente** el
dashboard de usuario (de "Nivel Avanzado 842" a "Level 1, SES 35") — es correcto pero
conviene avisarlo antes de que lo vea en la reunión y piense que rompimos algo.

Bonus: el nodo tiene **1 acción de plastic_recovery** (`love_bottles_prepared: 1`,
`plastic_prepared_kg: 0.3`) que no existe en nuestro dataset. Falta su paquete.

### 2.4 🟠 Reglas duras que el código actual todavía no respeta

Del Entregable 3 y del `implementation_manifest.json`, no negociables:

1. `historical_import` ≠ `sustain_verified`. Nunca decir "verificado", "MRV", "CID" u
   "on-chain" sobre un histórico.
2. `quality_status: needs_review` **no alimenta KPI públicos**.
3. Las 8 EDESUR son fixtures demo → `data_mode=demo`, `owner=demo_fixture`, separadas
   del dataset institucional.
4. **No** crear un módulo 12 — el histórico entra transversal en los 11 existentes.
5. COA = framework externo configurable, no taxonomía core.
6. No completar datos faltantes por inferencia.

El punto 6 choca de frente con lo que hicimos en [src/demo/data/actions.js:22-45](src/demo/data/actions.js#L22-L45),
donde reconstruimos valores `derived` desde coordenadas SVG e `inferred` desde badges.
Está honestamente documentado y con `null` donde no sabíamos — pero ahora hay dataset
canónico, así que **eso se borra y se reemplaza por la fuente real**.

---

## 3. Inventario de lo que llegó

### 3.1 Implementation Package Montessori v1.0

21 datasets canónicos, IDs estables, listos para importar. Volumen real:

```
institution 1 · sites 1 · organizational_units 8 · people 5 · role_assignments 6
programs 13 · projects 10 · actions 13 · indicator_definitions 18
measurements 168 · assets 16 · utility_accounts 5 · meters 5
documents 24 · evidence 32 · partners 22
certification_frameworks 1 · framework_requirements 14 · compliance_assessments 14
conciliation 9 · open_queries 12
```

Más `ui_contract/` con 11 JSON (uno por módulo) que definen datasets consumidos,
filtros, secciones, navegación y reglas de negocio. Es un contrato 1:1 con nuestros
módulos — mapea limpio contra `src/demo/modules/`.

Más `config/`: `import_order.json` (21 pasos ordenados para evitar refs huérfanas),
`import_rules.json` (IR-001..IR-010), `demo_data_policy.json`, `status_catalogs.json`.

**Calidad: muy buena.** Es el mejor material que mandó hasta ahora. Se puede implementar
casi mecánicamente.

**Lo que falta:** los 12 `open_queries` (Q01–Q12) son datos que Montessori todavía no
confirmó — Botellas de Amor 2021 (307 kg vs 1.257 kg), la hoja ENERGÍA vacía 2023-2026,
sedes, autorizaciones de privacidad. Van renderizados como "Pendiente / Por confirmar".

### 3.2 Mobility Agency Handoff

- `dashboard_sync.json` — contrato principal (8.7 KB)
- 3 fuentes canónicas (`node_state`, `mobility_history`, `dashboard_update_trip05`)
- **5 ZIPs con paquete completo por viaje**: `action_report.json` (metodología de
  carbono completa con fuentes ADEME y URLs), `mrv_report.json`, `ses_score.json`,
  `baseline_report.json`, `validation_report.json`, `manifest.json`, `hash.txt`, y
  **la evidencia real: capturas JPEG de Strava** (280-380 KB c/u)

Los 5 viajes:

| # | action_id | Fecha | km | Duración | SES Δ | CO₂e kg | Hash SHA-256 |
|---|---|---|---|---|---|---|---|
| 01 | `spa_0edd3a75…` | 14 jul 08:54 | 6.75 | 25m 12s | 0 (genesis) | 0.2538 | `cbe66d93…` |
| 02 | `spa_35831395…` | 14 jul 17:53 | 5.77 | 22m 25s | +3 | 0.216952 | `80a95dbe…` |
| 03 | `spa_192f38f6…` | 22 jul 14:13 | 12.81 | 46m 09s | +3 | 0.481656 | `814caec1…` |
| 04 | `spa_03db3349…` | 22 jul 18:26 | 12.26 | 48m 37s | +3 | 0.460976 | `f7bd7db2…` |
| 05 | `spa_c03de1ab…` | 27 jul 17:38 | 7.28 | 28m 13s | +3 | 0.273728 | `0da50d1b…` |

Totales canónicos: **44.87 km · 5 acciones · 1.687112 kg CO₂e · SES 23→35 · MRV-M1 / MEDIUM**.
Genesis baseline = Trip 01 (por eso Δ0). **No recalcular nada de esto en frontend.**

Metodología: `SUSTAIN-MOBILITY-CARBON v1.0`, factor de referencia
**0.0376 kg CO₂e/pasajero-km** (autocar térmico, ADEME Base Empreinte), fórmula
`distancia × max(factor_referencia − factor_modo, 0)`. Etiquetar siempre como
*estimación modelada, no medición directa*.

Ventaja concreta: `categories.js` **ya tiene la categoría `movilidad`** (línea 231), así
que no hay que tocar la taxonomía.

### 3.3 PDF La Caja

Comercial, no técnico — deck de 8 páginas para vender el módulo Movilidad a La Caja.
Confirma el posicionamiento (provider-agnostic, storage-agnostic) y los mismos números.
No aporta requisitos nuevos, pero **explica por qué Movilidad es urgente**: es material
de venta para un cliente corporativo. Los campos `institutional.*` deshabilitados del
`dashboard_sync` están reservados justamente para La Caja.

### 3.4 Audios — transcriptos

Los 4 `.ogg` (5:20 en total) están transcriptos con faster-whisper `medium` local en
[docs/transcripcion-audios-2026-08-13-14.md](transcripcion-audios-2026-08-13-14.md).

**No eran redundantes con los resúmenes escritos.** Traen la repriorización (escuela
antes que Movilidad), el cierre de la reunión de La Caja, la confirmación del problema
de atribución de nodo, y un pedido de cotización sin responder. Ver §1.1.

---

## 4. Gap: los 11 módulos actuales vs. lo pedido

Los 11 están construidos (5.387 líneas en `src/demo/`) y la arquitectura de
`nodeTypes.js` + `DashShell` + `modules/index.jsx` aguanta bien lo que viene. Nada
para rediseñar. Lo que cambia:

| Módulo | Archivo | Qué falta |
|---|---|---|
| Home | `HomeEscuela.jsx` | Bloque "Trayectoria institucional" separado de "Acciones verificadas". KPIs: 13 programas / 10 proyectos / 18 indicadores / 168 mediciones / 24 docs / 32 evidencias |
| Mis Acciones | `MisAcciones.jsx` | Filtro `record_origin`. Badge "Histórico"/"Documentado". **Vista Movilidad + 5 viajes** |
| ActionDetail | `ActionDetail.jsx` | Ficha histórica SIN pipeline de 10 pasos. **Detalle de viaje** con evidencia Strava, MRV, CO₂e, SES Δ |
| Data Room | `DataRoom.jsx` | Selector "Acciones Sustain" / "Archivo institucional" + 10 grupos. "Referencia en expediente" (PDF p.24-27) |
| Timeline | `Timeline.jsx` | Filtros por origen, iconografía diferenciada, 13 hitos históricos (2019→2025) |
| Impacto | `Impacto.jsx` | Taxonomía configurable. Procedencia por KPI (Medido/Calculado/Reportado/Histórico/Verificado). `needs_review` fuera de KPI públicos |
| Reportes | `Reportes.jsx` | 6 tipos de reporte + selector de marco. Exportar `record_origin` + `verification_status` |
| Auditoría | `Auditoria.jsx` | Tabla de auditoría documental histórica. Estados: Histórico/Documentado/Soporte de tercero/Verificado/Anclado |
| Instituciones | `Instituciones.jsx` | **Modificación fuerte.** 7 subsecciones. Fichas de programa y proyecto |
| Identity | `Identity.jsx` | Bloque "Trayectoria institucional" separado del SES |
| Integraciones | `Integraciones.jsx` | Solo copy: 6 estados nuevos, Drive como PoC |
| Configuración | `Configuracion.jsx` | Taxonomía, fuentes, frameworks externos, permisos. **Auditor externo** |

Módulo Movilidad: **no es un módulo 12**. Entra como categoría dentro de Mis Acciones +
Impacto, más una vista "Mobility Overview". El nodo `usuario` ya tiene los 11 módulos
habilitados en `nodeTypes.js`, así que no hay que tocar routing.

### Auditor externo (adenda)

Martín fue explícito: *"no hace falta desarrollarlo ahora, pero que la arquitectura y
el diseño queden preparados"*. Lo que hay que dejar listo en `Configuracion.jsx`:

- Generar invitación temporal (7 / 15 / 30 días) con vencimiento y revocación
- Scope por módulo: Auditoría, Data Room, Reportes, indicadores, acciones, evidencias
- Scope por alcance: framework/certificación, período, conjunto de evidencias
- Read-only estricto: sin cargar, editar ni borrar, sin permisos de configuración

Encaja con `access_level: public / institutional / audit_restricted` que ya viene en
el dataset canónico. La UI se puede maquetar sin backend.

---

## 5. Plan propuesto

**Orden definido por Martín en el audio del 14 ago:** la escuela primero, Movilidad
después, sin apuro. Esto invierte el orden que parecía obvio por los deadlines escritos.

Fase 0 va primero igual, **antes de tocar nada más** — si no, construimos sobre la
atribución equivocada y hay que rehacerlo.

**✅ Fase 0 · Corrección de atribución — HECHA (18 ago)**
Registro canónico de nodos en [sustainNodes.js](../src/demo/data/sustainNodes.js) con
nombre además del SPN, que es justo lo que Martín pidió. Las 8 EDESUR movidas al nodo
usuario y marcadas `dataMode: demo` / `owner: demo_fixture`. SES alineado a 35 / 14
acciones / Level 1. Montessori sin acciones Sustain, con empty state explicado.
Eliminados el CID, el tx hash y la red inventados. Detalle en §8.

**✅ Fase 1 · Importar canónico Montessori — HECHA (18 ago)**
Los 21 datasets copiados a [src/demo/data/montessori/](../src/demo/data/montessori/) más
una capa de acceso que aplica IR-004 / IR-006 / IR-007 / IR-009 en un solo lugar.
33 invariantes verificadas con `npm run verify:canonical`.

**✅ Fase 2 · Instituciones + Timeline + Data Room — HECHA (18 ago)** — ver §9
**✅ Fase 3 · Impacto + indicadores — HECHA (18 ago)** — ver §10
**✅ Fase 4 · Auditoría + Reportes — HECHA (18 ago)** — ver §11
**✅ Fases 5 y 6 · Home/Identity y Configuración — HECHAS (18 ago)** — ver §12

**Fase 7 · Movilidad (1-1.5 días)** ← *despriorizado por pedido explícito de Martín*
Copiar los 5 JPEG a `public/evidence/mobility/`. Crear `src/demo/data/mobility.js` con
los valores canónicos literales. Mobility Overview + tabla de 5 + detalle con evidencia,
MRV, metodología ADEME y trazabilidad en estado **DEMO/simulado explícito**.

Total ≈ **10-11 días** de trabajo efectivo, igual que antes; cambia el orden, no el
volumen. Fases 0+1+2 (~3,5 días) ya dan algo mostrable de Montessori.

**Nota sobre Movilidad:** el paquete está completo y listo; moverlo al final no lo
encarece. Si en algún momento La Caja decide medir de verdad, Fase 7 se adelanta y son
1-1,5 días. Vale la pena tenerlo presupuestado pero no bloquear la escuela por eso.

---

## 6. Preguntas para Martín

Los audios cerraron tres de las cuatro preguntas bloqueantes que tenía este doc. Queda:

**Bloqueante (1):**

1. **¿Existe un `dashboard_sync.json` del módulo Energía?** El que mandó es
   `purpose: agency_mobility_dashboard_pilot` — solo movilidad, y dice `pending`. Si los
   anchors de las 8 facturas existen, están en un archivo que no nos llegó. Si no existen,
   confirmamos que "pendiente de anclaje" es el estado correcto y seguimos.

**Ya resueltas por los audios — no preguntar de nuevo:**

- ~~¿Las 8 EDESUR van al nodo usuario?~~ → Sí, confirmado por él el 14 ago. Además va a
  agregar nombres a los nodos para que no se preste a confusión.
- ~~¿Cuál es la prioridad / fecha objetivo?~~ → Escuela primero, Movilidad después,
  *"sin ningún tipo de presión con el tiempo, no hay apuro"*.
- ~~¿La reunión de La Caja?~~ → Se hizo el 13, salió bien, no hizo falta el dashboard.

**Avisar (no preguntar):**

2. **SES real = 35, no 842.** Al corregirlo el dashboard de usuario baja de "Nivel
   Avanzado 842" a "Level 1 · SES 35". Es lo correcto según `node_state.json`, pero
   conviene avisarlo para que no lo lea como una regresión.

**No bloqueantes:**

3. Falta el paquete de la acción de plastic_recovery (1 acción, 0.3 kg) del nodo de Martín.
4. Trips 02-05 no traen `strava_share_link.txt` — solo el Trip 01 tiene link público.
5. Los 12 `open_queries` los mostramos como "Pendiente". Martín dijo que Montessori todavía
   no le dio feedback, así que asumimos que siguen todos abiertos.
6. "Mantenimiento Sostenible": el Entregable 3 dice mapearlo a gobernanza/eficiencia
   operativa. Eso cierra la discrepancia abierta en
   [nodeTypes.js:172](src/demo/data/nodeTypes.js#L172) sin necesidad de consultarlo.

**Pendiente comercial (Agus/Santi, no técnico):**

7. 💰 Martín pidió el 13 ago que le coticemos **cuánto le cobraríamos a La Caja por subir
   la data de 20-30 empleados al dashboard**, y sugirió que la agencia facture directo a
   La Caja. Lleva 5 días sin respuesta. No bloquea el desarrollo, pero es plata sobre la
   mesa y conviene contestarlo aunque sea para decir "lo vemos cuando La Caja avance".

---

## 7. Riesgos

- **Atribución.** Si arrancamos por Movilidad sin hacer Fase 0, duplicamos el trabajo:
  los 5 viajes van al mismo nodo que hay que mudar.
- **Expectativa de anchors.** Martín cree que los anclajes existen. Si en la reunión
  mostramos "pending" sin explicar antes, va a parecer que no leímos su material.
  Conviene mandarle el punto 2.2 **por escrito y antes** de la reunión.
- **Regresión visual del SES.** 842 → 35 se lee como un bug si no se avisa.
- **`needs_review`.** Si esos valores entran a KPI públicos violamos IR-006 y una regla
  explícita de aceptación del Entregable 3.
- ~~**Instrucción contradictoria** (frenar vs. implementar).~~ Resuelto por el audio del
  14 ago: se avanza, la escuela primero, sin apuro. El "frenar" del 11 quedó superado.
- **Audios sin escuchar.** Los cuatro `.ogg` estuvieron 4 días sin abrir y contenían la
  repriorización, el cierre de La Caja y un pedido de cotización. De haber arrancado por
  Movilidad —que era lo que sugerían los mensajes escritos— habríamos hecho 1,5 días de
  trabajo que Martín explícitamente pidió postergar. Conviene transcribir los audios
  apenas llegan: `~/whisper-env/bin/python` + modelo `medium`, corre local en ~2 min.

---

## 8. Registro de lo ejecutado — 18 ago 2026

Rama `fase0-atribucion-nodos`. Sin commit todavía.

### Fase 0 · Corrección de atribución

| Qué estaba mal | Dónde | Cómo quedó |
|---|---|---|
| 8 facturas EDESUR atribuidas a Montessori | `actions.js`, `institutions.js` | Movidas al nodo usuario, marcadas `dataMode: demo` |
| Ids `act_mont_energia_*` | `actions.js` | Renombrados a `act_martin_energia_*` |
| SES 842 / 24 acciones / "Nivel Avanzado 4/7" | `user.js` | 35 / 14 / Level 1 — Verified Participant |
| **CID inventado** `bafybeif2x8qmz3o9r1m…j5wt` | `user.js` | `null` + estado `pending` |
| **Tx hash inventado** `0xc2d5f1….e7a3b9d4` | `user.js` | `null` + estado `pending` |
| Red equivocada (Polygon) | `user.js` | BNB Smart Chain Mainnet, chain 56, contrato real |
| Saldo `178.45 $SUS` | `user.js`, `DemoHub.jsx`, `nodes.js` | Retirado — `reward_enabled: false` |
| Ranking global y racha inventados | `user.js`, `nodes.js` | Retirados; topbar muestra nivel y SES |
| Series de agua/residuos/compost inexistentes | `user.js` | Retiradas — el nodo tiene 0 en todas |
| Chart SES en eje 0-1000 con la curva a media altura | `HomeUsuario.jsx` | Eje 0-50; la serie sale de los 5 `dashboard_update.json` |
| `"+-30 pts"` en deltas negativos | `HomeUsuario.jsx` | Signo correcto |
| "Todas las acciones están respaldadas en blockchain" | `nodes.js` | Contradecía al audit trail de la misma pantalla |
| Sede "Ciudad Autónoma de Buenos Aires" | `institutions.js`, `organization.js` | Turdera, Lomas de Zamora |
| Salas y ciclos inventados | `organization.js` | Las 8 unidades canónicas reales |
| `meterSource: Factura EDESUR` | `organization.js` | Los 3 medidores eléctricos + gas + agua reales |
| Nota "las 8 acciones son las facturas reales del piloto" en todos los nodos | `MisAcciones.jsx` | Depende del nodo y dice "fixtures de demostración" |

Cambios de arquitectura, no sólo de dato:

- **`actionsByNode(node.slug)` → `actionsForNode(node)`.** El usuario final no tiene
  slug, así que el nodo se identifica con `dashboardKeyOf()`. Esto además arregla un bug
  latente: `impact.js` filtraba por un campo (`nodeSlug`) y devolvía siempre vacío para
  el dashboard de usuario.
- **Estado de cobertura `HISTORICAL`** en `impact.js`, con su color propio. El
  Entregable 3 § 4.5 exige que un KPI documentado y uno verificado no se pinten igual.
- **`AuditTrail` acepta `audit: null`** y distingue "pendiente de anclaje" de "sin dato".
- **Empty states de primera clase**: cero acciones verificadas es un estado legítimo del
  producto y se explica, no se disfraza de "ningún resultado para los filtros".

### Fase 1 · Histórico canónico

`src/demo/data/montessori/` — 21 datasets copiados literal desde el paquete (220 KB) más
`index.js`, la única puerta de entrada. Aplica las reglas duras en un solo lugar:
`publicMeasurements` excluye los 14 `needs_review`, `visibleAt()` filtra por
`access_level`, `indicatorTotal()` respeta `aggregation_method` y devuelve `null` en vez
de un 0 engañoso cuando no hay dato.

Dato que confirma que el paquete es coherente: los 14 `needs_review` son 12 de gas y 2 de
energía inyectada — exactamente las consultas abiertas Q05 y Q04.

Los contadores del nodo ya no están escritos a mano: salen de `trajectorySummary()`.

### Verificación

Tres scripts nuevos, corren en segundos:

```
npm run smoke                # 25/25 rutas del demo renderizan
npm run verify:attribution   # 31/31 — bloquea la regresión de atribución y de CIDs falsos
npm run verify:canonical     # 33/33 invariantes IR-003/004/006/007/009 + integridad referencial
```

`verify:attribution` es el que importa a futuro: falla si alguien vuelve a poner las
facturas de Martín en Montessori o reintroduce un hash inventado.

Build OK. Lint: 7 errores, todos preexistentes y ajenos a este trabajo (imports de
`motion` sin usar, `process` en `vite.config.js`).

### Lo que sigue

Fases 2-7 sin empezar: Instituciones/Timeline/Data Room histórico, Impacto con
procedencia por KPI, Auditoría documental, Reportes, Home/Identity, Configuración +
auditor externo. Y Movilidad al final, por pedido de Martín.

Falta pedirle: el `dashboard_sync.json` de Energía (si existe) y el paquete de la acción
de recuperación de plástico — declarada como hueco explícito en
`MISSING_ACTION_PACKAGES`, sin inventarle ficha.

---

## 9. Fase 2 — historia navegable (18 ago)

### Timeline ambiental del nodo (§ 4.4)

Une dos cronologías sin fundirlas: 16 eventos históricos (2019→2025) y las acciones
Sustain, ordenados por fecha, con filtro de origen. Lo que las separa a simple vista es
el punto —relleno para verificado, hueco para documentado— más el badge de estado.

Los hitos históricos **no renderizan la cadena de 10 pasos**. El spec lo prohíbe
expresamente y con razón: dibujar Hash → CID → Blockchain en gris sobre una bicicleteada
de 2019 sugeriría un pipeline que nunca corrió.

### Data Room de dos repositorios (§ 4.3)

Selector "Acciones Sustain" / "Archivo institucional". El segundo agrupa los 24
documentos en 11 categorías, cada uno con tipo, fecha, procedencia, nivel de acceso y
referencia. Cuando la única evidencia es un rango de páginas del expediente aparece como
**"Referencia en expediente · PDF p.24-p.27"**, no como un archivo descargable que no
existe (eso es la consulta Q10).

El spec enumera 10 grupos; agregué "Movilidad" como 11.º porque hay un documento de
movilidad sostenible y ninguno de los 10 le corresponde. Forzarlo a "Gobernanza" habría
sido peor.

**Selector "Ver como"** — Institución (19 docs) / Auditor externo (24) / Perfil público (0).
No es decorativo: filtra de verdad por `access_level`. Es el andamiaje del acceso temporal
de auditor que Martín pidió dejar preparado, funcionando ya sobre el dato real. Y el "0"
de perfil público es en sí un hallazgo: hasta que Montessori responda Q09, no hay nada
autorizado a publicar.

### Instituciones (§ 4.8, «MODIFICAR FUERTE»)

Las 7 subsecciones del spec: Perfil, Estructura, Responsables, Programas, Proyectos,
Indicadores, Frameworks. Programas abre ficha con objetivo, procedencia, fuente,
proyectos, hitos y evidencias vinculadas.

Subsección y ficha abierta viven en la URL (`?s=programas&prog=prog_solar_energy`), así
el botón atrás funciona y se puede compartir el link a una ficha concreta.

### Tres cosas que aparecieron al construir

**Un bug de privacidad.** `people.json` usa `access_level: "restricted"`, un cuarto valor
que no está en `config/status_catalogs.json`. Mi filtro hacía `ACCESS_ORDER[x] ?? 0`, o
sea que un nivel desconocido se trataba como **público** — y el registro afectado era el
representante legal de la escuela. Ahora un valor no reconocido se trata como el más
restrictivo. Ante algo que no entendemos, ocultar.

**Dos indicadores desaparecían sin decir por qué.** Consumo de gas (12 mediciones) y
energía inyectada (2) tienen *todas* sus mediciones en `needs_review`, así que el total
daba `null` y el filtro los borraba de la tabla. Un indicador que se esconde solo es peor
que uno que explica su ausencia: ahora aparecen los 18 con "Todas en revisión" y el conteo
`12 / 12`. Son exactamente las consultas Q05 y Q04.

**El Data Room abría en la pestaña vacía.** Montessori tiene 0 artefactos de pipeline y 24
documentos; el default caía en la primera. Ahora abre el repositorio que tiene contenido.

### Verificación

```
npm run smoke                # 34/34 rutas (incluye las 7 subsecciones y los 2 repositorios)
npm run verify:attribution   # 42/42
npm run verify:canonical     # 33/33 invariantes
```

Build OK. Lint: los mismos 7 errores preexistentes.

`DataTable` ganó `rowAction` — variante botón del patrón `rowHref` existente, para el
maestro-detalle de programas sin perder navegación por teclado.

---

## 10. Fase 3 — Impact Dashboard con procedencia (18 ago)

El § 4.5 pide que **cada KPI muestre su procedencia**: Medido / Calculado / Reportado /
Histórico documental / Verificado Sustain. El dataset no trae ese campo — trae
`measurement_method`, que es más granular. La traducción vive en `provenanceOf()`, en la
capa canónica, y la distinción que preserva es cuánto respaldo tiene el número:

| Procedencia | De dónde sale |
|---|---|
| Medido | lectura de instrumento (`meter_reading_register`) o factura del proveedor (`utility_billed`) |
| Calculado | ficha técnica (`technical_specification`), no una medición |
| Reportado | lo declaró la institución (`historical_manual_register`, `platform_reported`) |
| Histórico documental | no encaja en las anteriores y viene del expediente |
| Verificado Sustain | pasó el pipeline — gana sobre todas |

Resultado sobre el dato real de Montessori: 11 de 13 categorías con datos, todas
`Histórico documental`, ninguna `Verificado Sustain`. Consumo de agua y de gas salen como
**Medido**; capacidad fotovoltaica como **Calculado**; los 9 indicadores de residuos y los
3 de campañas como **Reportado**.

### Trazabilidad de KPI a expediente

Click en un indicador abre su detalle: cada medición con período, valor, procedencia,
calidad, estado de verificación y referencia de fuente. Es la cadena que el producto
promete, andando sobre dato real.

El caso de gas lo muestra entero: 12 mediciones, todas **Medido**, todas
**Requiere revisión**, y la fuente de cada fila dice por qué —
*"PDF p.9-p.12; tabla de lecturas/consumos. Junio presenta diferencia 3732/3733 en
distintas referencias"*. Eso es exactamente la consulta abierta Q05. El indicador no tiene
total y la pantalla explica que se recalcula solo cuando la institución confirme.

### Taxonomía configurable

Las categorías se resuelven con `appCategoryFor()` de la capa canónica, no con una lista
rígida en el componente. Cambiar la taxonomía no toca la UI.

`governance` y `social_sustainability` quedan deliberadamente sin equivalente Sustain: el
§ 4.5 prohíbe crearles categoría propia por defecto. Aparecen en el bloque "Fuera de la
taxonomía Sustain" con sus programas, para que la decisión quede a la vista en lugar de
resolverse por inercia. Eso cierra la discrepancia D6 que estaba abierta en
[nodeTypes.js](../src/demo/data/nodeTypes.js).

### Verificación

```
npm run smoke                # 37/37 rutas
npm run verify:attribution   # 51/51
npm run verify:canonical     # 33/33 invariantes
```

### Lo que queda

Fases 4-7: Auditoría documental + Reportes, Home/Identity, Configuración con el scaffolding
de auditor externo, y Movilidad al final por pedido de Martín.

---

## 11. Fase 4 — auditoría documental y reportes (18 ago)

### Auditoría (§ 4.7)

Dos secciones que no se mezclan. **Acciones Sustain** conserva la verificación
criptográfica —hash, CID, transacción— con su estado real. **Histórico documental** suma
214 registros auditables: 13 hitos, 168 mediciones, 24 documentos y 14 evaluaciones de
cumplimiento, cada uno con período, estado, nivel de acceso y referencia de fuente.

La trazabilidad llega hasta la celda: las mediciones citan
*"Excel DATOS POR AÑO, fila 10, columna 8"*, los documentos *"PDF p.9-p.12"*.

El spec pide afirmar que para el histórico MRV no está aplicado, SES no aplica y
CID/blockchain no aplican. Eso no es un cálculo por fila — es una propiedad de la
naturaleza del dato. Se dice una vez arriba de la tabla en vez de repetir tres columnas
vacías 214 veces.

Filtros por tipo, estado y "Ver como", el mismo selector de alcance del Data Room.

### Reportes (§ 4.6)

Seis tipos —Impacto ambiental, Acciones verificadas, Histórico institucional, Evidencias,
Auditoría, Integral— y tres marcos: Sustain Standard, el framework externo del nodo
(Sello Ambiental COA, leído de sus datos, no cableado) y Personalizado.

La lógica vive en [reports.js](../src/demo/data/reports.js) y no en el componente, porque
la regla que atraviesa todo es de datos, no de UI:

> «Cada exportación debe incluir campos de procedencia y estado de verificación para
> evitar que un tercero confunda histórico con MRV.»

Ese es el punto entero. Un CSV que sale de acá termina en la mano de un auditor que nunca
vio el dashboard: si una fila no dice de dónde salió, no tiene cómo saber que una medición
del expediente de 2021 no pasó por ningún pipeline. Por eso `record_origin` y
`verification_status` van en **todos** los tipos, están fijados en la vista previa aunque
queden fuera del corte de columnas, y hay invariantes que lo verifican:

```
✓ §4.6: reporte "impacto" exporta procedencia en sus 18 filas
✓ §4.6: reporte "acciones" exporta procedencia en sus 8 filas
✓ §4.6: reporte "historico" exporta procedencia en sus 36 filas
✓ §4.6: reporte "evidencias" exporta procedencia en sus 19 filas
✓ §4.6: reporte "auditoria" exporta procedencia en sus 214 filas
✓ §4.6: reporte "integral" exporta procedencia en sus 214 filas
✓ §4.6: las acciones demo se exportan marcadas como fixture
```

Las 8 facturas EDESUR salen con `data_mode: demo` en cualquier exportación — si alguien
manda ese CSV afuera, la fila lo dice.

El integral no concatena todo en una tabla: serían filas de formas distintas mezcladas.
Devuelve las cinco secciones por separado en el JSON, y el CSV lleva la de auditoría, que
es la única que abarca hitos, mediciones, documentos y evaluaciones a la vez.

### Detalles de uso

Reportes arrancaba en "Acciones verificadas" —vacío para Montessori— teniendo cinco tipos
llenos; ahora abre en el que tiene datos, igual que se corrigió el Data Room. La tabla de
auditoría muestra de a 50 registros con "ver más" en vez de pintar 214 de un saque, y la
vista previa de reportes muestra 25 filas aclarando que la exportación lleva todas.

### Verificación

```
npm run smoke                # 37/37 rutas
npm run verify:attribution   # 61/61
npm run verify:canonical     # 42/42 invariantes
```

### Lo que queda

Fases 5-7: Home + Environmental Identity, Configuración con el scaffolding de auditor
externo, y Movilidad al final por pedido de Martín.

---

## 12. Fases 5 y 6 — identidad y configuración (18 ago)

### Environmental Identity (§ 4.9)

El bloque **Trayectoria institucional documentada** va aparte del de SES, con su propio
borde, y lo dice explícitamente: *no otorga SES*. Muestra antigüedad, programas, categorías
con actividad, indicadores, evidencias y frameworks, con accesos directos a la cronología y
al perfil.

La reconciliación del puntaje que ya existía sigue: expone la diferencia entre el SES
declarado y lo que suman las acciones con delta conocido. Es una restricción verificable —
cuando lleguen los `ses_score.json` reales, los valores deberían cumplirla.

### Home (§ 4.1)

Se agregan los accesos "Ver histórico institucional" y "Ver perfil institucional" desde el
bloque de trayectoria, que era lo único que faltaba del § 4.1.

### Configuración (§ 4.11)

Cuatro secciones nuevas: taxonomía ambiental configurable, catálogo de fuentes de datos
(factura / sensor / carga manual / archivo histórico / integración / proveedor / tercero,
marcando cuáles usa el nodo de verdad), frameworks externos con estado y versión, y los
tres niveles de publicación con el conteo de documentos en cada uno.

### Acceso temporal de auditor externo — la adenda de Martín

> *"La institución debería poder generar una invitación/acceso temporal, por ejemplo por
> 7, 15 o 30 días, y definir qué información puede consultar ese auditor... No hace falta
> desarrollar toda esta funcionalidad ahora, pero sí quiero que la arquitectura y el
> diseño queden preparados."*

Está construido como **andamiaje real, no como maqueta**. La invitación se arma de verdad —
vigencia, módulos habilitados, framework, período— y el alcance se calcula sobre el dataset
con las mismas funciones de acceso que ya filtran el Data Room y la Auditoría.

Por eso el panel muestra el conteo exacto antes de emitir: **24 documentos (5 de acceso
restringido), 219 registros auditables, 32 evidencias**. Son 24 y no 19 porque el alcance de
auditoría levanta los `audit_restricted` — la diferencia sale del dato, no de un número
escrito a mano.

Configuración no es delegable: el auditor consulta, no administra.

Lo único que falta para que sea productivo es persistencia y un backend que emita el token.
La lógica de *qué ve* el auditor ya está y es la misma que usa el resto del producto, así
que conectar la autenticación no obliga a rehacerla.

### Verificación

```
npm run smoke                # 37/37 rutas
npm run verify:attribution   # 70/70
npm run verify:canonical     # 42/42 invariantes
```
