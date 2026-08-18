import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNode } from '../components/useNode';
import { categoryCoverage, coverageSummary, unmappedPilotModules, COVERAGE, COVERAGE_STYLE } from '../data/impact';
import { dashboardKeyOf } from '../data/sustainNodes';
import { MEASUREMENT } from '../data/categories';
import Sparkline from '../components/Sparkline';
import DataTable from '../components/DataTable';
import { indicatorDetail, qualityLabel, verificationLabel } from '../data/montessori/index.js';

/**
 * § 4 del brief + Entregable 3 § 4.5 — Impact Dashboard.
 *
 * Las 13 categorías cruzadas con el estado real del nodo. Pintar 13 tarjetas
 * con números sería inventar la mayoría, así que cada una muestra qué mide o
 * qué le falta.
 *
 * Lo que agrega el § 4.5:
 *
 *   · **Procedencia por KPI.** Medido / Calculado / Reportado / Histórico
 *     documental / Verificado Sustain. Un total del expediente y uno que pasó
 *     el pipeline no pueden verse igual aunque los dos tengan número.
 *   · **Series históricas** aunque no generen SES, distinguidas de las
 *     verificadas: sin línea base, porque el histórico no la tiene.
 *   · **Taxonomía configurable**: las categorías se resuelven por el mapeo de
 *     la capa canónica, no por una lista rígida en el componente.
 *   · **needs_review fuera de los KPI públicos** (IR-006), diciendo cuántas
 *     mediciones quedaron afuera en vez de descontarlas en silencio.
 */
export default function Impacto() {
  const { node } = useNode();
  const [params, setParams] = useSearchParams();
  const indicatorId = params.get('ind');

  // eslint-disable-next-line react-hooks/exhaustive-deps -- la clave del nodo es estable; `node` se recrea en cada render
  const rows = useMemo(() => categoryCoverage(node), [dashboardKeyOf(node)]);
  const summary = useMemo(() => coverageSummary(rows), [rows]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- ídem
  const unmapped = useMemo(() => unmappedPilotModules(node), [dashboardKeyOf(node)]);

  if (indicatorId) {
    return <IndicatorDetail id={indicatorId} onBack={() => setParams({})} />;
  }

  const conNumero = summary.active + summary.historical;

  return (
    <>
      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Cobertura de categorías</span>
          <span className="act-count">{conNumero} de {summary.total} con datos</span>
        </div>
        <div className="mod-scaffold-stats" style={{ borderBottom: 0, paddingTop: 0 }}>
          {[
            [COVERAGE.ACTIVE, summary.active],
            [COVERAGE.HISTORICAL, summary.historical],
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
        {rows.map((row) => (
          <CategoryCard
            key={row.category.id}
            {...row}
            onOpen={(id) => setParams({ ind: id })}
          />
        ))}
      </div>

      {unmapped.length > 0 && (
        <div className="dash-card prov-note">
          <div className="dash-nav-group-label">Fuera de la taxonomía Sustain</div>
          <ul className="mod-scaffold-list">
            {unmapped.map((m) => (
              <li key={m.name}>
                <strong>{m.name}</strong> — {m.metric}
              </li>
            ))}
            <li>
              El Entregable 3 § 4.5 pide no crearles categoría Sustain propia por defecto.
              Quedan como trayectoria institucional hasta definir la taxonomía definitiva.
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

function CategoryCard({ category, coverage, note, metrics, indicators, indicatorsWithData, onOpen }) {
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
            {metrics
              ? (isReduction ? 'vs. línea base' : 'cantidad aportada')
              : indicators?.length
                ? `${indicatorsWithData} de ${indicators.length} indicadores con total`
                : (isReduction ? 'vs. línea base' : 'cantidad aportada')}
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
        <SustainMetrics category={category} metrics={metrics} />
      ) : indicators?.length ? (
        <ul className="imp-ind-list">
          {indicators.map((i) => (
            <li key={i.indicatorId}>
              <button type="button" className="imp-ind" onClick={() => onOpen(i.indicatorId)}>
                <span className="imp-ind-main">
                  <span className="imp-ind-name">{i.name}</span>
                  <span className="imp-ind-prov">
                    {i.provenance.map((p) => (
                      <span
                        key={p.id}
                        className="imp-prov-chip"
                        style={{ background: `${p.color}15`, border: `1px solid ${p.color}40`, color: p.color }}
                      >
                        {p.label}{i.provenance.length > 1 ? ` ·${p.n}` : ''}
                      </span>
                    ))}
                  </span>
                </span>
                <span className="imp-ind-value">
                  {i.total
                    ? <>{i.total.value} <small>{i.unit}</small></>
                    : <span className="trace-step-value--pending">en revisión</span>}
                </span>
              </button>
              {i.excluded > 0 && (
                <p className="imp-ind-excl">
                  {i.excluded} de {i.measured} mediciones fuera del KPI público
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="imp-card-note">{note}</p>
      )}
    </article>
  );
}

/** Categoría con acciones verificadas: consumo real contra línea base. */
function SustainMetrics({ category, metrics }) {
  return (
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
  );
}

/**
 * Detalle de un indicador — § 4.5: «KPI => detalle del indicador, serie y
 * evidencias/fuentes».
 *
 * Cada medición con su período, su fuente y su procedencia, y si cuenta o no
 * para el KPI público. Es la trazabilidad que pide el § 4.7: desde un número
 * agregado hasta la fila del expediente que lo respalda.
 */
function IndicatorDetail({ id, onBack }) {
  const detail = useMemo(() => indicatorDetail(id), [id]);

  if (!detail) {
    return (
      <div className="dash-card">
        <button type="button" className="inst-back" onClick={onBack}>← Volver a categorías</button>
        <p className="dash-table-empty">Indicador no encontrado.</p>
      </div>
    );
  }

  const { indicator, total, rows } = detail;
  const excluded = rows.filter((r) => !r.countsForKpi);

  return (
    <div className="dash-card">
      <button type="button" className="inst-back" onClick={onBack}>← Volver a categorías</button>

      <div className="dash-section-header">
        <span className="dash-section-title">{indicator.name}</span>
        <span className="act-count">
          {total ? `${total.value} ${indicator.unit}` : 'Sin total apto'}
        </span>
      </div>

      <dl className="udash-node-facts">
        <div><dt>Categoría</dt><dd>{indicator.category}</dd></div>
        <div><dt>Unidad</dt><dd>{indicator.unit}</dd></div>
        <div>
          <dt>Agregación</dt>
          <dd>{indicator.aggregation_method === 'latest' ? 'Último valor' : 'Suma del período'}</dd>
        </div>
        <div><dt>Mediciones</dt><dd>{rows.length} · {excluded.length} fuera del KPI</dd></div>
      </dl>

      <DataTable
        columns={[
          {
            key: 'period', label: 'Período', width: '190px',
            render: (m) => `${m.period_start ?? '—'} → ${m.period_end ?? '—'}`,
          },
          {
            key: 'value', label: 'Valor', align: 'right', width: '120px',
            render: (m) => <span className="idt-mono">{m.value} {m.unit}</span>,
          },
          {
            key: 'prov', label: 'Procedencia', width: '170px',
            render: (m) => (
              <span
                className="imp-prov-chip"
                style={{ background: `${m.provenance.color}15`, border: `1px solid ${m.provenance.color}40`, color: m.provenance.color }}
              >
                {m.provenance.label}
              </span>
            ),
          },
          {
            key: 'quality', label: 'Calidad', width: '150px',
            render: (m) => m.countsForKpi
              ? qualityLabel(m.quality_status)
              : <span className="trace-step-value--pending">{qualityLabel(m.quality_status)}</span>,
          },
          {
            key: 'verif', label: 'Verificación', width: '150px',
            render: (m) => verificationLabel(m.verification_status),
          },
          {
            key: 'source', label: 'Fuente', align: 'right',
            render: (m) => <span className="arch-ref">{m.source_reference}</span>,
          },
        ]}
        rows={rows}
        rowKey={(m) => m.measurement_id}
        caption={`Mediciones de ${indicator.name}`}
      />

      <p className="mod-scaffold-note">
        {excluded.length === 0
          ? 'Todas las mediciones cuentan para el KPI público.'
          : `${excluded.length} mediciones están en revisión y no alimentan el KPI público (IR-006). Siguen en el sistema y son auditables; el total se recalcula solo cuando la institución confirme los valores.`}
      </p>
    </div>
  );
}
