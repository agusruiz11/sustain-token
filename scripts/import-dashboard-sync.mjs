/* ============================================================
   IMPORTADOR DE DASHBOARD_SYNC — entrega 05_INSTITUTIONS (28 sep 2026)
   ============================================================
   Implementa el "contrato de importación" del MANUAL_AGENCIA_MONTESSORI_v2:

     1. La única entrada es 02_DASHBOARD_SYNC/dashboard_sync.json de cada
        acción. Se rechaza cualquier archivo cuyo protocol.schema no sea
        DASHBOARD_SYNC, schema_version no sea 2.2, ready_for_agency no sea
        true, o cuyo action_id no coincida con 00_NODE/import_index.json.
     2. El JSON íntegro NO se publica: incluye evidencia, estructura de
        atribución y datos de auditoría. Este script escribe una PROYECCIÓN
        de campos permitidos a src/demo/data/institutional/imported.js. Lo que
        no está en la lista de abajo no llega al bundle del navegador.
     3. UPSERT por action_id: la salida es un objeto indexado por action_id,
        así que reimportar no puede duplicar una acción. `idempotency_key`
        del Sync queda registrada para detectar la misma finalización.
     4. No se recalcula MRV, línea base, SES ni atribución: los valores se
        copian literales. Un `null` sigue siendo `null`, nunca 0.

   Uso:
     node scripts/import-dashboard-sync.mjs [ruta a 05_INSTITUTIONS]
   Por defecto lee drive-files/05_INSTITUTIONS (fuente del cliente, sólo
   lectura). Verificación posterior: `npm run verify:institutional`.
   ============================================================ */

import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const ROOT = process.argv[2] ?? path.resolve('drive-files/05_INSTITUTIONS');
const OUT = path.resolve('src/demo/data/institutional/imported.js');

const sha256File = (p) => createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

/* Campos de privacidad del paquete que se muestran, traducidos. Lo que no
   está acá se muestra con su nombre técnico. */
const RESTRICTED_LABELS = {
  exact_coordinates: 'coordenadas exactas',
  private_identity_mapping: 'identidad real de los participantes',
  original_media: 'fotos y videos originales',
  student_images: 'imágenes de alumnos',
  student_names: 'nombres de alumnos',
  exact_location: 'ubicación exacta',
  minor_photos: 'fotos de menores',
  media_hashes: 'hashes de las fotos restringidas',
};

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

/** Índice de nodo: cada institución declara sus acciones y los SHA-256 esperados. */
function readIndex(nodeDir) {
  const idx = readJson(path.join(nodeDir, '00_NODE', 'import_index.json'));
  // Montessori usa schema 2.0 (lista de acciones); Posicionarte 1.0 (una sola).
  if (Array.isArray(idx.actions)) return idx.actions.map((a) => ({ ...a, institution_node_id: idx.institution_node_id }));
  return [{
    action_id: idx.action_id,
    path: idx.action_path,
    technical_zip_sha256: idx.technical_zip_sha256,
    dashboard_sync_sha256: idx.dashboard_sync_sha256,
    canonical_root: idx.canonical_root,
    institution_node_id: idx.institution_node_id,
  }];
}

/** Carpeta de la acción dentro del nodo, a partir del action_id. */
function actionDir(nodeDir, actionId) {
  const dirs = fs.readdirSync(path.join(nodeDir, '01_ACTIONS'));
  const hit = dirs.find((d) => d.startsWith(actionId));
  if (!hit) fail(`no existe carpeta para ${actionId} en ${nodeDir}`);
  return path.join(nodeDir, '01_ACTIONS', hit);
}

/** Contrato de importación, punto 1. */
function validate(sync, entry) {
  const p = sync.protocol ?? {};
  if (p.schema !== 'DASHBOARD_SYNC') fail(`${entry.action_id}: protocol.schema = ${p.schema}`);
  if (p.schema_version !== '2.2') fail(`${entry.action_id}: schema_version = ${p.schema_version}`);
  if (sync.synchronization?.ready_for_agency !== true) fail(`${entry.action_id}: ready_for_agency ≠ true`);
  if (sync.platform_identifiers?.action_id !== entry.action_id) fail(`${entry.action_id}: action_id no coincide con el índice`);
  if (sync.platform_identifiers?.node_id !== entry.institution_node_id) fail(`${entry.action_id}: node_id no coincide con el índice`);
  if (sync.registry_proof?.state !== 'READY_FOR_AGENCY') fail(`${entry.action_id}: registry_proof.state = ${sync.registry_proof?.state}`);
  if (sync.integrity?.canonical_root !== entry.canonical_root) fail(`${entry.action_id}: canonical_root no coincide con el índice`);
  const d = sync.integration_directives ?? {};
  for (const k of ['recalculate_mrv', 'recalculate_baseline', 'recalculate_ses', 'recalculate_attribution', 'increment_action_count', 'allow_duplicate_action_id']) {
    if (d[k] !== false) fail(`${entry.action_id}: integration_directives.${k} debería ser false`);
  }
}

/**
 * Proyección pública + interna segura. Todo lo que se lista acá es lo que el
 * navegador va a recibir. Deliberadamente afuera: evidence, storage, network,
 * governance, claims, incentives, lineage, extensions, actors,
 * node_snapshot, internal_identifiers y action_event.source completo.
 */
function project(sync, entry, policy) {
  const ev = sync.action_event?.source?.event ?? {};
  const loc = ev.location ?? {};
  const pub = new Set(sync.privacy?.public_fields ?? []);
  const locationPublic = pub.has('city') || pub.has('generalized_location');
  const onchain = sync.registry_proof?.onchain ?? {};
  const mrv = sync.mrv ?? {};
  const score = sync.score ?? {};
  const attr = sync.attribution ?? {};
  const hier = sync.hierarchy?.definition ?? {};

  return {
    actionId: sync.platform_identifiers.action_id,
    nodeId: sync.platform_identifiers.node_id,
    schemaVersion: sync.protocol.schema_version,
    sourceCapVersion: sync.protocol.source_cap_version ?? null,

    module: sync.action_event?.module ?? null,
    actionType: sync.action_event?.action_type ?? null,
    title: ev.title ?? null,
    description: ev.description ?? null,
    section: policy?.section ?? null,

    dates: {
      occurredOn: sync.dates?.occurred_on ?? null,
      evidenceReceivedOn: ev.evidence_received_on ?? null,
      anchoredAt: sync.dates?.anchored_at ?? null,
      finalizedAt: sync.dates?.finalized_at ?? null,
    },

    location: locationPublic
      ? { city: loc.city ?? null, province: loc.province ?? null, country: loc.country ?? null, privacyMode: loc.privacy_mode ?? null }
      : { city: null, province: null, country: loc.country ?? null, privacyMode: loc.privacy_mode ?? null },

    validation: {
      status: sync.validation?.validation_status ?? null,
      depth: sync.validation?.verification_depth ?? null,
      evidenceQuality: sync.validation?.evidence_quality ?? null,
      duplicateRisk: sync.validation?.duplicate_risk ?? null,
      ambiguities: sync.validation?.ambiguities ?? [],
      auditNotes: sync.validation?.audit_notes ?? [],
      checks: sync.validation?.checks ?? {},
    },

    mrv: {
      category: mrv.category ?? null,
      measurement: mrv.measurement ?? {},
      result: mrv.result ?? {},
      limitations: mrv.limitations ?? [],
      methodology: {
        id: mrv.methodology?.methodology_id ?? null,
        version: mrv.methodology?.version ?? null,
        status: mrv.methodology?.status ?? null,
        calculationType: mrv.methodology?.calculation_type ?? null,
      },
      reporting: mrv.reporting ? { participantCount: mrv.reporting.participant_count ?? null } : null,
    },

    baseline: { applicability: sync.baseline?.applicability ?? null, status: sync.baseline?.status ?? null },

    score: {
      policyApplied: score.policy_applied ?? score.policy_name ?? null,
      policyId: score.policy_id ?? null,
      policyVersion: score.policy_version ?? null,
      policyStatus: score.policy_status ?? null,
      scientificStatus: score.scientific_status ?? null,
      grossSesDelta: score.gross_ses_delta ?? null,
      attributedSesDelta: score.attributed_ses_delta ?? null,
      reason: score.reason ?? null,
      rewardEnabled: score.reward_enabled ?? null,
      components: score.components ?? null,
      organizationProjection: score.organization_projection
        ? { method: score.organization_projection.method, nodeId: score.organization_projection.node_id, sesDelta: score.organization_projection.ses_delta }
        : null,
      collectiveAllocations: (score.collective_allocations ?? []).map((a) => ({
        nodeId: a.node_id, share: a.share, attributedSesDelta: a.attributed_ses_delta, grossSesDelta: a.gross_ses_delta, scoreStatus: a.score_status,
      })),
    },

    attribution: {
      method: attr.attribution?.method ?? null,
      organizationSes: attr.attribution?.organization_ses ?? null,
      personalSes: attr.attribution?.personal_ses ?? null,
      physicalImpactAccounting: attr.attribution?.physical_impact_accounting ?? null,
      beneficiaryNodes: attr.beneficiary_nodes ?? [],
      collaboratorNodes: attr.collaborator_nodes ?? [],
      globalActionCount: attr.global_action_count ?? null,
    },

    hierarchy: {
      id: hier.hierarchy_id ?? null,
      version: hier.hierarchy_version ?? null,
      nodes: (hier.nodes ?? []).map((n) => ({
        nodeId: n.node_id, displayName: n.display_name, nodeType: n.node_type, publicIdentity: n.privacy?.public_identity ?? null,
      })),
      edges: (hier.edges ?? []).map((e) => ({ child: e.child_node_id, parent: e.parent_node_id, relationship: e.relationship })),
      externalCollaborators: (hier.external_collaborators ?? []).map((c) => ({
        nodeId: c.node_id, relationship: c.relationship, rollupEnabled: c.rollup_enabled ?? false,
      })),
      rollup: hier.rollup_policy ?? null,
    },

    registryProof: {
      state: sync.registry_proof?.state ?? null,
      storageType: sync.registry_proof?.storage_type ?? null,
      anchorRef: sync.registry_proof?.anchor_ref ?? null,
      onchain: {
        chainId: onchain.chain_id ?? null,
        networkName: onchain.network_name ?? null,
        contractAddress: onchain.contract_address ?? null,
        transactionHash: onchain.transaction_hash ?? sync.integrity?.transaction_hash ?? null,
        blockNumber: onchain.block_number ?? null,
        blockHash: onchain.block_hash ?? null,
        blockTimestamp: onchain.block_timestamp ?? null,
        eventName: onchain.event_name ?? null,
        anchorMethod: onchain.anchor_method ?? null,
        logIndex: onchain.event_arguments?.log_index ?? null,
        from: onchain.from ?? null,
        receiptStatus: onchain.receipt_status ?? null,
      },
    },

    integrity: {
      canonicalRoot: sync.integrity?.canonical_root ?? null,
      canonicalActionSha256: sync.integrity?.canonical_action_sha256 ?? null,
      canonicalCoreImmutable: sync.integrity?.canonical_core_immutable ?? null,
    },

    privacy: {
      classification: sync.privacy?.classification ?? null,
      publicFields: sync.privacy?.public_fields ?? [],
      restrictedFields: (sync.privacy?.restricted_fields ?? []).map((f) => RESTRICTED_LABELS[f] ?? f),
      retentionPolicy: sync.privacy?.retention_policy ?? null,
    },

    synchronization: {
      operation: sync.synchronization?.operation ?? null,
      idempotencyKey: sync.synchronization?.idempotency_key ?? null,
      syncStatus: sync.synchronization?.sync_status ?? null,
    },

    computeFootprint: {
      accountingStatus: sync.compute_footprint?.accounting_status ?? null,
      aiUsage: sync.compute_footprint?.ai_usage ?? null,
    },

    /* 04_VISIBILITY/access_policy.json: sólo lo que hace falta para no
       publicar de más. */
    media: {
      candidates: policy?.public_media_candidates?.files ?? [],
      candidateCount: policy?.public_media_candidates?.count ?? 0,
      publicationAuthorized: policy?.public_media_candidates?.publication_authorized_by_this_package ?? false,
      approvalScope: policy?.public_media_candidates?.approval_scope ?? null,
      schoolOnlyStatus: policy?.school_only_evidence?.status ?? null,
      technicalZipContainsOriginalMedia: policy?.technical_zip?.contains_original_media ?? false,
    },

    /* Huellas de la entrega, para poder re-verificar el paquete fuente. */
    source: {
      dashboardSyncSha256: entry.dashboard_sync_sha256,
      technicalZipSha256: entry.technical_zip_sha256,
      relativePath: entry.path,
    },
  };
}

/* ── Recorrido ─────────────────────────────────────────────── */

if (!fs.existsSync(ROOT)) fail(`no existe ${ROOT}`);

const nodes = fs.readdirSync(ROOT).filter((d) => d.startsWith('spn_'));
const imported = {};
const institutions = {};

for (const nodeName of nodes.sort()) {
  const nodeDir = path.join(ROOT, nodeName);
  const entries = readIndex(nodeDir);
  const nodeId = entries[0].institution_node_id;
  institutions[nodeId] = { nodeId, folder: nodeName, actionIds: [] };

  for (const entry of entries) {
    const dir = actionDir(nodeDir, entry.action_id);
    const syncPath = path.join(dir, '02_DASHBOARD_SYNC', 'dashboard_sync.json');
    const policyPath = path.join(dir, '04_VISIBILITY', 'access_policy.json');
    if (!fs.existsSync(syncPath)) fail(`${entry.action_id}: falta dashboard_sync.json`);

    const actual = sha256File(syncPath);
    if (actual !== entry.dashboard_sync_sha256) fail(`${entry.action_id}: SHA-256 del dashboard_sync no coincide con el índice`);

    const sync = readJson(syncPath);
    const policy = fs.existsSync(policyPath) ? readJson(policyPath) : null;
    validate(sync, entry);

    if (imported[entry.action_id]) fail(`${entry.action_id}: action_id duplicado en la entrega`);
    imported[entry.action_id] = project(sync, entry, policy);
    institutions[nodeId].actionIds.push(entry.action_id);
    console.log(`✓ ${entry.action_id} · ${sync.action_event?.module} · ${imported[entry.action_id].title}`);
  }
}

const header = `/* ============================================================
   GENERADO POR scripts/import-dashboard-sync.mjs — NO EDITAR A MANO
   ============================================================
   Proyección de campos permitidos de los dashboard_sync.json de la entrega
   05_INSTITUTIONS (28 sep 2026). El JSON fuente vive en drive-files/ y no se
   publica: acá sólo llega lo que el manual de Sustain autoriza a mostrar,
   más los identificadores criptográficos necesarios para la auditoría.

   Indexado por action_id: reimportar es un UPSERT, no puede duplicar.
   Para regenerar: node scripts/import-dashboard-sync.mjs
   Para verificar: npm run verify:institutional
   ============================================================ */

`;

const body =
  `export const IMPORTED_INSTITUTIONS = ${JSON.stringify(institutions, null, 2)};\n\n` +
  `export const IMPORTED_ACTIONS = ${JSON.stringify(imported, null, 2)};\n`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, header + body);
console.log(`\n${Object.keys(imported).length} acciones importadas → ${path.relative(process.cwd(), OUT)}`);
