import { useParams, Navigate } from 'react-router-dom';
import { useNode } from '../components/useNode';
import { getAction, buildTraceability, STEP_STATUS } from '../data/actions';
import { CATEGORIES } from '../data/categories';
import { moduleHref } from '../data/nodeTypes';
import StatusChip, { SesDelta, DeltaPct } from '../components/StatusChip';
import { stepStyle } from '../components/stepStyle';

/* Pasos cuyo valor es un identificador criptográfico: se muestran en monoespaciada
   y se cortan con ellipsis, no se truncan a mano — el hash completo tiene que
   poder copiarse. */
const MONO_STEPS = new Set(['hash', 'cid', 'chain']);

/**
 * § 2 del brief — ficha de la acción.
 *
 * La cadena Factura → Consumo → Baseline → Resultado → SES → MRV → Hash → CID →
 * Blockchain → Reportes es lo que diferencia al producto de un dashboard de
 * métricas. Se arma con buildTraceability(), la misma derivación que alimenta a
 * Timeline y Auditoría.
 */
export default function ActionDetail() {
  const { node, routeSegment } = useNode();
  const { actionId } = useParams();
  const action = getAction(actionId);

  if (!action || action.nodeSlug !== node.slug) {
    return <Navigate to={moduleHref(node.nodeTypeId, node.slug, 'acciones', routeSegment)} replace />;
  }

  const cat = CATEGORIES[action.categoryId];
  const chain = buildTraceability(action);
  const { consumption, baseline, result, ses, dataRoom } = action;

  return (
    <>
      <div className="dash-card">
        <div className="act-detail-head">
          <div className="act-detail-icon" style={{ background: `${cat.color}18`, color: cat.color }}>
            {cat.icon}
          </div>
          <div className="act-detail-titles">
            <h1 className="act-detail-title">{action.title}</h1>
            <p className="act-detail-sub">
              {cat.name} · {action.dateLabel} · {action.evidence.provider}
            </p>
          </div>
          <StatusChip status={STEP_STATUS.COMPLETE} label="VERIFICADA" />
        </div>

        {/* Los cuatro números que resumen la acción. El resto es la cadena. */}
        <div className="act-detail-kpis">
          <div className="act-kpi">
            <div className="act-kpi-label">Consumo real</div>
            <div className="act-kpi-value">{consumption.value}</div>
            <div className="act-kpi-unit">{consumption.unit}</div>
          </div>
          <div className="act-kpi">
            <div className="act-kpi-label">Línea base</div>
            <div className="act-kpi-value">{baseline.value}</div>
            <div className="act-kpi-unit">{baseline.method}</div>
          </div>
          <div className="act-kpi">
            <div className="act-kpi-label">Variación</div>
            <div className="act-kpi-value"><DeltaPct value={result.deltaPct} /></div>
            <div className="act-kpi-unit">
              {result.direction === 'reduction' ? 'Reducción' : result.direction === 'increase' ? 'Aumento' : 'Primer registro'}
            </div>
          </div>
          <div className="act-kpi">
            <div className="act-kpi-label">Impacto en SES</div>
            <div className="act-kpi-value"><SesDelta value={ses.delta} /></div>
            <div className="act-kpi-unit">{ses.label ?? 'Clasificación pendiente'}</div>
          </div>
        </div>
      </div>

      <div className="act-detail-grid">
        <div className="dash-card">
          <div className="dash-section-header">
            <span className="dash-section-title">Trazabilidad</span>
            <span className="act-count">
              {chain.filter((s) => s.status === STEP_STATUS.COMPLETE).length} de {chain.length} pasos
            </span>
          </div>

          <ol className="trace-chain">
            {chain.map((step) => {
              const s = stepStyle(step.status);
              const pending = step.status !== STEP_STATUS.COMPLETE;
              return (
                <li key={step.key} className="trace-step">
                  <div className="trace-step-marker" style={{ color: s.color }}>
                    <span className="trace-step-num">{step.step}</span>
                  </div>
                  <div className="trace-step-body">
                    <div className="trace-step-label">{step.label}</div>
                    <div
                      className={`trace-step-value${MONO_STEPS.has(step.key) ? ' trace-step-value--mono' : ''}${pending ? ' trace-step-value--pending' : ''}`}
                      title={typeof step.value === 'string' ? step.value : undefined}
                    >
                      {step.value ?? 'Pendiente de anclaje'}
                    </div>
                  </div>
                  <StatusChip status={step.status} />
                </li>
              );
            })}
          </ol>
        </div>

        <div className="dash-card">
          <div className="dash-section-header">
            <span className="dash-section-title">Data Room</span>
            <span className="act-count">
              {dataRoom.evidence.length + dataRoom.artifacts.length + dataRoom.reports.length} archivos
            </span>
          </div>

          {[
            ['Evidencia original', dataRoom.evidence],
            ['Artefactos del pipeline', dataRoom.artifacts],
            ['Reportes', dataRoom.reports],
          ].map(([group, files]) => (
            <div key={group} className="dr-group">
              <div className="dash-nav-group-label">{group}</div>
              {files.map((f) => (
                <div key={f.name} className="dr-file">
                  <span className="dr-file-ext" data-ext={f.type}>{f.type}</span>
                  <div className="dr-file-info">
                    <div className="dr-file-name">{f.name}</div>
                    <div className="dr-file-label">{f.label}</div>
                  </div>
                  {f.redacted ? (
                    <span className="dr-file-flag" title={`Campos ocultos: ${dataRoom.redactedFields.join(', ')}`}>
                      redactado
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          ))}

          <p className="mod-scaffold-note">
            Privacidad por diseño: {dataRoom.redactedFields.join(' · ')} nunca se exponen.
          </p>
        </div>
      </div>

      <ProvenanceNote action={action} />
    </>
  );
}

/**
 * Nota de procedencia. En un producto que vende trazabilidad verificable, decir
 * de dónde sale cada número es parte del producto, no una nota al pie.
 */
function ProvenanceNote({ action }) {
  const p = action.provenance ?? {};
  const derived = Object.entries(p).filter(([, v]) => v === 'derived').map(([k]) => k);
  const unknown = Object.entries(p).filter(([, v]) => v === null).map(([k]) => k);

  return (
    <div className="dash-card prov-note">
      <div className="dash-nav-group-label">Procedencia de los datos</div>
      <ul className="mod-scaffold-list">
        <li>Los porcentajes y clasificaciones marcados provienen del pipeline de verificación.</li>
        {derived.length > 0 && (
          <li>
            Reconstruidos desde las series del piloto (precisión ≈ ±0.15 {action.consumption.unit}):{' '}
            {derived.join(', ')}.
          </li>
        )}
        {unknown.length > 0 && (
          <li>
            Sin dato cargado todavía: {unknown.join(', ')}. Se muestran como pendientes en lugar
            de completarse con un valor estimado.
          </li>
        )}
        {action.consumption.periodDays === null && (
          <li>
            Los días del período de facturación no están cargados, así que el consumo total en{' '}
            {action.consumption.unit.split('/')[0]} no se puede calcular todavía.
          </li>
        )}
      </ul>
    </div>
  );
}
