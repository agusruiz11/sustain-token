import { useMemo, useState } from 'react';
import { useNode } from '../components/useNode';
import { actionsForNode, STEP_STATUS } from '../data/actions';
import { dashboardKeyOf } from '../data/sustainNodes';
import { moduleHref } from '../data/nodeTypes';
import DataTable from '../components/DataTable';
import StatusChip from '../components/StatusChip';
import AuditTrail from '../components/AuditTrail';
import { anchorLinks } from '../data/anchorLinks';
import {
  auditRecords, verificationLabel, qualityLabel, accessLabel,
  recordStateOf, recordStateLabel, RECORD_STATE,
} from '../data/montessori/index.js';

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

  const hrefOf = (a) => {
    const mod = moduleHref(node.nodeTypeId, node.slug, a.detailPath.module, routeSegment);
    return a.detailPath.query ? `${mod}?${a.detailPath.query}` : `${mod}/${a.id}`;
  };

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
      /* Con CID cargado la celda abre el archivo en el gateway; sin CID
         muestra el estado. Nunca un enlace que no lleva a ninguna parte. */
      key: 'cid',
      label: 'CID',
      width: '140px',
      render: (a) => {
        const url = anchorLinks(a.anchor).ipfs;
        return url
          ? <a className="aud-link" href={url} target="_blank" rel="noreferrer noopener">Ver en IPFS ↗</a>
          : <StatusChip status={a.anchor.cidStatus} />;
      },
    },
    {
      key: 'chain',
      label: 'Blockchain',
      align: 'right',
      width: '170px',
      render: (a) => {
        const l = anchorLinks(a.anchor);
        return l.tx
          ? <a className="aud-link" href={l.tx} target="_blank" rel="noreferrer noopener">Ver en {l.explorer} ↗</a>
          : <StatusChip status={a.anchor.chainStatus} />;
      },
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
              /* Cada acción abre donde se explica: la factura y la Botella de
                 Amor en su ficha, el viaje en el módulo Movilidad. Antes todas
                 iban a la ficha y las de movilidad rebotaban por un redirect. */
              rowHref={hrefOf}
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

  /* Cuántos registros hay en cada uno de los cuatro estados. Sirve como
     herramienta de data-quality: la escuela ve de un vistazo cuánto le falta
     confirmar, que es justamente para lo que se le comparte el dashboard. */
  const porEstado = useMemo(() => {
    const c = {};
    for (const r of all) {
      const s = recordStateOf(r);
      c[s] = (c[s] ?? 0) + 1;
    }
    return c;
  }, [all]);

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

      {/* Los cuatro estados, contados. Un estado con cero registros no se
          muestra: una etiqueta en 0 sugiere que falta cargar algo. */}
      <div className="rec-state-legend">
        {[RECORD_STATE.SUSTAIN_VERIFIED, RECORD_STATE.DOCUMENTED,
          RECORD_STATE.PENDING_CONFIRMATION, RECORD_STATE.OUT_OF_SCOPE]
          .filter((s) => porEstado[s] > 0)
          .map((s) => (
            <span key={s} className={`rec-state rec-state--${s}`}>
              {recordStateLabel(s)} · {porEstado[s]}
            </span>
          ))}
      </div>

      <div className="act-filters">
        <label className="act-filter">
          <span>Tipo</span>
          <select value={kind} onChange={(e) => setKind(e.target.value)}>
            {KIND_FILTERS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>
        </label>
        <label className="act-filter">
          <span>Verificación</span>
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
            /* Los cuatro estados que pidió Martín, resueltos a uno solo por
               fila. La verificación cruda sigue disponible en el tooltip: es
               dato de auditoría, no se pierde. */
            key: 'estadoRegistro', label: 'Estado', width: '190px',
            render: (r) => {
              const s = recordStateOf(r);
              return (
                <span
                  className={`rec-state rec-state--${s}`}
                  title={`Verificación: ${verificationLabel(r.verificationStatus)}`}
                >
                  {recordStateLabel(s)}
                </span>
              );
            },
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
        {enRevision > 0 && ` ${enRevision} mediciones figuran como Pendiente de confirmación: existen y están respaldadas por el expediente, pero falta que la institución precise qué se midió, cómo y en qué período. No alimentan KPI públicos y no se completaron por inferencia.`}
      </p>
    </div>
  );
}
