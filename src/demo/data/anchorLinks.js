/* ============================================================
   ENLACES DE ANCLAJE — IPFS y explorador de bloques
   ============================================================
   28 ago 2026. Pedido de Martín, urgente:

     «Quiero tener en el celu el end to end: la factura, ir navegando, y cuando
      toque IPFS que me abra IPFS con la factura, y que me abra el anclaje
      on-chain en BscScan, aunque sea en una.»

   ------------------------------------------------------------
   ⚠ NO HAY CID NI TX TODAVÍA
   ------------------------------------------------------------
   Este archivo construye los links; no inventa los identificadores. Mientras
   `anchor.cid` y `anchor.tx` sigan en null, la UI muestra el paso como
   pendiente y NO renderiza un enlace roto.

   Los 8 DASHBOARD_SYNC de energía que Martín describió el 24 de agosto
   —`registry_proof.ipfs.cid` en `stored` y
   `registry_proof.blockchain.transaction_hash` en BNB Smart Chain— nunca
   llegaron a `drive-files/`. En cuanto llegue aunque sea uno, se pega en
   ENERGY_ANCHORS de data/actions.js y esto se enciende solo.

   Un CID inventado en una demo a un inversor es exactamente el error que el
   producto promete no cometer: alcanza con que alguien toque el link.

   ------------------------------------------------------------
   TRES ESTADOS, NO DOS
   ------------------------------------------------------------
   El propio Martín describió el estado intermedio: los Sync históricos traen
   CID y transaction_hash informados, pero `transaction_status`, `block_number`
   y `block_timestamp` en null y `proof_validation_status: PARTIAL`. Eso no es
   "sin anclar" — la transacción existe y se puede abrir en el explorador. Es
   una confirmación que todavía no se incorporó al Sync, y se dice así.
   ============================================================ */

/* Gateway público. Si en la demo responde lento conviene cambiarlo por
   dweb.link o w3s.link: es una sola línea y no afecta al dato. */
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs';

/** Exploradores por chain_id. El piloto ancla en BNB Smart Chain (56). */
const EXPLORERS = {
  56: { name: 'BscScan', base: 'https://bscscan.com' },
  97: { name: 'BscScan Testnet', base: 'https://testnet.bscscan.com' },
};

const DEFAULT_CHAIN_ID = 56;

export const explorerFor = (chainId = DEFAULT_CHAIN_ID) =>
  EXPLORERS[chainId] ?? EXPLORERS[DEFAULT_CHAIN_ID];

/** URL del archivo en IPFS, o null si todavía no hay CID. */
export const ipfsUrl = (cid) => (cid ? `${IPFS_GATEWAY}/${cid}` : null);

/** URL de la transacción en el explorador, o null si todavía no hay hash. */
export const txUrl = (hash, chainId = DEFAULT_CHAIN_ID) =>
  (hash ? `${explorerFor(chainId).base}/tx/${hash}` : null);

/** URL del contrato en el explorador. */
export const contractUrl = (address, chainId = DEFAULT_CHAIN_ID) =>
  (address && address.startsWith('0x') ? `${explorerFor(chainId).base}/address/${address}` : null);

/* ── Estado de la prueba on-chain ───────────────────────────── */

export const PROOF_STATE = {
  /** Hay tx y su confirmación está incorporada al Sync. */
  ANCHORED: 'anchored',
  /** Hay tx, pero falta receipt/block en el Sync. Se puede abrir igual. */
  TX_UNCONFIRMED: 'tx_unconfirmed',
  /** No hay transacción todavía. */
  PENDING: 'pending',
};

const PROOF_LABEL = {
  anchored: 'Anclado y confirmado',
  tx_unconfirmed: 'TX registrada · confirmación no incorporada al Sync',
  pending: 'Pendiente de anclaje',
};

export const proofLabel = (state) => PROOF_LABEL[state] ?? state;

/**
 * Estado de la prueba on-chain de una acción.
 *
 * `proof_validation_status: PARTIAL` NO significa ausencia de prueba: si hay
 * transaction_hash, la transacción existe. Lo que falta es el bloque y el
 * timestamp de confirmación.
 */
export function proofState(anchor) {
  if (!anchor?.tx) return PROOF_STATE.PENDING;
  const confirmado = Boolean(anchor.blockNumber ?? anchor.timestamp);
  return confirmado ? PROOF_STATE.ANCHORED : PROOF_STATE.TX_UNCONFIRMED;
}

/** Los dos enlaces de una acción, listos para renderizar. `null` = no hay dato. */
export function anchorLinks(anchor) {
  return {
    ipfs: ipfsUrl(anchor?.cid),
    tx: txUrl(anchor?.tx, anchor?.chainId),
    contract: contractUrl(anchor?.contract, anchor?.chainId),
    explorer: explorerFor(anchor?.chainId).name,
    proof: proofState(anchor),
  };
}
