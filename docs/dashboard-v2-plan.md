# Dashboard Sustain v2.0 — Bajada a tierra

Traducción del brief (`drive-files/txt.txt`) + audio del 22/07 a estado real del código y plan de trabajo.

- **Fuentes:** [txt.txt](../drive-files/txt.txt) · [transcripción del audio](../drive-files/transcripcion-audio-2026-07-22.md)
- **Fecha de análisis:** 2026-07-27
- **Estado del repo:** rama `main`, último commit `152fb2a`

---

## 1. De qué partimos realmente

El "dashboard actual" que el cliente elogia son **3 páginas de demo independientes**:

| Ruta | Archivo | LOC |
|---|---|---|
| `/demo` | [DemoHub.jsx](../src/demo/DemoHub.jsx) | 234 |
| `/demo/empresa/:slug` | [EmpresaDashboard.jsx](../src/demo/EmpresaDashboard.jsx) | 328 |
| `/demo/institucion/:slug` | [InstitucionDashboard.jsx](../src/demo/InstitucionDashboard.jsx) | 306 |
| `/demo/usuario` | [UsuarioFinal.jsx](../src/demo/UsuarioFinal.jsx) | 379 |

Stack: React 19 + Vite 8 + react-router-dom 7 + framer-motion. Componentes compartidos:
[DashSidebar](../src/demo/components/DashSidebar.jsx), [ChartLine](../src/demo/components/ChartLine.jsx),
[ChartDonut](../src/demo/components/ChartDonut.jsx), [AuditTrail](../src/demo/components/AuditTrail.jsx).
Datos mock planos en [src/demo/data/](../src/demo/data/).

### Los tres hallazgos que definen el trabajo

**A. La navegación es decorativa.** En [DashSidebar.jsx:132-137](../src/demo/components/DashSidebar.jsx#L132-L137)
cada ítem del menú es un `<button onClick={onClose}>` sin destino, y el estado activo está
hardcodeado (`item.id === 'resumen'`). Cada dashboard es **una sola página de scroll**.
El brief pide 11 secciones navegables → **no hay dónde colgarlas**. Esto es el bloqueante estructural nº 1.

**B. No existe la entidad "Acción".** Los mocks en `data/*.js` son datos de presentación
(números para las cards), no un modelo. Los módulos 2 (Mis Acciones), 3 (Data Room),
5 (Timeline) y 10 (Auditoría) son **cuatro vistas distintas del mismo objeto**:

```
Acción → evidencia → consumo → baseline → resultado → SES → MRV → hash → CID → blockchain → reportes
```

Definir ese modelo una vez es el desbloqueo de 4 de los 11 módulos. Es la primera tarea real.

**C. Los charts son SVG a mano.** `ChartLine` (161 LOC) y `ChartDonut` (61 LOC) son custom, sin
librería. El módulo 4 pide **13 categorías con indicadores y gráficos propios** — a mano no escala.
Recomendación: mantener el look actual pero extraer una capa de primitivas de chart antes de
multiplicar por 13. (Ver decisión D3.)

---

## 2. Los 11 módulos contra el código existente

Leyenda: 🟢 existe y sirve · 🟡 existe parcial/maqueta · 🔴 no existe

| # | Módulo del brief | Estado | Qué hay hoy / qué falta |
|---|---|---|---|
| 1 | **Home** (SES, ranking, impacto acumulado, acciones verificadas, gráficos) | 🟢 | Es lo que ya elogió. Se mantiene casi tal cual; sólo se le agrega la navegación real hacia el resto. |
| 2 | **Mis Acciones** → ficha completa con drill-down de 10 pasos | 🟡 | Hay listado de "Acciones Verificadas" en los 3 dashboards. Falta: ruta de detalle + el modelo de la Acción (hallazgo B). Es el corazón del release. |
| 3 | **Data Room** ("Google Drive de cada acción") | 🟡 | Ya existe la **etiqueta** en el nav de institución (`id: 'dataroom'`, [DashSidebar.jsx:48](../src/demo/components/DashSidebar.jsx#L48)) sin ninguna implementación detrás. Falta todo: file browser, previews (PDF/img/video), hashes, JSON, versiones. Es el módulo más caro. |
| 4 | **Impact Dashboard** — 13 categorías | 🟡 | Existe "Dashboard de Impacto" como sección de scroll. Falta: taxonomía de las 13 categorías + indicadores por categoría + capa de charts (hallazgo C). |
| 5 | **Timeline** de cada acción | 🔴 | Vista nueva, pero **es el mismo modelo del módulo 2** renderizado como línea de tiempo. Barato si B está hecho. |
| 6 | **Environmental Identity** (nivel, SES, badges, credibilidad, evolución) | 🟡 | Hay "Badges" y "Perfil" sueltos. Falta unificarlos en un perfil de nodo con historial y credibilidad. |
| 7 | **Integraciones** — 18 conectores, "tienda de conectores" | 🔴 | No existe nada. Como UI (grid de cards + estados conectado/disponible) es rápido y muy vistoso; como funcionalidad real es un proyecto aparte. **Definir alcance** (ver D2). |
| 8 | **Instituciones** (áreas, sedes, responsables, KPIs) | 🟡 | `InstitucionDashboard` + [data/institutions.js](../src/demo/data/institutions.js) son la base. Falta la jerarquía organizacional (departamentos/sedes/responsables). **Prioridad alta** por el piloto escuela. |
| 9 | **Reportes** (PDF, Excel, CSV, JSON, API) | 🟡 | Hay "Reportes ESG" como sección. Falta la UI de exportación y el generador. |
| 10 | **Auditoría** (hash, blockchain, timestamp, smart contract, IPFS, firma) | 🟡 | [AuditTrail.jsx](../src/demo/components/AuditTrail.jsx) (50 LOC) es la semilla correcta. Falta expandirlo a módulo completo. |
| 11 | **Configuración** (perfil, privacidad, wallet, usuarios, permisos, notificaciones) | 🟡 | Hay "Ajustes" como ítem muerto del nav. Falta la pantalla. |

**Conteo:** 2 módulos verdes-ish, 7 amarillos, 2 rojos. Ningún módulo está terminado según el brief,
pero **ninguno arranca de cero** salvo Timeline e Integraciones.

---

## 3. Requisito transversal del audio: multi-tenant

> *"que después sea escalable para cualquier empresa, cualquier escuela, cualquier municipio"*

Hoy el tipo de cliente está **hardcodeado en tres archivos distintos** (`EMPRESA_NAV`,
`INSTITUCION_NAV`, `USUARIO_NAV` + tres componentes de dashboard). Agregar un municipio hoy = copiar
un cuarto archivo de 300 líneas.

v2.0 debería invertir eso: **un shell de dashboard + configuración por tipo de nodo**
(qué módulos ve, qué categorías aplica, qué KPIs muestra). Es más trabajo al principio y
mucho menos por cada cliente nuevo. Encaja con el "cero presión / armarlo bien" del audio.

---

## 4. Decisiones abiertas (para la meet que él ofreció)

| ID | Decisión | Opciones | Recomendación |
|---|---|---|---|
| **D1** | ¿v2.0 reemplaza los 3 dashboards con un shell único, o es un cuarto dashboard "institución v2"? | (a) Shell único configurable (b) Nuevo dashboard aparte | **(a)**. Es lo que pide el audio explícitamente. (b) es más rápido para el piloto pero deja 4 archivos divergentes. |
| **D2** | Integraciones: ¿vitrina o funcional? | (a) UI de "tienda" con estados, sin backend (b) 2-3 conectores reales (Drive, Gmail) | **(a) para v2.0**, con 1 conector real (Google Drive) como prueba de concepto. 18 integraciones reales no entran en 3 meses. |
| **D3** | Charts de las 13 categorías | (a) Extraer primitivas sobre los SVG actuales (b) Meter Recharts (c) Seguir a mano | **(a)**. Preserva el look exacto que elogió (restricción del audio) sin 13× duplicación. (b) rompe la identidad visual. |
| **D4** | Data Room: ¿archivos reales o mock? | (a) Mock con assets de ejemplo (b) Storage + IPFS real | **(a) para v2.0**. Es el diferencial que quiere mostrar; la demo navegable vende igual y (b) depende de infra que no está definida. |
| **D5** | ¿Sigue siendo `/demo` o pasa a producto? | — | Preguntar. Si es producto real para la escuela, aparecen auth, usuarios y permisos (módulo 11) como bloqueantes, no como pantalla. |
| **D6** | "Mantenimiento Sostenible" del piloto no está en las 13 del brief | (a) 14ª categoría (b) Absorber en Compras Sostenibles | Preguntar — surgió al modelar (F0.1-F0.4). El propio `institutions.js` lo marca como *"alcance pendiente de reunión con la escuela"*, así que la respuesta probablemente no exista todavía. |
| **D7** | Los KPIs por área/sede que pide el módulo 8 no se pueden calcular: hay un solo medidor para todo el edificio | (a) Submedición por sector (hardware, costo real) (b) Regla de prorrateo acordada (superficie / matrícula / horas de uso) (c) Dejar los KPIs sólo a nivel de nodo | Surgió al construir la Fase 4 (F4.1). **Es una decisión de la escuela, no técnica.** Sin esto, el módulo Instituciones muestra estructura y responsables pero no puede desagregar consumo. |

---

## 5. Plan de trabajo por fases

Ordenado por dependencia, no por el número del brief. Las fases 0-1 desbloquean todo lo demás.

### Fase 0 — Cimientos (sin UI nueva visible) ✅ HECHA

1. ✅ **Modelo de la Acción** con los 10 pasos → [src/demo/data/actions.js](../src/demo/data/actions.js)
2. ✅ **Taxonomía de las 13 categorías** → [src/demo/data/categories.js](../src/demo/data/categories.js)
3. ✅ **Config por tipo de nodo** → [src/demo/data/nodeTypes.js](../src/demo/data/nodeTypes.js)

Validado con 26 checks automáticos (13 categorías con colores únicos, 8 acciones,
10 pasos de trazabilidad, 6 hitos de timeline, 11 módulos, rutas, referencias cruzadas).

**Lo que apareció al modelar — 4 hallazgos nuevos:**

**F0.1 · Las acciones del piloto son datos reales, no mock.** Las 8 facturas EDESUR de
Montessori se pudieron reconstruir completas desde `institutions.js` (consumo, baseline y
delta por período). La reconciliación cierra con drift máximo de **0.14 pp** contra los
porcentajes declarados, y el ahorro acumulado da **26.0 días promedio** por período para
llegar a los 211.2 kWh declarados. Cada valor está marcado con su procedencia
(`source` / `derived` / `inferred` / `null`) para poder reemplazarlo por el JSON real sin adivinar.

**F0.2 · Faltan datos reales que no hay que inventar.** El SES de las acciones del 18 Dic y
20 Ene quedó en `null`, y `periodDays` en `null` para las 8 (sin días no se convierte kWh/día
a kWh totales). Los `ses_score.json` / `baseline_report.json` **no están versionados** —
conviene subirlos a `drive-files/` para regenerar esto de forma exacta.

**F0.3 · El piloto real no tiene anclaje en blockchain.** IPFS, transacción y red están
"Pendiente de anclaje"; sólo la acción del 22 Jun tiene hash calculado. **No es un hueco del
mock: es el estado real.** Timeline, Data Room y Auditoría tienen que renderizar `pending`
como estado de primera clase — es la diferencia entre un producto honesto y una demo que
miente sobre trazabilidad.

**F0.4 · Discrepancia de taxonomía.** El piloto declara *"Mantenimiento Sostenible"*, que **no
está entre las 13 categorías del brief**; y el brief suma 5 que el piloto no contempla
(Limpiezas, Textil, RAEE, Movilidad, Educación Ambiental). Queda registrado en
`PENDING_CATEGORY_SCOPE` sin inventar taxonomía. → **Decisión D6 para la meet.**

**Además, dos definiciones estructurales que cambian la UI:**

- **`measurement: 'reduction' | 'contribution'`** — las 13 categorías no se miden igual.
  Energía/Agua/Gas/Movilidad se miden contra baseline (delta %, puede ser negativo para el SES);
  las otras 9 son cantidad absoluta (nunca negativa, sin baseline). Un mismo componente de
  gráfico para ambas es el error a evitar.
- **`hierarchy` por tipo de nodo** — una escuela tiene Sede/Nivel/Curso, un municipio
  Secretaría/Dirección/Barrio. Mismo árbol, distinta nomenclatura. Es lo que hace que el
  módulo 8 sirva para los 5 tipos sin duplicar código.

### Fase 1 — Navegación real ✅ HECHA

Shell único + rutas anidadas + sidebar navegable. Verificado con 17 checks de ruteo
(43 links de sidebar en 4 nodos) y `npm run build` en verde.

**Nuevos:** [DashShell.jsx](../src/demo/components/DashShell.jsx) · [useNode.js](../src/demo/components/useNode.js) ·
[nodes.js](../src/demo/data/nodes.js) · [modules/](../src/demo/modules/)
**Modificados:** [DashSidebar.jsx](../src/demo/components/DashSidebar.jsx) · [App.jsx](../src/App.jsx) · [demo.css](../src/demo/demo.css)
**Eliminados:** `EmpresaDashboard.jsx`, `InstitucionDashboard.jsx`, `UsuarioFinal.jsx`
→ sus cuerpos viven ahora en `modules/Home*.jsx`, sin cambios de diseño.

**F1.1 · Bug corregido: hooks condicionales.** Los tres dashboards llamaban `useState()`
**después** de un `return <Navigate/>`. React lanza *"Rendered fewer hooks than expected"*
al pasar de un slug válido a uno inválido. En el shell todos los hooks corren antes de
cualquier return.

**F1.2 · El alias `/demo/institucion/` sigue vivo.** Montessori es un nodo de tipo `escuela`,
pero su URL histórica no se rompe — y al navegar por el sidebar la URL **conserva el alias**
en vez de saltar a `/demo/escuela/`. Sin esto, cualquier link ya compartido cambiaría de
dirección al primer click.

**F1.3 · Los 10 módulos sin construir no son botones muertos.** Cada uno aterriza en un
andamio que declara qué va a contener, en qué fase, y muestra **contadores reales del modelo
de datos** (8 acciones, 13 categorías, 7 documentos por acción, 0 ancladas en cadena). La demo
comunica alcance sin inventar pantallas.

**F1.4 · Íconos unificados.** El sidebar mezclaba emojis (`🗂`, `★`) con geométricos (`⊞`, `◈`).
Ahora los 11 módulos usan un set geométrico consistente.

---

### Fase 1 — detalle original
4. Convertir `DashSidebar` en navegación con rutas (`NavLink` + estado activo real) — arregla el hallazgo A.
5. Rutas anidadas: `/demo/:tipo/:slug/:modulo` sobre un layout compartido, con las 11 secciones como `<Outlet>`.
6. Extraer el shell (header, sidebar, contenedor) fuera de los 3 dashboards.

> Al terminar la fase 1 ya hay algo demostrable: el dashboard que le gusta, ahora navegable.

### Fase 2 — El núcleo de trazabilidad ✅ HECHA

Verificado con 29 checks automáticos + capturas headless en desktop y mobile.

**Nuevos:** [MisAcciones.jsx](../src/demo/modules/MisAcciones.jsx) ·
[ActionDetail.jsx](../src/demo/modules/ActionDetail.jsx) ·
[Timeline.jsx](../src/demo/modules/Timeline.jsx) ·
[Auditoria.jsx](../src/demo/modules/Auditoria.jsx) ·
[DataTable.jsx](../src/demo/components/DataTable.jsx) ·
[StatusChip.jsx](../src/demo/components/StatusChip.jsx) · `stepStyle.js`

**F2.1 · Una fuente, tres vistas.** Mis Acciones, Timeline y Auditoría no tienen datos
propios: derivan de `data/actions.js` vía `buildTraceability()` y `buildTimeline()`. Hay un
test que verifica que el hash mostrado en Timeline y en la ficha es literalmente el mismo
valor — si alguien duplicara la fuente, falla.

**F2.2 · El componente de tabla que faltaba.** `DataTable` sobre los estilos `.dash-table`
existentes. Ya lo usan Mis Acciones y Auditoría; lo van a usar Data Room y Reportes.

**F2.3 · Los estados pendientes son de primera clase.** La ficha muestra "8 de 10 pasos";
Auditoría, "1/8 con hash · 0/8 ancladas". Ningún hash inventado, fijado por test:
*sin hash ⇒ estado pendiente*.

**F2.4 · Nota de procedencia en la ficha.** Cada acción declara qué valores vienen del
pipeline, cuáles se reconstruyeron y cuáles no están cargados.

**F2.5 · Bug de layout mobile, corregido.** Un hash de 64 caracteres no entra en 390 px:
desbordaba la tarjeta y empujaba el chip de estado fuera de pantalla. En mobile el paso se
apila y el hash corta en dos líneas — truncarlo con ellipsis anulaba el sentido de mostrarlo.

---

### Fase 2 — detalle original
7. **Mis Acciones**: listado + ficha de detalle con el drill-down de 10 pasos (módulo 2).
8. **Timeline** como vista alternativa de la misma acción (módulo 5).
9. **Auditoría** expandiendo `AuditTrail` (módulo 10).

### Fase 3 — Data Room ✅ HECHA

**Nuevos:** [dataRoom.js](../src/demo/data/dataRoom.js) ·
[useSha256.js](../src/demo/components/useSha256.js) ·
[DataRoom.jsx](../src/demo/modules/DataRoom.jsx)

**F3.1 · La verificación de integridad es real, no simulada.** El piloto no tiene hashes por
archivo — sólo uno a nivel de acción, y sólo para la del 22 Jun. Inventar 64 caracteres por
archivo habría sido lo peor posible en un producto que vende integridad verificable.

La salida: los **artefactos JSON se generan desde los datos reales de la acción**
(`consumption_data.json` lleva el consumo real, `baseline_report.json` la línea base real,
`ses_score.json` el SES real). Como el contenido es real y determinístico, el SHA-256 que el
navegador calcula con Web Crypto sobre ese contenido es **un hash auténtico de un archivo
auténtico**. Hay un test que lo prueba: recalcula el hash en Node de forma independiente y
verifica que coincide con `8b05a9c1…a30185`.

**F3.2 · Los PDFs se declaran como lo que son.** Factura y reportes no tienen contenido en el
repo: van con `content: null`, sin tamaño ni hash inventados, y la vista previa dice que no
está disponible.

**F3.3 · Bug de layout mobile, corregido.** En la fila de anclaje el par etiqueta+chip se
partía entre líneas y dejaba el estado huérfano de su nombre. Ahora envuelven juntos.

---

### Fase 3 — detalle original
10. File browser por acción, previews por tipo, hashes/CID visibles, historial de versiones (módulo 3).

### Fase 4 — Piloto escuela ✅ HECHA

**Nuevos:** [organization.js](../src/demo/data/organization.js) ·
[Instituciones.jsx](../src/demo/modules/Instituciones.jsx) ·
[Reportes.jsx](../src/demo/modules/Reportes.jsx)

**F4.1 · Hallazgo importante: los KPIs por unidad no se pueden calcular hoy.**
El brief pide indicadores por área, sede y departamento. Pero el piloto mide con **la factura
de la distribuidora, que es una sola para todo el edificio**. No hay medición por nivel ni por
curso. Cargar la estructura organizativa no alcanza: por más que tengamos el árbol, no hay
dato para desagregar.

Para tenerlo hacen falta dos cosas, y **ninguna es técnica**: submedición (un medidor por
sector) o una regla de prorrateo acordada con la escuela — por superficie, por matrícula o por
horas de uso. Es una decisión de la institución.

El módulo lo hace visible en lugar de taparlo: cada unidad declara `metered`, y el KPI del
nodo muestra **1 de 9 unidades con medición propia**. Las otras 8 dicen "sin medidor" en vez
de mostrar un número estimado. → **Nueva pregunta para la meet (D7).**

**F4.2 · La estructura es de ejemplo y está marcada como tal.** La organización real de
Montessori no está en ninguna fuente. Hay un chip "Datos de ejemplo" en la vista, un flag
`isExample` en los datos y un test que verifica que siga marcado.

**F4.3 · La nomenclatura sale del tipo de nodo.** La tabla titula "Sede / Nivel / Curso" para
una escuela y titularía "Secretaría / Dirección / Barrio" para un municipio, sin duplicar
código. Test incluido.

**F4.4 · Reportes: CSV y JSON funcionan de verdad.** Se arman con los datos reales del nodo y
se descargan desde el navegador — son formatos de texto, no hace falta backend. PDF y Excel
requieren una librería de render que no está en el proyecto, así que **se declaran como no
disponibles en lugar de ofrecer un botón que no hace nada**.

---

### Fase 4 — detalle original
11. **Instituciones**: jerarquía áreas / sedes / responsables + KPIs institucionales (módulo 8).
12. **Reportes**: UI de exportación en los 5 formatos (módulo 9).

### Fase 5 — Impacto y perfil ✅ HECHA

**Nuevos:** [impact.js](../src/demo/data/impact.js) ·
[Sparkline.jsx](../src/demo/components/Sparkline.jsx) ·
[Impacto.jsx](../src/demo/modules/Impacto.jsx) ·
[Identity.jsx](../src/demo/modules/Identity.jsx)

**F5.1 · El Impact Dashboard muestra la cobertura, no 13 números inventados.**
De las 13 categorías del brief, el piloto tiene **una sola con datos reales**: Energía. Agua y
Gas están en carga, 5 declaradas sin arrancar y 5 fuera del alcance del piloto. El módulo cruza
las 13 con su estado real y explica qué falta en cada una. Para el cliente eso no es una
debilidad: es el mapa de lo que queda por incorporar, que es su conversación con la escuela.

**F5.2 · Primitiva de gráfico en vez de librería (D3).** `Sparkline` normaliza valores y dibuja
en el mismo lenguaje visual que `ChartLine`, sin dependencias. Resuelve las 13 series sin
romper el look que el cliente pidió no tocar. Contempla el rango cero (todos los valores
iguales) centrando la línea en lugar de dividir por cero.

**F5.3 · Hallazgo: el puntaje SES declarado no cierra con la suma de las acciones.**
El nodo declara **20**. Las 6 acciones con SES cargado suman **+50**. La diferencia es
**−30**, y hay exactamente 2 acciones sin dato (18 Dic y 20 Ene).

Eso es una **restricción verificable**: si el puntaje es la suma histórica, esas dos acciones
tienen que sumar −30 entre ambas. Al cargar los `ses_score.json` reales debería cumplirse; si
no se cumple, el puntaje no es una suma histórica sino un score por período y hay que confirmar
la regla de agregación. El módulo de Identidad lo muestra explícitamente en vez de esconder la
diferencia.

---

### Fase 5 — detalle original
13. **Impact Dashboard** con las 13 categorías sobre la capa de charts (módulo 4).
14. **Environmental Identity** (módulo 6).

### Fase 6 — Cierre ✅ HECHA

**Nuevos:** [integrations.js](../src/demo/data/integrations.js) ·
[Integraciones.jsx](../src/demo/modules/Integraciones.jsx) ·
[Configuracion.jsx](../src/demo/modules/Configuracion.jsx)
**Eliminado:** `ModulePlaceholder.jsx` — con los 11 módulos construidos quedó sin uso.

**F6.1 · El catálogo de integraciones dice la verdad sobre las 18.** De los 18 ítems del brief:
**1** prueba de concepto (Google Drive, según D2), **12** previstas y viables, **3** categorías
abiertas (APIs, ERP, Sensores IoT) que no son integraciones puntuales, y **2 no viables** —
Apple Photos (no hay API de servidor para terceros) y medidores de la distribuidora (no publican
API de consumo; es la razón por la que hoy se trabaja con PDFs). Cada bloqueada explica su
motivo en pantalla.

**F6.2 · Configuración: los roles son vista previa, y se dice.** La demo no tiene autenticación,
así que no hay sesión ni permisos que aplicar. Lo que sí es real es la estructura: los 4 roles
se definen como **subconjuntos del mismo registro de módulos** que ya usa el sidebar. El día que
se agregue login, el filtrado por rol se apoya en esa estructura en lugar de rehacerla.

---

### Fase 6 — detalle original
15. **Integraciones** como tienda de conectores (módulo 7).
16. **Configuración** (módulo 11).
17. Pulido: animaciones suaves, espacio en blanco, pasada de a11y.

---

## 6. Sobre la dirección de diseño

El brief pide evolucionar hacia Stripe / Linear / Notion / GitHub / Vercel / Figma. Traducido a
decisiones concretas sobre lo que ya existe:

- **Densidad:** los dashboards actuales son de tarjetas grandes. Stripe/Linear son más densos en
  información con más aire alrededor. Bajar tamaño de tipografía de datos, subir el espaciado.
- **Navegación:** sidebar persistente con jerarquía real (ya está el markup, falta el comportamiento)
  + breadcrumbs para el drill-down de acciones. Sin breadcrumbs, la ficha de 10 pasos marea.
- **Tablas:** ninguno de los 11 módulos se resuelve con cards; Data Room, Auditoría, Mis Acciones y
  Reportes necesitan un componente de tabla que hoy no existe. Es el componente nuevo más reutilizado.
- **Animaciones "suaves":** framer-motion ya está instalado. Transiciones de ruta y de expansión,
  nada de entradas llamativas.
- **"No parezca una app de reciclaje":** cuidado con los emojis-íconos actuales (`🗂`, `★`) mezclados
  con los geométricos (`⊞`, `◈`). Unificar en un set único de íconos línea.
