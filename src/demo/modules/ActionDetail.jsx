import { useParams, Navigate } from 'react-router-dom';
import { useNode } from '../components/useNode';
import { getAction, buildTraceability, STEP_STATUS } from '../data/actions';
import { dashboardKeyOf } from '../data/sustainNodes';
import { CATEGORIES } from '../data/categories';
import { moduleHref } from '../data/nodeTypes';
import StatusChip, { SesDelta, DeltaPct } from '../components/StatusChip';
import { stepStyle } from '../components/stepStyle';
import { anchorLinks, proofLabel, PROOF_STATE } from '../data/anchorLinks';

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

  // El guard evita que /demo/escuela/montessori/acciones/act_martin_energia_01
  // abra una acción que pertenece a otro nodo.
  if (!action || action.nodeKey !== dashboardKeyOf(node)) {
    return <Navigate to={moduleHref(node.nodeTypeId, node.slug, 'acciones', routeSegment)} replace />;
  }

  /* Desde que el listado unifica energía y movilidad, un id de viaje puede
     llegar hasta acá. Su ficha vive en el módulo Movilidad —que ya explica la
     metodología de carbono y los controles de validación—, así que se redirige
     en lugar de renderizar una ficha de energía a medio llenar. */
  if (action.detailPath?.module && action.detailPath.module !== 'acciones') {
    const mod = moduleHref(node.nodeTypeId, node.slug, action.detailPath.module, routeSegment);
    return <Navigate to={action.detailPath.query ? `${mod}?${action.detailPath.query}` : mod} replace />;
  }

  const cat = CATEGORIES[action.categoryId];
  const chain = buildTraceability(action);
  const links = anchorLinks(action.anchor);
  const { baseline, metric, outcome, ses, dataRoom } = action;

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

        {/* Los cuatro números que resumen la acción. El resto es la cadena.
            Se leen del sobre común (`metric` / `outcome`) y no de los campos de
            energía: una factura, una Botella de Amor y un viaje tienen los
            cuatro números, pero no las mismas unidades. Lo que no aplica se
            dice; no se rellena con un cero. */}
        <div className="act-detail-kpis">
          <div className="act-kpi">
            <div className="act-kpi-label">{metric.label}</div>
            <div className="act-kpi-value">{metric.value}</div>
            <div className="act-kpi-unit">{metric.unit}</div>
          </div>
          <div className="act-kpi">
            <div className="act-kpi-label">Línea base</div>
            <div className="act-kpi-value">
              {baseline.value ?? <span className="act-kpi-na">No aplica</span>}
            </div>
            <div className="act-kpi-unit">{baseline.method}</div>
          </div>
          <div className="act-kpi">
            <div className="act-kpi-label">{outcome.label}</div>
            <div className="act-kpi-value">
              {outcome.deltaPct !== null
                ? <DeltaPct value={outcome.deltaPct} />
                : <>{outcome.value} <small>{outcome.unit}</small></>}
            </div>
            <div className="act-kpi-unit">
              {outcome.direction === 'reduction' ? 'Reducción'
                : outcome.direction === 'increase' ? 'Aumento'
                  : 'Primer registro'}
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
              /* IPFS y blockchain son los dos pasos que se pueden abrir fuera
                 del producto: son la prueba de que la trazabilidad no termina
                 en la pantalla. Cuando hay dato, el valor es un enlace; cuando
                 no lo hay, se muestra el estado y no se fabrica un link. */
              const href = step.key === 'cid' ? links.ipfs
                : step.key === 'chain' ? links.tx
                  : null;
              const valueClass = `trace-step-value${MONO_STEPS.has(step.key) ? ' trace-step-value--mono' : ''}${pending ? ' trace-step-value--pending' : ''}`;

              return (
                <li key={step.key} className="trace-step">
                  <div className="trace-step-marker" style={{ color: s.color }}>
                    <span className="trace-step-num">{step.step}</span>
                  </div>
                  <div className="trace-step-body">
                    <div className="trace-step-label">{step.label}</div>
                    {href ? (
                      <a
                        className={`${valueClass} trace-step-value--link`}
                        href={href}
                        target="_blank"
                        rel="noreferrer noopener"
                        title={`Abrir en ${step.key === 'cid' ? 'IPFS' : links.explorer}`}
                      >
                        {step.value}
                        <span className="trace-step-out" aria-hidden="true">↗</span>
                        <span className="sr-only">
                          {` · se abre en ${step.key === 'cid' ? 'el gateway de IPFS' : links.explorer}`}
                        </span>
                      </a>
                    ) : (
                      <div
                        className={valueClass}
                        title={typeof step.value === 'string' ? step.value : undefined}
                      >
                        {step.value ?? (step.key === 'chain' ? proofLabel(links.proof) : 'Pendiente de anclaje')}
                      </div>
                    )}
                  </div>
                  <StatusChip
                    status={step.status}
                    label={step.key === 'chain' && links.proof === PROOF_STATE.TX_UNCONFIRMED
                      ? 'TX REGISTRADA'
                      : undefined}
                  />
                </li>
              );
            })}
          </ol>

          {/* El estado intermedio que describió Martín: hay transacción, falta
              que el Sync incorpore bloque y timestamp. No es "sin anclar". */}
          {links.proof === PROOF_STATE.TX_UNCONFIRMED && (
            <p className="mod-scaffold-note">
              La transacción está registrada en {action.anchor.network ?? links.explorer} y se
              puede abrir en {links.explorer}. Lo que todavía no llegó al Sync es la
              confirmación enriquecida —número de bloque y timestamp—, así que el paso figura
              como registrado y no como confirmado.
            </p>
          )}
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
  /* Sólo las acciones de energía tienen período de facturación. El resto ni
     siquiera declara `consumption`, así que se pregunta antes de leerlo. */
  const c = action.consumption ?? null;

  return (
    <div className="dash-card prov-note">
      <div className="dash-nav-group-label">Procedencia de los datos</div>
      <ul className="mod-scaffold-list">
        <li>
          Todos los valores de esta ficha salen del <code>dashboard_sync</code> de la acción.
          El frontend no recalcula ninguno.
        </li>
        {derived.length > 0 && (
          <li>
            Reconstruidos desde las series del piloto{c ? ` (precisión ≈ ±0.15 ${c.unit})` : ''}:{' '}
            {derived.join(', ')}.
          </li>
        )}
        {unknown.length > 0 && (
          <li>
            Sin dato cargado todavía: {unknown.join(', ')}. Se muestran como pendientes en lugar
            de completarse con un valor estimado.
          </li>
        )}
        {c && c.periodDays === null && (
          <li>
            Los días del período de facturación no están cargados, así que el consumo total en{' '}
            {c.unit.split('/')[0]} no se puede calcular todavía.
          </li>
        )}
        {c && c.periodDays !== null && (
          <li>
            Período de {c.periodDays} días · {c.totalKwh} kWh totales, según la factura.
          </li>
        )}
        {action.measurementStatus === 'user_measured_with_evidence' && (
          <li>
            El peso lo midió el usuario y lo respaldó con evidencia. No es una medición
            instrumental y se declara así.
          </li>
        )}
      </ul>
    </div>
  );
}
