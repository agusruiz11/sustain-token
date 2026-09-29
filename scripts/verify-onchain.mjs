/* ============================================================
   VERIFICACIÓN ON-CHAIN — anclajes de la entrega 05_INSTITUTIONS
   ============================================================
   Consulta un nodo público de BNB Smart Chain (JSON-RPC, sin clave) y
   compara cada transacción con lo que declara el registry_proof del
   dashboard_sync: red, contrato, cuenta firmante, bloque, hash de bloque,
   timestamp y el evento ActionAnchored con el action_id y el anchor_ref.

   Es NUESTRA verificación, independiente del Resolver de Sustain. El
   resultado se escribe en src/demo/data/institutional/onchainVerification.js
   con fecha, para que la UI pueda decir "verificado por Posicionarte el ..."
   en vez de repetir lo que dice el paquete.

   Uso: npm run verify:onchain
   Sin red devuelve error y NO toca el archivo de resultados: una
   verificación que no se pudo hacer no se registra como hecha.
   ============================================================ */

import fs from 'node:fs';
import path from 'node:path';
import { IMPORTED_ACTIONS } from '../src/demo/data/institutional/imported.js';

const OUT = path.resolve('src/demo/data/institutional/onchainVerification.js');

const RPCS = [
  'https://bsc-dataseed.binance.org',
  'https://bsc-dataseed1.defibit.io',
  'https://rpc.ankr.com/bsc',
  'https://binance.llamarpc.com',
];

async function rpc(method, params) {
  let last;
  for (const url of RPCS) {
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
      });
      const j = await r.json();
      if (j.error) throw new Error(JSON.stringify(j.error));
      return j.result;
    } catch (e) { last = e; }
  }
  throw last;
}

/* keccak256 mínimo, sin dependencias, para reconocer la firma del evento. */
function keccak256(bytes) {
  const RC = [1n, 0x8082n, 0x800000000000808an, 0x8000000080008000n, 0x808bn, 0x80000001n, 0x8000000080008081n, 0x8000000000008009n, 0x8an, 0x88n, 0x80008009n, 0x8000000an, 0x8000808bn, 0x800000000000008bn, 0x8000000000008089n, 0x8000000000008003n, 0x8000000000008002n, 0x8000000000000080n, 0x800an, 0x800000008000000an, 0x8000000080008081n, 0x8000000000008080n, 0x80000001n, 0x8000000080008008n];
  const ROT = [[0, 36, 3, 41, 18], [1, 44, 10, 45, 2], [62, 6, 43, 15, 61], [28, 55, 25, 21, 56], [27, 20, 39, 8, 14]];
  const M = (1n << 64n) - 1n;
  const rot = (x, n) => (n === 0 ? x : ((x << BigInt(n)) | (x >> BigInt(64 - n))) & M);
  const st = Array(25).fill(0n);
  const rate = 136;
  const padded = new Uint8Array(Math.ceil((bytes.length + 1) / rate) * rate);
  padded.set(bytes); padded[bytes.length] ^= 0x01; padded[padded.length - 1] ^= 0x80;
  for (let off = 0; off < padded.length; off += rate) {
    for (let i = 0; i < rate / 8; i++) { let v = 0n; for (let b = 7; b >= 0; b--) v = (v << 8n) | BigInt(padded[off + i * 8 + b]); st[i] ^= v; }
    for (let r = 0; r < 24; r++) {
      const C = [0, 1, 2, 3, 4].map((x) => st[x] ^ st[x + 5] ^ st[x + 10] ^ st[x + 15] ^ st[x + 20]);
      const D = [0, 1, 2, 3, 4].map((x) => C[(x + 4) % 5] ^ rot(C[(x + 1) % 5], 1));
      for (let i = 0; i < 25; i++) st[i] ^= D[i % 5];
      const B = Array(25).fill(0n);
      for (let x = 0; x < 5; x++) for (let y = 0; y < 5; y++) B[y + 5 * ((2 * x + 3 * y) % 5)] = rot(st[x + 5 * y], ROT[x][y]);
      for (let x = 0; x < 5; x++) for (let y = 0; y < 5; y++) st[x + 5 * y] = B[x + 5 * y] ^ ((~B[(x + 1) % 5 + 5 * y]) & B[(x + 2) % 5 + 5 * y]);
      st[0] ^= RC[r];
    }
  }
  let out = '';
  for (let i = 0; i < 4; i++) { let v = st[i]; for (let b = 0; b < 8; b++) { out += (v & 0xffn).toString(16).padStart(2, '0'); v >>= 8n; } }
  return `0x${out}`;
}

const EVENT_SIGNATURES = [
  'ActionAnchored(address,string,string,uint256)',
  'ActionAnchored(address,string,string)',
  'ActionAnchored(string,string)',
];
const topicOf = (sig) => keccak256(new TextEncoder().encode(sig));

async function verify(a) {
  const oc = a.registryProof.onchain;
  const res = { actionId: a.actionId, tx: oc.transactionHash };
  const chain = parseInt(await rpc('eth_chainId', []), 16);
  const rcpt = await rpc('eth_getTransactionReceipt', [oc.transactionHash]);
  if (!rcpt) throw new Error('transacción no encontrada en la red');
  const head = parseInt(await rpc('eth_blockNumber', []), 16);
  const blk = await rpc('eth_getBlockByNumber', [rcpt.blockNumber, false]);

  res.checks = {
    chainId: chain === oc.chainId,
    receiptSuccess: rcpt.status === '0x1',
    contract: rcpt.to.toLowerCase() === oc.contractAddress.toLowerCase(),
    sender: rcpt.from.toLowerCase() === oc.from.toLowerCase(),
    blockNumber: parseInt(rcpt.blockNumber, 16) === oc.blockNumber,
    blockHash: rcpt.blockHash.toLowerCase() === oc.blockHash.toLowerCase(),
    blockTimestamp: new Date(parseInt(blk.timestamp, 16) * 1000).toISOString().replace('.000Z', 'Z') === oc.blockTimestamp,
    eventFound: false,
  };
  const log = rcpt.logs.find((l) => {
    if (l.address.toLowerCase() !== oc.contractAddress.toLowerCase()) return false;
    const raw = Buffer.from(l.data.replace(/^0x/, ''), 'hex').toString('utf8');
    return raw.includes(a.actionId) && raw.includes(a.registryProof.anchorRef);
  });
  if (log) {
    res.checks.eventFound = true;
    res.eventSignature = EVENT_SIGNATURES.find((s) => topicOf(s) === log.topics[0]) ?? null;
    res.logIndex = parseInt(log.logIndex, 16);
  }
  res.confirmations = head - parseInt(rcpt.blockNumber, 16);
  res.verified = Object.values(res.checks).every(Boolean);
  return res;
}

const results = {};
let allOk = true;
for (const a of Object.values(IMPORTED_ACTIONS)) {
  try {
    const r = await verify(a);
    results[a.actionId] = r;
    if (!r.verified) allOk = false;
    console.log(`${r.verified ? '✓' : '✗'} ${a.actionId} · ${r.tx.slice(0, 12)}… · ${r.confirmations} confirmaciones${r.eventSignature ? ` · ${r.eventSignature}` : ''}`);
    for (const [k, v] of Object.entries(r.checks)) if (!v) console.log(`    ✗ ${k}`);
  } catch (e) {
    allOk = false;
    console.log(`✗ ${a.actionId}: ${e.message}`);
  }
}

if (Object.keys(results).length === Object.keys(IMPORTED_ACTIONS).length) {
  const verifiedAt = new Date().toISOString();
  const header = `/* ============================================================
   GENERADO POR scripts/verify-onchain.mjs — NO EDITAR A MANO
   ============================================================
   Resultado de nuestra verificación de los anclajes contra un nodo público
   de BNB Smart Chain. No es lo que dice el paquete de Sustain: es lo que
   respondió la red cuando lo consultamos. Fecha en verifiedAt.
   ============================================================ */

`;
  fs.writeFileSync(OUT, `${header}export const ONCHAIN_VERIFIED_AT = ${JSON.stringify(verifiedAt)};\n\nexport const ONCHAIN_VERIFICATION = ${JSON.stringify(results, null, 2)};\n`);
  console.log(`\nresultado escrito en ${path.relative(process.cwd(), OUT)} (${verifiedAt})`);
} else {
  console.log('\nverificación incompleta: no se escribe el archivo de resultados');
}
process.exit(allOk ? 0 : 1);
