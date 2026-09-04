# Análisis · Los 7 comentarios de Martín — 24 ago 2026

Mensaje de Martín del 24/08 14:57 ("barrido completo de los dashboards"). Revisado
contra los archivos que tenemos en `drive-files/` y contra el código actual.

**Resumen en una línea:** 5 de los 7 puntos los podemos hacer ya. El punto 1 —el más
importante— está bloqueado porque **los archivos que describe no están en nuestra
carpeta**. Y el punto 2 depende de lo mismo.

---

## 1 · IPFS y blockchain en las 8 acciones de energía — BLOQUEADO

Martín dice que los 8 DASHBOARD_SYNC de energía traen `registry_proof.ipfs.cid` con
`status: stored` y `registry_proof.blockchain.transaction_hash` en BNB Smart Chain
Mainnet, y que por lo tanto no corresponde mostrar "Pendiente de anclaje".

**Le creemos. El problema es que esos archivos no los tenemos.**

Lo verificamos así: el único `dashboard_sync.json` que existe en `drive-files/` es el de
Movilidad (`Sustain_Mobility_Agency_Handoff_2026-08-13/01_dashboard/`). Ese archivo:

- no contiene la clave `registry_proof` — en ninguna parte;
- no contiene `proof_validation_status`;
- no contiene `internal_identifiers.dashboard_display_allowed`;
- en cada una de las 5 acciones trae `"ipfs_cid": "pending"` y `"chain_anchor_tx": "pending"`;
- y en `storage_and_anchor.pilot_ui_simulation` dice textualmente:

  > `"warning": "DEMO ONLY — the five mobility packages have not been supplied here with real IPFS CIDs or blockchain transaction hashes."`
  > `"real_cid": null`
  > `"real_transaction_hash": null`

El `contract_address` `0x141cc96351d622fcf26fAA40E0fd2a1ba8D25e1B` que figura ahí es el
del contrato, declarado dentro del bloque de **simulación**, no un anclaje ejecutado.

**Conclusión:** no hay contradicción entre lo que dice Martín y lo que veníamos
sosteniendo. Son **dos artefactos distintos**. Nuestro "0 de 8 ancladas" se apoya en el
único sync que recibimos, que es el de Movilidad y que se declara a sí mismo como demo.
Los 8 sync de energía con CID y TX reales existen del lado de él y nunca llegaron a
`drive-files/`. Es exactamente el punto que quedó abierto en el handoff del 18 de agosto:
*"El `dashboard_sync.json` de Energía, si existe. Es la única pregunta bloqueante."*

**Lo que necesitamos para avanzar:** los 8 archivos DASHBOARD_SYNC de energía. Con eso el
resto del punto 1 es trabajo directo:

- IPFS: mostrar el CID y linkear al gateway cuando esté informado.
- Blockchain: mostrar el TX hash y linkear a BscScan (`chain_id: 56`).
- Estado intermedio nuevo: **"TX registrada · confirmación no incorporada al Sync"**,
  distinto de "Pendiente de anclaje". Aplica cuando hay `transaction_hash` pero
  `transaction_status`, `block_number` y `block_timestamp` vienen en `null`.
- `proof_validation_status: PARTIAL` deja de leerse como ausencia de prueba.
- Dejar de usar `dashboard_display_allowed:false` para ocultar acciones en el dashboard
  privado.

Nota: él aclara que los campos históricos incompletos los corrige desde el
pipeline/Finalizer. Nosotros no reconstruimos nada — solo representamos lo que venga.

---

## 2 · Acciones faltantes de Martín (Bottle Love, RECYCLING, MOBILITY, CLEANUP, COMPOST) — BLOQUEADO

Mismo motivo. En `drive-files/` no existe ninguna carpeta `RECYCLING`, `MOBILITY`,
`CLEANUP` ni `COMPOST` del nodo. Lo único que hay del nodo `spn_01ee…` es el paquete de
Movilidad con 5 viajes en bici. De **Botella de Amor no tenemos ni un archivo**.

Esto además explica el hueco que ya teníamos marcado como `MISSING_ACTION_PACKAGES`: la
acción de recuperación de plástico está declarada como faltante, sin ficha inventada.

Coincide también con el `node_state`: el nodo declara **14 acciones verificadas** en
total y nosotros solo tenemos 8 de energía + 5 de movilidad documentadas. Faltan
paquetes, no hay duda — pero no podemos incorporarlos sin los archivos.

**Lo que necesitamos:** la carpeta fuente completa del nodo, o al menos los paquetes con
`dashboard_sync` de cada módulo. Su criterio es correcto y lo adoptamos: una carpeta no
equivale a una acción; solo se incorpora lo respaldado por archivo fuente.

Lo que sí podemos hacer sin los archivos: **unificar el universo de acciones**. Hoy cada
pantalla arma su conjunto por su cuenta. Dejarlas leyendo un único selector canónico es
trabajo nuestro y se puede hacer ahora, así cuando lleguen los paquetes entran a las seis
pantallas de una.

---

## 3 · SES 35 / Environmental Identity — YA CUMPLIDO

Pide mantener SES 35 y Level 1, no recalcular desde el frontend, y conservar la pantalla
de reconciliación que evidencia que los valores históricos no explican el 35.

Es exactamente lo que hicimos en Fase 0. No hay cambio que aplicar. Confirmado contra el
sync de Movilidad: `score.sustain.current_ses: 35`, `environmental_identity_level: "Level 1 — Verified Participant"`.

Vale marcarlo en la respuesta: esa pantalla de reconciliación no era un bug, era la
decisión de no cerrar el número inventando valores.

---

## 4 · Separación histórico vs. Sustain Verified — YA CUMPLIDO, hay que auditarlo

El criterio ya está implementado y el paquete canónico lo soporta: cada acción trae
`record_origin` y `verification_status`. Las 13 acciones de Montessori vienen todas como
`record_origin: historical_import`.

Lo que corresponde hacer es un **barrido de verificación**: confirmar que las 11 pantallas
y las exportaciones (CSV/JSON) arrastran los dos campos sin excepción. Es trabajo acotado
y lo podemos hacer ya.

---

## 5 · Los 14 registros pendientes de confirmación — HECHO

Pide una lista de 14 registros con ID, categoría, descripción, dato existente, dato que
falta y fuente.

**El número 14 se verifica exacto**: en `canonical/measurements.json` hay 168 mediciones,
de las cuales **14 tienen `quality_status: needs_review`**. Son 12 de gas y 2 de energía
eléctrica inyectada. La lista está armada en
`docs/montessori-registros-pendientes-2026-08-24.md`.

Dos observaciones para revisar antes de mandarla a la escuela:

- **Gas:** la serie mezcla órdenes de magnitud muy distintos (29 m³ en enero 2025 contra
  3.733 m³ en junio 2025). El patrón estacional de calefacción lo explicaría, pero
  conviene que la escuela confirme si la columna es **consumo del período o lectura del
  medidor**, porque de eso depende que los indicadores sean correctos.
- **Energía inyectada:** los valores 880 y 480 kWh están importados como inyección a red,
  pero el propio paquete dice "requiere confirmación de semántica". Es la consulta Q04.

Estos 14 se solapan parcialmente con las consultas abiertas Q04, Q05 y Q06 del paquete.
Conviene mandar una sola lista a la escuela, no dos.

---

## 6 · Habilitación para revisión de la escuela — YA ES NUESTRO CRITERIO

Pide cuatro estados visibles: Histórico documentado / Sustain Verified / Pendiente de
confirmación / Fuera de alcance.

Los primeros dos ya están. **"Pendiente de confirmación" hay que agregarlo** como estado
visible, alimentado por `quality_status: needs_review` — o sea, exactamente los 14
registros del punto 5. "Fuera de alcance" hay que definir de dónde sale; hoy no existe
ese campo en el paquete canónico. **Es la única pregunta que le devolvemos en este punto.**

---

## 7 · No ampliar alcance — DE ACUERDO

Cierra V1, QA integral, después evolución. Nada que objetar. Implica que el flujo RAEE de
Puro Scrap **no entra en esta ronda**.

---

## Qué le contestamos

Tres cosas, en este orden:

1. **Pedirle los 8 DASHBOARD_SYNC de energía y la carpeta fuente del nodo.** Sin eso los
   puntos 1 y 2 no se mueven. Explicarle por qué veníamos mostrando "0 de 8": el único
   sync que recibimos es el de Movilidad y se declara a sí mismo demo. No es una
   discusión, es un archivo que falta.
2. **Confirmarle que 3, 4, 6 y 7 ya están alineados** y que arrancamos con la unificación
   del universo de acciones y el barrido de `record_origin` / `verification_status`.
3. **Preguntarle de dónde sale "Fuera de alcance"**, y pasarle la lista de los 14 para
   que la valide antes de que salga a Montessori.

Y un pendiente nuestro, sin relación con su mensaje: **`docs/resumen-cliente.md` sigue
atribuyendo las 8 facturas EDESUR a Montessori** (línea 16). Es la regresión que
corregimos en código el 18 de agosto y quedó viva en el documento que va al cliente. Hay
que reescribirlo antes de compartir nada.
