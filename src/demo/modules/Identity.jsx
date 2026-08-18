import { useMemo } from 'react';
import { useNode } from '../components/useNode';
import { sesHistory } from '../data/impact';
import { actionsForNode } from '../data/actions';
import { dashboardKeyOf } from '../data/sustainNodes';
import Sparkline from '../components/Sparkline';
import StatusChip from '../components/StatusChip';
import { STEP_STATUS } from '../data/actions';
import { moduleHref } from '../data/nodeTypes';
import { Link } from 'react-router-dom';
import * as M from '../data/montessori/index.js';

/**
 * § 6 del brief + Entregable 3 § 4.9 — Environmental Identity.
 *
 * Perfil ambiental del nodo: score SES con su historial, badges e identidad
 * verificable. Lo más útil del módulo es la reconciliación del score: expone la
 * diferencia entre lo declarado y lo que suman las acciones cargadas, que es
 * justamente lo que hay que cerrar con el dato real.
 *
 * El § 4.9 pide separar visualmente dos cosas que se parecen y no son lo mismo:
 * la **identidad verificable Sustain** (SES, badges, anclaje) y la
 * **trayectoria documentada** de la institución. Importar historia previa no
 * otorga SES, así que las dos no pueden compartir el mismo bloque ni sumar
 * al mismo número.
 */

/** El score declarado vive en distintos lugares según el tipo de nodo. */
function declaredScore(data) {
  if (typeof data?.sesScore === 'number') return data.sesScore;
  const stat = (data?.stats ?? []).find((s) => /SES/i.test(s.label));
  const n = stat ? Number(String(stat.value).replace(/[^\d.-]/g, '')) : NaN;
  return Number.isFinite(n) ? n : null;
}

export default function Identity() {
  const { node, routeSegment } = useNode();
  const data = node.data;
  const nodeKey = dashboardKeyOf(node);
  const hasHistory = nodeKey === 'montessori';

  // eslint-disable-next-line react-hooks/exhaustive-deps -- ídem
  const history = useMemo(() => sesHistory(node), [dashboardKeyOf(node)]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- ver MisAcciones
  const actions = useMemo(() => actionsForNode(node), [dashboardKeyOf(node)]);

  const declared = declaredScore(data);
  const known = history.filter((h) => h.known);
  const unknown = history.filter((h) => !h.known);
  const knownSum = known.reduce((s, h) => s + h.delta, 0);
  const gap = declared !== null ? declared - knownSum : null;

  const badges = data?.badges ?? [];

  return (
    <>
      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Identidad ambiental</span>
          <span className="act-count">{node.name}</span>
        </div>

        <div className="idt-hero">
          <div className="idt-score">
            <div className="idt-score-label">Puntaje SES</div>
            <div className="idt-score-value">{declared ?? '—'}</div>
            <div className="idt-score-sub">
              {data?.sesLevel ?? `${actions.length} acciones verificadas`}
            </div>
          </div>

          {history.length > 1 && (
            <div className="idt-chart">
              <div className="dash-nav-group-label">Evolución del SES acumulado</div>
              <Sparkline
                height={64}
                series={[{
                  label: 'SES acumulado',
                  color: '#29DDF5',
                  values: history.map((h) => h.accumulated),
                }]}
                label="Evolución del puntaje SES acumulado"
              />
              <div className="idt-chart-axis">
                <span>{history[0].label}</span>
                <span>{history[history.length - 1].label}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {gap !== null && unknown.length > 0 && (
        <div className="dash-card prov-note">
          <div className="dash-nav-group-label">Reconciliación del puntaje</div>
          <div className="mod-scaffold-stats" style={{ borderBottom: 0, paddingTop: 8 }}>
            <div className="mod-scaffold-stat">
              <div className="mod-scaffold-stat-value">{declared}</div>
              <div className="mod-scaffold-stat-label">Declarado por el pipeline</div>
            </div>
            <div className="mod-scaffold-stat">
              <div className="mod-scaffold-stat-value">{knownSum > 0 ? `+${knownSum}` : knownSum}</div>
              <div className="mod-scaffold-stat-label">Suma de las {known.length} acciones con SES</div>
            </div>
            <div className="mod-scaffold-stat">
              <div className="mod-scaffold-stat-value" style={{ color: 'var(--amber-600)' }}>
                {gap > 0 ? `+${gap}` : gap}
              </div>
              <div className="mod-scaffold-stat-label">Diferencia a explicar</div>
            </div>
          </div>
          <ul className="mod-scaffold-list">
            <li>
              Hay {unknown.length} acciones sin SES cargado ({unknown.map((u) => u.label).join(' y ')}).
              Si el puntaje es la suma histórica, esas dos tienen que sumar{' '}
              <strong>{gap > 0 ? `+${gap}` : gap}</strong> entre ambas.
            </li>
            <li>
              Es una restricción verificable: al cargar los <code>ses_score.json</code> reales, los
              valores deberían cumplirla. Si no la cumplen, el puntaje no es una suma histórica sino
              un score por período, y hay que confirmar la regla de agregación.
            </li>
          </ul>
        </div>
      )}

      {hasHistory && <InstitutionalTrajectory node={node} routeSegment={routeSegment} />}

      <div className="idt-grid">
        <div className="dash-card">
          <div className="dash-section-header">
            <span className="dash-section-title">Badges obtenidos</span>
            <span className="act-count">{badges.length}</span>
          </div>
          {badges.length ? badges.map((b, i) => (
            <div key={`${b.name}-${i}`} className="idt-badge">
              <span className="idt-badge-mark" style={{ background: `${b.color}18`, color: b.color }}>
                {b.icon ?? '★'}
              </span>
              <span className="idt-badge-info">
                <span className="idt-badge-name">{b.name}</span>
                <span className="idt-badge-date">{b.date ?? (b.earned ? 'Obtenido' : 'Pendiente')}</span>
              </span>
            </div>
          )) : <p className="dash-table-empty">Todavía no hay badges.</p>}
        </div>

        <div className="dash-card">
          <div className="dash-section-header">
            <span className="dash-section-title">Historial del SES</span>
            <span className="act-count">{history.length} acciones</span>
          </div>
          {history.slice().reverse().map((h) => (
            <div key={h.id} className="idt-hist">
              <span className="idt-hist-date">{h.label}</span>
              <span className={`ses-delta ${h.known ? (h.delta > 0 ? 'ses-delta--up' : h.delta < 0 ? 'ses-delta--down' : 'ses-delta--flat') : 'ses-delta--unknown'}`}>
                {h.known ? (h.delta > 0 ? `+${h.delta}` : h.delta) : 'Pendiente'}
              </span>
              <span className="idt-hist-acc">{h.accumulated}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Identidad verificable</span>
        </div>
        <dl className="dr-meta">
          <div>
            <dt>Nodo</dt>
            <dd className="idt-mono">{actions[0]?.nodeId ?? '—'}</dd>
          </div>
          <div>
            <dt>Contrato</dt>
            <dd className="idt-mono">{data?.audit?.contract ?? '—'}</dd>
          </div>
          <div>
            <dt>Red</dt>
            <dd>
              <StatusChip
                status={data?.audit?.tx && !/pendiente/i.test(String(data.audit.tx))
                  ? STEP_STATUS.COMPLETE
                  : STEP_STATUS.PENDING}
                label={data?.audit?.blockchain ?? 'Pendiente de anclaje'}
              />
            </dd>
          </div>
        </dl>
        <p className="mod-scaffold-note">
          La identidad del nodo existe y es estable; lo que todavía no está es su anclaje público
          en blockchain. Hasta que ocurra, la verificación es contra el hash local.
        </p>
      </div>
    </>
  );
}

/**
 * Trayectoria documentada de la institución — § 4.9.
 *
 * Va aparte del bloque de SES y lo dice explícitamente: nada de esto otorga
 * puntaje. Es antigüedad, programas, categorías con actividad, indicadores,
 * evidencias y frameworks — la historia que la escuela trae de antes de
 * Sustain.
 */
function InstitutionalTrajectory({ node, routeSegment }) {
  const t = node.data.trajectory;
  const desde = node.data.historicalDataStart?.slice(0, 4);
  const anios = desde ? new Date().getFullYear() - Number(desde) : null;

  const categorias = useMemo(() => {
    const set = new Set();
    for (const i of M.indicatorDefinitions) {
      if (M.indicatorTotal(i.indicator_id)) set.add(i.category);
    }
    return [...set];
  }, []);

  const orgHref = moduleHref(node.nodeTypeId, node.slug, 'instituciones', routeSegment);
  const tlHref = moduleHref(node.nodeTypeId, node.slug, 'timeline', routeSegment);

  return (
    <div className="dash-card idt-trajectory">
      <div className="dash-section-header">
        <span className="dash-section-title">Trayectoria institucional documentada</span>
        <span className="inst-origin-badge">No otorga SES</span>
      </div>

      <p className="inst-trajectory-lead">
        {anios !== null && `${anios} años de actividad ambiental registrada. `}
        Información incorporada desde el expediente institucional, anterior a Sustain.
      </p>

      <dl className="inst-trajectory-grid">
        <div><dt>Antigüedad</dt><dd>{desde ?? '—'}</dd></div>
        <div><dt>Programas</dt><dd>{t.programs}</dd></div>
        <div><dt>Categorías activas</dt><dd>{categorias.length}</dd></div>
        <div><dt>Indicadores</dt><dd>{t.indicators}</dd></div>
        <div><dt>Evidencias</dt><dd>{t.evidence}</dd></div>
        <div><dt>Frameworks</dt><dd>{t.frameworks}</dd></div>
      </dl>

      <div className="idt-traj-links">
        {tlHref && <Link to={tlHref} className="idt-traj-link">Ver cronología →</Link>}
        {orgHref && <Link to={orgHref} className="idt-traj-link">Ver perfil institucional →</Link>}
      </div>

      <p className="mod-scaffold-note">
        Importar la historia previa de la institución no modifica su puntaje SES. El score
        de arriba mide sólo acciones que pasaron el pipeline de verificación; esto mide
        cuánto viene haciendo la escuela desde antes.
      </p>
    </div>
  );
}
