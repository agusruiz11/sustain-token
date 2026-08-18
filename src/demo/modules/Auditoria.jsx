import { useMemo, useState } from 'react';
import { useNode } from '../components/useNode';
import { actionsForNode, STEP_STATUS } from '../data/actions';
import { dashboardKeyOf } from '../data/sustainNodes';
import { moduleHref } from '../data/nodeTypes';
import DataTable from '../components/DataTable';
import StatusChip from '../components/StatusChip';
import AuditTrail from '../components/AuditTrail';
import { auditRecords, verificationLabel, qualityLabel, accessLabel } from '../data/montessori/index.js';

/**
 * § 10 del brief + Entregable 3 § 4.7 — Auditoría.
 *
 * Dos secciones que no se mezclan:
 *
 *   · **Acciones Sustain** — verificación criptográfica: hash, CID,
 *     transacción, con su estado real. En el piloto sólo una acción tiene hash
 *     y ninguna está anclada. Se muestra tal cual: simular hashes en un
 *     producto que vende trazabilidad verificable sería el peor error posible.
 *
 *   · **Histórico documental** — la otra forma de probar algo. Sin hash y sin
 *     MRV, porque estos registros no pasaron por el pipeline; su prueba es la
 *     referencia al expediente.
 *
 * Lo que el § 4.7 pide afirmar sobre el histórico —MRV no aplicado, SES no
 * aplica, CID/blockchain no aplica— es una propiedad de la naturaleza del
 * dato, no un cálculo por fila. Por eso se dice una vez arriba de la tabla en
 * lugar de repetir tres columnas vacías 218 veces.
 */

const KIND_FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'action', label: 'Hitos' },
  { id: 'measurement', label: 'Mediciones' },
  { id: 'document', label: 'Documentos' },
  { id: 'compliance', label: 'Evaluaciones' },
];

export default function Auditoria() {
  const { node, routeSegment } = useNode();
  const nodeKey = dashboardKeyOf(node);
  const hasHistory = nodeKey === 'montessori';

  const actions = actionsForNode(node).sort((a, b) => b.date.localeCompare(a.date));
  const base = moduleHref(node.nodeTypeId, node.slug, 'acciones', routeSegment);

  const conHash = actions.filter((a) => a.anchor.hash).length;
  const conCid = actions.filter((a) => a.anchor.cid).length;
  const ancladas = actions.filter((a) => a.anchor.tx).length;

  const columns = [
    { key: 'title', label: 'Acción', render: (a) => a.title },
    { key: 'dateLabel', label: 'Fecha', width: '110px' },
    {
      key: 'hash',
      label: 'Hash SHA-256',
      render: (a) => a.anchor.hash
        ? <code className="aud-hash" title={a.anchor.hash}>{a.anchor.hash}</code>
        : <span className="trace-step-value--pending">Pendiente de cálculo</span>,
    },
    {
      key: 'cid',
      label: 'CID',
      width: '120px',
      render: (a) => <StatusChip status={a.anchor.cidStatus} />,
    },
    {
      key: 'chain',
      label: 'Blockchain',
      align: 'right',
      width: '130px',
      render: (a) => <StatusChip status={a.anchor.chainStatus} />,
    },
  ];

  return (
    <>
      {actions.length > 0 && (
        <>
          <div className="dash-card">
            <div className="dash-section-header">
              <span className="dash-section-title">Estado de anclaje</span>
            </div>
            <div className="mod-scaffold-stats" style={{ borderBottom: 0, paddingTop: 0 }}>
              <div className="mod-scaffold-stat">
                <div className="mod-scaffold-stat-value">{conHash} / {actions.length}</div>
                <div className="mod-scaffold-stat-label">Con hash calculado</div>
              </div>
              <div className="mod-scaffold-stat">
                <div className="mod-scaffold-stat-value">{conCid} / {actions.length}</div>
                <div className="mod-scaffold-stat-label">Con CID en IPFS</div>
              </div>
              <div className="mod-scaffold-stat">
                <div className="mod-scaffold-stat-value">{ancladas} / {actions.length}</div>
                <div className="mod-scaffold-stat-label">Ancladas en cadena</div>
              </div>
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-section-header">
              <span className="dash-section-title">Acciones Sustain</span>
              <span className="act-count">{actions.length} registros</span>
            </div>
            <DataTable
              columns={columns}
              rows={actions}
              rowHref={(a) => `${base}/${a.id}`}
              caption="Estado criptográfico de cada acción"
            />
          </div>
        </>
      )}

      {hasHistory && <HistoricalAudit />}

      <AuditTrail audit={node.audit} />

      {actions.length > 0 && ancladas === 0 && (
        <p className="mod-scaffold-note">
          El piloto todavía no tiene ninguna acción anclada en blockchain. Hasta que el anclaje
          se ejecute, estas columnas seguirán en estado pendiente — es información real, no un
          espacio a completar.
        </p>
      )}
    </>
  );
}

/** Auditoría documental del histórico institucional. */
function HistoricalAudit() {
  const [kind, setKind] = useState('todos');
  const [estado, setEstado] = useState('todos');
  const [viewerLevel, setViewerLevel] = useState('institutional');
  /* 214 registros de un saque hacen una página inmanejable. Se muestran de a
     tandas; los filtros siguen operando sobre el total, no sobre lo visible. */
  const [limite, setLimite] = useState(50);

  const all = useMemo(() => auditRecords({ viewerLevel }), [viewerLevel]);

  const estados = useMemo(
    () => [...new Set(all.map((r) => r.verificationStatus))],
    [all],
  );

  const rows = useMemo(
    () => all.filter((r) =>
      (kind === 'todos' || r.kind === kind) &&
      (estado === 'todos' || r.verificationStatus === estado),
    ),
    [all, kind, estado],
  );

  const enRevision = all.filter((r) => r.qualityStatus === 'needs_review').length;
  const visibles = rows.slice(0, limite);

  return (
    <div className="dash-card">
      <div className="dash-section-header">
        <span className="dash-section-title">Histórico documental</span>
        <span className="act-count">
          {rows.length === all.length ? `${all.length} registros` : `${rows.length} de ${all.length} registros`}
        </span>
      </div>

      {/* MRV, SES y anclaje no aplican a ninguna fila de esta tabla. Se dice
          una vez, en lugar de tres columnas vacías por registro. */}
      <p className="aud-hist-rule">
        MRV <strong>no aplicado</strong> · SES <strong>no aplica</strong> ·
        CID y blockchain <strong>no aplican</strong>. Son registros anteriores a Sustain:
        su prueba es la referencia al expediente, no un hash.
      </p>

      <div className="act-filters">
        <label className="act-filter">
          <span>Tipo</span>
          <select value={kind} onChange={(e) => setKind(e.target.value)}>
            {KIND_FILTERS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>
        </label>
        <label className="act-filter">
          <span>Estado</span>
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="todos">Todos</option>
            {estados.map((s) => <option key={s} value={s}>{verificationLabel(s)}</option>)}
          </select>
        </label>
        <label className="act-filter">
          <span>Ver como</span>
          <select value={viewerLevel} onChange={(e) => setViewerLevel(e.target.value)}>
            <option value="institutional">Institución</option>
            <option value="audit_restricted">Auditor externo</option>
            <option value="public">Perfil público</option>
          </select>
        </label>
      </div>

      <DataTable
        columns={[
          {
            key: 'kind', label: 'Tipo', width: '110px',
            render: (r) => <span className="aud-kind">{r.kindLabel}</span>,
          },
          { key: 'title', label: 'Registro' },
          {
            key: 'period', label: 'Período', width: '180px',
            render: (r) => r.period ?? <span className="trace-step-value--pending">Sin fecha</span>,
          },
          {
            key: 'estado', label: 'Verificación', width: '150px',
            render: (r) => (
              <span className="inst-origin-badge">{verificationLabel(r.verificationStatus)}</span>
            ),
          },
          {
            key: 'calidad', label: 'Calidad', width: '130px',
            render: (r) => !r.qualityStatus
              ? '—'
              : r.qualityStatus === 'accepted'
                ? qualityLabel(r.qualityStatus)
                : <span className="trace-step-value--pending">{qualityLabel(r.qualityStatus)}</span>,
          },
          {
            key: 'acceso', label: 'Acceso', width: '120px',
            render: (r) => (
              <span className={`arch-access arch-access--${r.accessLevel}`}>
                {accessLabel(r.accessLevel)}
              </span>
            ),
          },
          {
            key: 'source', label: 'Fuente / evidencia', align: 'right',
            render: (r) => (
              <span className="arch-ref">
                {r.sourceReference}
                {r.evidence > 0 ? ` · ${r.evidence} ev.` : ''}
              </span>
            ),
          },
        ]}
        rows={visibles}
        rowKey={(r) => r.id}
        caption="Registros auditables del expediente institucional"
        empty="Ningún registro coincide con los filtros."
      />

      {rows.length > visibles.length && (
        <button type="button" className="aud-more" onClick={() => setLimite((n) => n + 100)}>
          Ver {Math.min(100, rows.length - visibles.length)} registros más
          <span className="aud-more-count">{visibles.length} de {rows.length}</span>
        </button>
      )}

      <p className="mod-scaffold-note">
        Ningún registro histórico tiene hash. No es un campo faltante: no pasaron por el
        pipeline. Cuando lleguen los archivos originales del expediente (consulta Q10) se
        les podrá calcular hash y versionado sin alterar el registro lógico.
        {enRevision > 0 && ` ${enRevision} mediciones están en revisión y no alimentan KPI públicos, pero siguen siendo auditables.`}
      </p>
    </div>
  );
}
