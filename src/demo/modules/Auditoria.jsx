import { useNode } from '../components/useNode';
import { actionsForNode, STEP_STATUS } from '../data/actions';
import { moduleHref } from '../data/nodeTypes';
import DataTable from '../components/DataTable';
import StatusChip from '../components/StatusChip';
import AuditTrail from '../components/AuditTrail';

/**
 * § 10 del brief — auditoría.
 *
 * Verificación criptográfica por acción: hash, CID y transacción, con su estado
 * real. En el piloto sólo una de las 8 tiene hash calculado y ninguna está
 * anclada. Se muestra tal cual: simular hashes en un producto que vende
 * trazabilidad verificable sería el peor error posible.
 */
export default function Auditoria() {
  const { node, routeSegment } = useNode();
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
          <span className="dash-section-title">Verificación por acción</span>
          <span className="act-count">{actions.length} registros</span>
        </div>
        <DataTable
          columns={columns}
          rows={actions}
          rowHref={(a) => `${base}/${a.id}`}
          caption="Estado criptográfico de cada acción"
        />
      </div>

      <AuditTrail audit={node.audit} />

      {ancladas === 0 && (
        <p className="mod-scaffold-note">
          El piloto todavía no tiene ninguna acción anclada en blockchain. Hasta que el anclaje
          se ejecute, estas columnas seguirán en estado pendiente — es información real, no un
          espacio a completar.
        </p>
      )}
    </>
  );
}
