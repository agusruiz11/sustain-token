# Anclajes del nodo de Martín — procedencia y valores

**28 ago 2026.** Los 9 DASHBOARD_SYNC con paquete llegaron por el Drive que Martín compartió con
`agencia.posicionarte@gmail.com`. Este documento existe para que cualquiera pueda volver al
archivo original y verificar cada valor cargado en el código.

> Martín, audio del 25/08 12:05: *"capaz que el dashboard sync de cada carpeta no está
> compartido, pero sí: como yo compartí la carpeta general, todo lo que está dentro de esa
> carpeta y su subcarpeta ya está compartido automáticamente."*

Verificación cruzada: el archivo del 22-jun que mandó por WhatsApp coincide con el que se bajó
del Drive. Misma fuente.

---

## Los 9 paquetes

| # | Fecha | Acción (plataforma) | Drive file ID |
|---|---|---|---|
| 1 | 2025-11-14 | `spa_211f1b27ff7d007baa0247b7` | `1Sz4LPrBofqr86s4vvq3U4wMsx8euwM1M` |
| 2 | 2025-12-18 | `spa_9ad673fc37f2b922acb05cb9` | `1tcLtIMW06AJ7-tGzstcpGViRUpKX6YrY` |
| 3 | 2026-01-20 | `spa_b6870fd910f62c082033098d` | `1UMCmZBfAcqgzOHU703UyRMwSNgslQlJD` |
| 4 | 2026-02-20 | `spa_8f2f331331f1c26535f54f6d` | `1V2eyhh-TRvK_DfTin0wEbLXsmOtSn2E2` |
| 5 | 2026-03-19 | `spa_8b9bcd5cd034356756aefbe9` | `1bjQ-bu1fCFlpq6G8K7U5W44U9mioxbbb` |
| 6 | 2026-04-21 | `spa_1d4967a1d22647ba47723787` | `1ClBRVODZLJ4bu5_HV8P8bTeVKYJKGqJi` |
| 7 | 2026-05-19 | `spa_84a2866eb4142b954e00c890` | `1YnBAeI01Xj3aA-KmaADpByIBV7DjEoFK` |
| 8 | 2026-06-22 | `spa_c29d7a929bb619785137bcda` | `1wodwj9ar_VSW1bjQPzVc2eWt2Fqrffhq` |
| 9 | 2026-07-25 | `spa_4e06c6fde698bad1dc6c99be` (Botella de Amor) | `1EOGgotRYJFuN_QRIud0qMWTJT46Xxn0k` |

**Pendiente operativo:** conviene bajar la carpeta del Drive a `drive-files/` para tener los JSON
versionados en el repo. Hoy los valores están en el código con su procedencia declarada, pero
los archivos crudos siguen viviendo sólo en Drive.

---

## Valores cargados (todos literales del paquete)

| # | kWh | Días | kWh/día | Baseline/día | Estrategia baseline | Reducción % | SES Δ | SES tras |
|---|---|---|---|---|---|---|---|---|
| 1 | 308 | 31 | 9.935484 | 9.935484 | primera factura | 0.0 | 0 | 0 |
| 2 | 311 | 35 | 8.885714 | 9.935484 | primera factura | 10.565867 | 0 | 0 |
| 3 | 513 | 32 | 16.03125 | 11.617483 | promedio 3 primeras | −37.992455 | −30 | −30 |
| 4 | 277 | 31 | 8.935484 | 11.617483 | promedio 3 primeras | 23.085887 | +40 | 10 |
| 5 | 256 | 28 | 9.142857 | 11.617483 | promedio 3 primeras | 21.300879 | +40 | 50 |
| 6 | 313 | 32 | 9.78125 | 11.617483 | móvil 6 facturas | 15.805773 | +30 | 80 |
| 7 | 480 | 29 | 16.551724 | 10.452007 | móvil 6 facturas | −58.359289 | −30 | 50 |
| 8 | 618 | 31 | 19.935484 | 11.554713 | móvil 6 facturas | −72.531191 | −30 | 20 |
| 9 | — | — | 0.3 kg · 1 botella | — | baseline inicial | — | +3 | 23 |

`reduction_percent` positivo = redujo. En el código se guarda como `deltaPct` con el signo
invertido, que es la convención del resto del producto; la traducción se hace una sola vez.

### Lo que la reconstrucción anterior tenía mal

Antes de tener los paquetes, seis de los ocho valores se habían reconstruido desde las series
del piloto y dos quedaban sin dato. Contra la fuente:

- **18 dic 2025** — estaba como −11.6 % con SES sin cargar. Es **−10.565867 %** y **SES Δ 0**.
- **20 ene 2026** — estaba como +38.8 % con SES sin cargar. Es **+37.992455 %** y **SES Δ −30**.

Las otras seis caían dentro del margen declarado (±0.15 kWh/día). Los `periodDays` y `totalKwh`,
que figuraban como pendientes, ahora están cargados en las ocho.

---

## El SES 35 cierra

La pantalla de Identidad mostraba una reconciliación abierta porque los valores disponibles no
explicaban el 35 del `node_state`. Con los 9 paquetes la cadena cierra exacta:

```
energía    0  0  −30  +40  +40  +30  −30  −30   =  20
plástico   +3   (Botella de Amor, 25 jul)        =  23
movilidad   0  +3  +3  +3  +3                    =  35
```

Los 23 con los que arrancaba el módulo de Movilidad (`sesFrom: 23`) son exactamente el estado del
nodo después de la Botella de Amor. No había hueco: faltaba una acción y faltaba sumar los viajes
en la misma serie.

Hay una invariante por cada tramo en `npm run verify:canonical`.

---

## Anclajes

Los 9 tienen CID de IPFS con `status: stored` y hash de transacción en **BNB Smart Chain Mainnet**
(`chain_id: 56`) contra el contrato `0x141cc96351d622fcf26fAA40E0fd2a1ba8D25e1B`.

| # | CID | Transacción |
|---|---|---|
| 1 | `bafybeiaajpctnhl2fhdw53gbfzwzqs4ntn7rbwoeusdiewd3gkfqwnsubm` | `0xeca4bf3f…fd1932a7` |
| 2 | `bafybeieku4utxhpk73xou5m57eqrmcltdddfyvt4qsyv4tjf3smeygcyba` | `0xaea1c645…c0e6767c` |
| 3 | `bafybeigoe6bp7aasxpycmym37rxrqiomelwodmminaubu4x7tolyzdgxwy` | `0xa81c8ee9…ea103a18` |
| 4 | `bafybeifbpdi6tal3fsomlr2myvdccty5ivjjhgjluqlu4h2xfbknmrdbqi` | `0xbd51255a…d9e09da0` |
| 5 | `bafybeifurzf6bf52wggwm463av7orvahsgic6qiqxb4zapicaoocqrwzke` | `0x02741312…991dfd8a` |
| 6 | `bafybeiepxdkpt3brvdo7fak35gbef2ue2zeu5ehqjxnddlqxuekkw45xgm` | `0xe166a357…6fbd5b6a` |
| 7 | `bafybeieyrueem5cy7opaywayzjjyvc3i4fqcf2c5phjkuk4pu3u343vop4` | `0xe74d024e…d96fa580` |
| 8 | `bafybeieatgly6nzhju76dr6oiensrrfllm5q2b3noakkgo7znq36ayo2yu` | `0xdb299a5a…97038397` |
| 9 | `bafybeiac52bn4fiz3l443rkf6qeh67wpmp6sg5biyt6zbsi656mxnle5ue` | `0xe3725532…5c387e4` |

Los valores completos están en `src/demo/data/actions.js` (`ENERGY_ANCHORS` y la acción de
plástico). Hay invariantes que verifican forma, unicidad y que ninguno esté repetido.

### PARTIAL no es "sin anclar"

En los 9, `transaction_status`, `block_number` y `block_timestamp` vienen en `null`, y
`anchor_method` sólo está informado en 5 de las 8 de energía. Por eso
`proof_validation_status: PARTIAL`.

Eso no significa ausencia de prueba: la transacción existe y se abre en BscScan. El dashboard lo
muestra como **"TX registrada · confirmación no incorporada al Sync"**, distinto de "Pendiente de
anclaje", tal como pidió Martín el 24 de agosto. Esos campos los corrige él desde el
pipeline/Finalizer; nosotros no reconstruimos ninguno.

Los 5 viajes de movilidad siguen sin CID ni transacción — su propio sync se declara
`DEMO ONLY` — y así se muestran.
