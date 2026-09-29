import { Link } from 'react-router-dom';
import { useNode } from '../components/useNode';
import { actionsForNode } from '../data/actions';
import { sustainNodeFor } from '../data/sustainNodes';
import { moduleHref } from '../data/nodeTypes';
import { CATEGORIES } from '../data/categories';
import StatusChip from '../components/StatusChip';

/**
 * Home de una organización — entrega 05_INSTITUTIONS, 28 sep 2026.
 *
 * Es el caso de Posicionarte: un nodo sin histórico documental, cuya única
 * fuente es lo que Sustain verificó. No reutiliza HomeEscuela porque esa
 * pantalla existe para separar trayectoria documentada de verificación, y acá
 * no hay trayectoria documentada que separar: mostrar una grilla de ceros
 * sugeriría que falta cargar algo.
 *
 * Lo que sí tiene y una escuela no: integrantes con atribución individual.
 * El paquete los identifica con seudónimo y `public_identity: false`, así que
 * la identidad real no se muestra ni se guarda acá.
 */
export default function HomeOrganizacion() {
  const { node, routeSegment } = useNode();
  const inst = node.data;
  const sustain = sustainNodeFor(node);
  const actions = actionsForNode(node).sort((a, b) => b.date.localeCompare(a.date));
  const ancladas = actions.filter((a) => a.anchor.tx).length;
  const verificadas = actions.filter((a) => a.anchor.verification?.verified).length;

  return (
    <>
      <div className="dash-stats-grid">
        {inst.stats.map((s) => (
          <div key={s.label} className="dash-stat-card">
            <div className="dash-stat-card-top">
              <div className="dash-stat-card-label">{s.label}</div>
              <div className="dash-stat-card-icon">{s.icon}</div>
            </div>
            <div className="dash-stat-card-value">{s.value}</div>
            <div className="dash-stat-card-delta dash-stat-card-delta--neutral">{s.delta}</div>
          </div>
        ))}
      </div>

      <div className="dash-two-col-grid">
        <div className="dash-card">
          <div className="dash-section-header">
            <span className="dash-section-title">Acciones verificadas Sustain</span>
            <span className="act-count">{actions.length}</span>
          </div>
          {actions.map((a) => (
            <Link
              key={a.id}
              to={`${moduleHref(node.nodeTypeId, node.slug, 'acciones', routeSegment)}/${a.id}`}
              className="dash-action-row"
            >
              <div className="dash-action-dot" />
              <div className="dash-action-info">
                <div className="dash-action-name">
                  <span aria-hidden="true">{CATEGORIES[a.categoryId].icon} </span>{a.title}
                </div>
                <div className="dash-action-date">
                  {a.dateLabel}
                  {a.location?.city ? ` · ${a.location.city}` : ''}
                </div>
              </div>
              <StatusChip status={a.anchor.chainStatus} label={a.anchor.verification?.verified ? 'ANCLADA · VERIFICADA' : undefined} />
            </Link>
          ))}
          <p className="inst-trajectory-note">
            {inst.sustainActions.note}
          </p>
        </div>

        <div className="dash-card">
          <div className="dash-section-header">
            <span className="dash-section-title">Integrantes con atribución</span>
            <span className="inst-origin-badge">Seudónimos</span>
          </div>
          {(sustain?.members ?? []).map((m) => (
            <div key={m.nodeId} className="dash-action-row">
              <div className="dash-action-dot" style={{ background: 'var(--soft-300, #E8BEE0)' }} />
              <div className="dash-action-info">
                <div className="dash-action-name">{m.publicLabel}</div>
                <div className="dash-action-date" style={{ fontFamily: 'var(--font-mono)' }}>{m.nodeId}</div>
              </div>
              <span className="ses-delta ses-delta--up">+{m.sesAttributed} SES</span>
            </div>
          ))}
          <p className="inst-trajectory-note">
            La identidad real de los participantes no es pública (<code>public_identity: false</code>).
            Cada uno recibe una atribución de 4; la organización lleva 8 como referencia no
            aditiva. La suma 8 + 4 + 4 no existe.
          </p>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Trazabilidad</span>
          <span className="inst-origin-badge">Criptográfica</span>
        </div>
        <div className="mod-scaffold-stats" style={{ borderBottom: 0, paddingTop: 0 }}>
          <div className="mod-scaffold-stat">
            <div className="mod-scaffold-stat-value">{ancladas} / {actions.length}</div>
            <div className="mod-scaffold-stat-label">Ancladas en BNB Smart Chain</div>
          </div>
          <div className="mod-scaffold-stat">
            <div className="mod-scaffold-stat-value">{verificadas} / {actions.length}</div>
            <div className="mod-scaffold-stat-label">Verificadas por Posicionarte contra la red</div>
          </div>
          <div className="mod-scaffold-stat">
            <div className="mod-scaffold-stat-value">0 / {actions.length}</div>
            <div className="mod-scaffold-stat-label">Con CID en IPFS · almacenamiento hash_only</div>
          </div>
        </div>
        <p className="inst-trajectory-note" style={{ marginTop: 0 }}>{inst.auditNote}</p>
      </div>
    </>
  );
}
