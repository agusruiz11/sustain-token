import { useMemo } from 'react';
import { useNode } from '../components/useNode';
import { categoryCoverage, coverageSummary, unmappedPilotModules, COVERAGE, COVERAGE_STYLE } from '../data/impact';
import { dashboardKeyOf } from '../data/sustainNodes';
import { MEASUREMENT } from '../data/categories';
import Sparkline from '../components/Sparkline';

/**
 * § 4 del brief — Impact Dashboard.
 *
 * Las 13 categorías cruzadas con su estado real en el nodo. Sólo Energía tiene
 * datos; el resto muestra qué le falta. Ver la nota en data/impact.js: pintar 13
 * tarjetas con números sería inventar 12 de ellas.
 */
export default function Impacto() {
  const { node } = useNode();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- la clave del nodo es estable; `node` se recrea en cada render
  const rows = useMemo(() => categoryCoverage(node), [dashboardKeyOf(node)]);
  const summary = useMemo(() => coverageSummary(rows), [rows]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- ídem
  const unmapped = useMemo(() => unmappedPilotModules(node), [dashboardKeyOf(node)]);

  return (
    <>
      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Cobertura de categorías</span>
          <span className="act-count">{summary.active} de {summary.total} con datos reales</span>
        </div>
        <div className="mod-scaffold-stats" style={{ borderBottom: 0, paddingTop: 0 }}>
          {[
            [COVERAGE.ACTIVE, summary.active],
            [COVERAGE.LOADING, summary.loading],
            [COVERAGE.PENDING, summary.pending],
            [COVERAGE.OUT_OF_SCOPE, summary.out],
          ].map(([key, n]) => (
            <div key={key} className="mod-scaffold-stat">
              <div className="mod-scaffold-stat-value" style={{ color: COVERAGE_STYLE[key].color }}>{n}</div>
              <div className="mod-scaffold-stat-label">{COVERAGE_STYLE[key].label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="imp-grid">
        {rows.map(({ category, coverage, note, metrics }) => (
          <CategoryCard
            key={category.id}
            category={category}
            coverage={coverage}
            note={note}
            metrics={metrics}
          />
        ))}
      </div>

      {unmapped.length > 0 && (
        <div className="dash-card prov-note">
          <div className="dash-nav-group-label">Fuera de la taxonomía del brief</div>
          <ul className="mod-scaffold-list">
            {unmapped.map((m) => (
              <li key={m.name}>
                <strong>{m.name}</strong> figura en el piloto pero no es una de las 13 categorías
                del brief. {m.metric}
              </li>
            ))}
            <li>
              Hay que definir si se suma como categoría propia o si se absorbe dentro de una
              existente. Hasta entonces no se agrega a la taxonomía para no inventar estructura.
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

function CategoryCard({ category, coverage, note, metrics }) {
  const style = COVERAGE_STYLE[coverage];
  const isReduction = category.measurement === MEASUREMENT.REDUCTION;
  const dim = coverage === COVERAGE.PENDING || coverage === COVERAGE.OUT_OF_SCOPE;

  return (
    <article className={`dash-card imp-card${dim ? ' imp-card--dim' : ''}`}>
      <header className="imp-card-head">
        <span
          className="imp-card-icon"
          style={{ background: `${category.color}18`, color: category.color }}
          aria-hidden="true"
        >
          {category.icon}
        </span>
        <span className="imp-card-titles">
          <span className="imp-card-name">{category.name}</span>
          <span className="imp-card-kind">
            {isReduction ? 'vs. línea base' : 'cantidad aportada'}
          </span>
        </span>
        <span
          className="imp-card-status"
          style={{ background: `${style.color}15`, border: `1px solid ${style.color}40`, color: style.color }}
        >
          {style.label}
        </span>
      </header>

      {metrics ? (
        <>
          <div className="imp-card-metrics">
            <div className="imp-metric">
              <span className="imp-metric-value">{metrics.actions}</span>
              <span className="imp-metric-label">acciones</span>
            </div>
            <div className="imp-metric">
              <span className="imp-metric-value">{metrics.savedPerDay}</span>
              <span className="imp-metric-label">{metrics.unit} ahorrados</span>
            </div>
            {metrics.bestReductionPct !== null && (
              <div className="imp-metric">
                <span className="imp-metric-value" style={{ color: 'var(--green-600)' }}>
                  {metrics.bestReductionPct}%
                </span>
                <span className="imp-metric-label">mejor reducción</span>
              </div>
            )}
          </div>
          <Sparkline
            series={metrics.series}
            label={`${category.name}: consumo real contra línea base`}
          />
          <div className="imp-legend">
            {metrics.series.map((s) => (
              <span key={s.label} className="imp-legend-item">
                <span
                  className="imp-legend-mark"
                  style={{ background: s.dashed ? 'transparent' : s.color, borderColor: s.color }}
                />
                {s.label}
              </span>
            ))}
          </div>
        </>
      ) : (
        <p className="imp-card-note">{note}</p>
      )}
    </article>
  );
}
