# El Data Room del protocolo en Drive — lo que hay adentro

**28 ago 2026.** Santi pasó el link de la raíz. Sí, tenemos acceso y se puede leer entero.

`https://drive.google.com/drive/folders/1qm_S2aktXFbHWS9Q5iTkg3vG8c_kV3_Y`

---

## Primero: el acceso nunca estuvo mal

> Martín, audio del 28/08 17:39: *"me llama mucho la atención que adentro de la carpeta de cada
> factura no puedan ver el sync… encima yo entro al archivo y me figura que lo tienen compartido
> ustedes."*

Tiene razón y el permiso está bien: `agencia.posicionarte@gmail.com` figura como **Editor**.
Nunca fue un problema de compartir.

Lo que pasó es otra cosa: los archivos estaban en **Drive**, y nuestra carpeta local
`drive-files/` del repo —que es donde miraba nuestro tooling— nunca los recibió. Dos lugares
distintos. Cuando decíamos "no nos llegaron los sync" era cierto sobre el repo y falso sobre
Drive. Es un error nuestro: había que ir a buscarlos.

**Ya están los 9 del nodo de Martín bajados y cargados** (ver `docs/anclajes-energia-2026-08-28.md`).

---

## Estructura de la carpeta

```
00_README/     README · Data Structure · Storage Workflow ·
               Dashboard Sync Specification · Agency Integration Manual v1.0
01_USERS/      un subdirectorio por nodo
02_PUBLIC/
03_EXPORTS/
04_INDEX/      nodes_registry.json · latest_sync.json
```

En `00_README` hay cinco documentos del protocolo que nunca vimos, entre ellos el
**Dashboard Sync Specification** y el **Agency Integration Manual v1.0**. Valen una lectura: son
la especificación del formato con el que venimos trabajando por inferencia.

---

## 🔴 Hallazgo: el piloto tiene TRES nodos personales, no uno

`01_USERS/` contiene:

| Carpeta | Nodo | Módulo | Acciones | SES |
|---|---|---|---|---|
| `spn_01ee6583da858ca1fa19323d - Martin` | Martín Ceron | energía + plástico + movilidad | 14 | 35 |
| `spn_2ed35ab1802ad4683462f095 - Mabel` | Mabel R. | **gas** | 8 | 54 |
| `spn_c42f6f221ce1482528355c09 - Daniel` | Marinoni, Daniel Horacio | **agua** (AYSA) | 6 | 0 |

Los dos nodos nuevos **están anclados igual que el de Martín**: CID de IPFS con `status: stored`,
transacción en BNB Smart Chain contra el mismo contrato `0x141cc963…`, y el mismo
`proof_validation_status: PARTIAL`.

- **Gas / Mabel** — 8 facturas, 238.77 m³ verificados sobre 244 días de facturación,
  baseline 0.978566 m³/día, badges `verified_evidence`, `smart_historical_active`,
  `high_confidence_baseline`. Nivel de identidad "High-confidence historical baseline".
- **Agua / Daniel** — 6 períodos de AYSA, 9 m³ por período, 0.3 m³/día constante contra un
  baseline de 0.3, reducción 0 % en todos. `verification_depth: MEDIUM`. Schema 2.0 (los otros
  son 1.0).

**Esto explica por qué el nodo de Martín declara `gas: 0` y `water: 0`**: esas acciones no son
suyas. Nuestro conteo de 14 sigue siendo correcto para su nodo.

### Por qué importa

1. **No las incorporamos.** Martín pidió el 25 de agosto no ampliar alcance hasta cerrar la V1, y
   además mezclarlas con el nodo de Martín sería repetir exactamente el error de atribución que
   corregimos en Fase 0. Quedan documentadas, no cargadas.
2. **El producto ya no es "un nodo y una escuela".** Son tres nodos personales con 28 acciones
   ancladas entre los tres. Eso cambia lo que se puede mostrar y lo que hay que construir.
3. **Privacidad.** Los dos nodos nuevos son personas reales con su consumo domiciliario. El sync
   de agua trae `contains_pii: true` y
   `display_name_allowed_in_public_view: false`. Si alguna vez se incorporan, sus nombres no
   pueden aparecer en la vista pública — sólo en dashboard autenticado.

---

## 🔴 Hallazgo: el registro maestro está vacío

`04_INDEX/nodes_registry.json` se describe a sí mismo como *"Master registry of all Sustain
platform nodes"* pero está sin llenar:

```json
{ "total_nodes": 0, "nodes": [] }
```

Y `04_INDEX/latest_sync.json` está entero en null con `"status": "pending"`.

O sea: el índice que debería listar los tres nodos existe como andamiaje y nadie lo pobló. Los
datos están en `01_USERS`, pero nada los indexa. Vale avisárselo a Martín: si el registro es lo
que va a consumir la plataforma, hoy devolvería cero nodos.

---

## Qué hacer con esto

**Ahora:** nada en el código. La V1 se cierra con el nodo de Martín y Montessori, como pidió.

**Para preguntarle a Martín:**

1. Los nodos de gas y agua, ¿entran en el alcance del dashboard o son de otro piloto?
2. `04_INDEX/nodes_registry.json` está vacío. ¿Lo llena el pipeline o quedó pendiente?
3. ¿Podemos usar el `Agency Integration Manual v1.0` como especificación de referencia? Veníamos
   infiriendo el formato de los propios archivos.

**Para nosotros:** bajar la carpeta a `drive-files/` para tener los JSON versionados en el repo.
Y de ahora en más, antes de pedirle un archivo a Martín, buscarlo primero en Drive.
