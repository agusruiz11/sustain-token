# Transcripción · Audios de Martín — 28 ago 2026, 15:37 y 15:38

**Fuente:** `docs/WhatsApp Audio 2026-08-28 at 15.37.47.ogg` (76 s) y
`docs/WhatsApp Audio 2026-08-28 at 15.38.56.ogg` (27 s), reenviados por Santi.
**Método:** transcripción automática (Whisper large-v3). Sin editar contenido; sólo puntuación.

---

## Audio 1 — 15:37 (76 s)

> Hola Santi, ¿cómo estás? ¿Todo bien? Bueno, ¿sabés qué? Necesito puntualmente lo siguiente:
> si en mis facturas de luz me pueden actualizar el dashboard y dejar la dirección de IPFS y la
> dirección del anclaje on-chain.
>
> Le explico: hoy tengo un evento en el Parque de Innovación, donde desemboca acá Superteam
> Argentina, que está vinculado a Solana. Y nada, me van a presentar directamente al lead de
> esta movida.
>
> Entonces quiero tener en el celu el end to end: la factura, ir navegando, y cuando toque IPFS
> que me abra IPFS con la factura, y que me abra el anclaje on-chain en BscScan, aunque sea en
> una. Así se lo muestro todo en el celu, ¿viste? Porque ahí puedo conseguir fondeo.
>
> El evento es a las seis y media de la tarde.

## Audio 2 — 15:38 (27 s)

> Aunque sea una, no te digo todas las facturas de luz, pero con que una toquen el celu y me
> abra IPFS y me abra BscScan, ya con eso le puedo mostrar todo, ¿viste? Le puedo mostrar el
> circuito completo y tenemos más chance. Gracias.

---

## Puntos con baja confianza

- **"BCC" / "VSScan"** (audio 1, 00:58 y audio 2): fonéticamente confuso, pero por contexto es
  **BscScan** — es el explorador de BNB Smart Chain, la red que declara el paquete
  (`chain_id: 56`). Transcripto como BscScan.
- **"Gracias, Antu"** al inicio del audio 2: el nombre no se entiende. Puede ser un arrastre del
  audio anterior. No cambia el pedido.

---

## Qué pide, en una línea

Que **al menos una** de sus facturas de luz tenga, en el dashboard y desde el celular, el paso
de IPFS abriendo el archivo en el gateway y el paso de blockchain abriendo la transacción en
BscScan. Para mostrar el circuito completo esta noche a las 18:30 en el launch party de
Superteam Argentina (ecosistema Solana), donde lo presentan al lead. Motivo declarado:
*"ahí puedo conseguir fondeo"*.

## Qué falta para poder hacerlo

**El CID y el hash de transacción.** No los tenemos. `drive-files/` no recibió nada nuevo desde
el 14 de agosto, y los 8 DASHBOARD_SYNC de energía que Martín describió el 24 de agosto —con
`registry_proof.ipfs.cid` en `stored` y `registry_proof.blockchain.transaction_hash`— nunca
llegaron.

Alcanza con **una** acción: un CID y un hash.

## Qué se dejó preparado (28 ago, 17:15)

El código quedó listo para que esos dos strings enciendan los enlaces sin tocar nada más:

- `src/demo/data/anchorLinks.js` — construye la URL del gateway de IPFS y la del explorador
  según `chain_id`. No inventa identificadores: sin dato no hay enlace.
- `src/demo/data/actions.js` → **`ENERGY_ANCHORS`** — el lugar donde se pegan `cid` y `tx`. Está
  vacío, con el formato exacto documentado arriba de la constante.
- Ficha de acción, Auditoría y Timeline renderizan los dos enlaces en cuanto hay dato, con área
  táctil de 44 px porque el recorrido se muestra desde el celular.
- Estado intermedio implementado: con `tx` presente y `blockNumber`/`timestamp` en null, el paso
  dice **"TX registrada · confirmación no incorporada al Sync"**, no "Pendiente de anclaje" —
  tal como Martín pidió el 24 de agosto.

Probado end-to-end con un CID y un hash simulados: los enlaces aparecen en las tres pantallas y
el estado intermedio se muestra. El dato de prueba se borró; `ENERGY_ANCHORS` quedó vacío.

Verificación sobre el estado final: smoke 40/40, verify:canonical todas OK, verify:attribution
80/80, lint limpio en los archivos tocados, build OK.

---

## Hallazgo aparte — revisar antes del evento

La landing pública (`src/components/Community.jsx`, Node #0001 Genesis) tiene dos enlaces
**en vivo**, con un comentario en el código que los declara reales:

- IPFS: `bafybeihgrkfajvqslygn25igpppcc5yubz3y5gpcvb7kgay2sxrrz56iey` → ipfs.io
- TxHash: `0x4e35e7b872c36cc2744e6311564c60d338056df0d19612eb7b0a00b2a9e1a3ef` → bscscan.com
- Tooltip: "Beach Cleanup · Mar del Plata · 2026-02-04"

### ✅ VERIFICADOS — los dos son reales (28 ago 2026, 17:21)

Santi los abrió a mano desde el celular. Resultado:

**IPFS** — el CID resuelve. Es un **directorio** (CIDv1, dag-pb, sha2-256), **58,8 MB**, con la
estructura de un paquete de acción de Sustain:

```
.DS_Store
README.md
action_report.json
evidence/            (directorio, bafybeict37eahj…)
manifest.json
```

**BscScan** — la transacción existe y es exitosa:

| Campo | Valor |
|---|---|
| Status | **Success** |
| Bloque | 79.639.130 |
| Acción | Call **`Anchor Action`** Function |
| From | `0xB4E8004E…91935b758` |
| Contrato | `0x141cc963…ba8D25e1B` |
| Logs | 1 |

**Los tres datos cruzan con nuestros registros:**

- `0xB4E8004E…91935b758` es la **wallet founder de Martín** — `sustainNodes.js` línea 57:
  `0xB4E8004E4047838c9fd8d4e2a0ba12791935b758`.
- `0x141cc963…ba8D25e1B` es **el mismo contrato** que declara el `dashboard_sync` de Movilidad:
  `0x141cc96351d622fcf26fAA40E0fd2a1ba8D25e1B`.
- El método `Anchor Action` es el `anchor_method: "anchorAction(string,string)"` del propio
  paquete.

### Qué corrige esto

**El mecanismo de anclaje de Sustain es real y está operativo en BNB Smart Chain.** La acción
Genesis del Node #0001 tiene paquete en IPFS y transacción on-chain desde la wallet del founder
al contrato del registro.

Lo que sigue siendo cierto, y hay que decirlo con precisión para no repetir el error en la otra
dirección:

- Las **8 acciones de energía** siguen sin CID ni tx **de nuestro lado**: los DASHBOARD_SYNC
  nunca llegaron a `drive-files/`.
- Los **5 viajes de movilidad** siguen en `pending` y su propio sync se declara
  `DEMO ONLY … have not been supplied here with real IPFS CIDs or blockchain transaction hashes`.

O sea: el anclaje existe como capacidad probada, pero **no para las acciones del piloto que
tenemos cargadas**. La afirmación correcta no es "no hay anclajes", es "no recibimos las pruebas
de anclaje de estas acciones".

### Para el evento de esta noche

Martín **ya puede mostrar el circuito completo** con el Genesis desde la landing, sin que
toquemos código. Lo que pidió —el anclaje en sus facturas de luz— sigue bloqueado por los mismos
archivos, pero para el pitch no hace falta.

**Pendiente de chequeo:** el timestamp de la transacción en BscScan contra el tooltip de la
landing, que dice "Beach Cleanup · Mar del Plata · 2026-02-04". Conviene que las fechas cierren
antes de mostrárselo a alguien del ecosistema.

### Nota lateral

`OnChain_Documentation_ES.docx` documenta un contrato **distinto** —
`0x837C9dFA3342139bc5892c77fc5EadA4D9522CE8`, "Sustain Doc Hub", para hashes del whitepaper y
documentos de gobernanza. No es un problema: son dos contratos con funciones distintas. Vale
tenerlo claro para no confundirlos al documentar.
