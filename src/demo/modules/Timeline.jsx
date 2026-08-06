import { Link } from 'react-router-dom';
import { useNode } from '../components/useNode';
import { actionsByNode, buildTimeline, STEP_STATUS } from '../data/actions';
import { CATEGORIES } from '../data/categories';
import { moduleHref } from '../data/nodeTypes';
import { SesDelta } from '../components/StatusChip';
import { stepStyle } from '../components/stepStyle';

/**
 * § 5 del brief — línea de tiempo.
 *
 * No es un modelo aparte: es buildTimeline() sobre las mismas acciones que
 * alimentan Mis Acciones y Auditoría. Los 6 hitos del brief (Acción → Validación
 * → Hash → IPFS → Blockchain → SES) son una lectura distinta del mismo objeto.
 */
export default function Timeline() {
  const { node, routeSegment } = useNode();
  const actions = actionsByNode(node.slug).sort((a, b) => b.date.localeCompare(a.date));
  const base = moduleHref(node.nodeTypeId, node.slug, 'acciones', routeSegment);

  const pendientes = actions.filter((a) => a.anchor.chainStatus !== STEP_STATUS.COMPLETE).length;

  return (
    <>
      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Timeline del nodo</span>
          <span className="act-count">{actions.length} acciones · más reciente primero</span>
        </div>

        <ol className="tl-list">
          {actions.map((action) => {
            const cat = CATEGORIES[action.categoryId];
            const milestones = buildTimeline(action);
            return (
              <li key={action.id} className="tl-item">
                <div className="tl-rail" aria-hidden="true">
                  <span className="tl-dot" style={{ background: cat.color }} />
                </div>

                <div className="tl-body">
                  <div className="tl-head">
                    <Link to={`${base}/${action.id}`} className="tl-title">{action.title}</Link>
                    <span className="tl-date">{action.dateLabel}</span>
                    <SesDelta value={action.ses.delta} />
                  </div>

                  <ol className="tl-milestones">
                    {milestones.map((m) => {
                      const s = stepStyle(m.status);
                      return (
                        <li key={m.key} className="tl-ms" title={m.detail ?? ''}>
                          <span className="tl-ms-mark" style={{ color: s.color }}>{s.mark}</span>
                          <span className="tl-ms-label">{m.label}</span>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {pendientes > 0 && (
        <p className="mod-scaffold-note">
          {pendientes} de {actions.length} acciones están pendientes de anclaje en IPFS y
          blockchain. Es el estado real del piloto, no un dato faltante de la demo.
        </p>
      )}
    </>
  );
}
