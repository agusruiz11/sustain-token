import { useSearchParams } from 'react-router-dom';
import {
  MOBILITY_ACTIONS, MOBILITY_TOTALS, MOBILITY_MODULE, CARBON_METHODOLOGY,
  ANCHOR_STATE, SES_POLICY, getTrip, validationChecks,
} from '../data/mobility';
import DataTable from '../components/DataTable';

/**
 * Módulo Movilidad — handoff del 13 ago 2026.
 *
 * Mobility Overview + las 5 acciones + detalle, que es lo que Martín pidió
 * como mínimo entregable.
 *
 * Tres reglas del brief que definen esta pantalla:
 *
 *   1. **No recalcular.** Todos los números salen del dashboard_sync tal cual.
 *      Ni los km, ni el CO₂e, ni el SES se derivan acá.
 *   2. **Agnóstico al proveedor.** Strava aparece como valor de un campo, nunca
 *      como condición en el código. La misma vista sirve para Garmin o un GPX.
 *   3. **Anclaje DEMO.** No hay CID ni transacción reales, y no se fabrican. Lo
 *      que sí es real y se muestra como tal es el SHA-256 de cada evidencia.
 */
export default function Movilidad() {
  const [params, setParams] = useSearchParams();
  const tripId = params.get('trip');

  if (tripId) {
    const trip = getTrip(tripId);
    if (trip) return <TripDetail trip={trip} onBack={() => setParams({})} />;
  }

  return (
    <>
      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Mobility Overview</span>
          <span className="act-count">
            {MOBILITY_MODULE.standard} v{MOBILITY_MODULE.version}
          </span>
        </div>
        <div className="dash-stats-grid">
          <Kpi value={`${MOBILITY_TOTALS.verifiedDistanceKm} km`} label="Distancia verificada" sub="Bicicleta mecánica" />
          <Kpi value={MOBILITY_TOTALS.actions} label="Acciones de movilidad" sub={`${MOBILITY_TOTALS.mrvClass.replace('_', ' · ')}`} />
          <Kpi
            value={`${MOBILITY_TOTALS.estimatedCo2eAvoidedKg} kg`}
            label="CO₂e evitado"
            sub="Estimación modelada, no medición"
            accent="#E8BEE0"
          />
          <Kpi
            value={MOBILITY_TOTALS.sesTo}
            label="SES del nodo"
            sub={`${MOBILITY_TOTALS.sesFrom} → ${MOBILITY_TOTALS.sesTo} en el módulo`}
          />
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Acciones verificadas</span>
          <span className="act-count">{MOBILITY_ACTIONS.length} viajes</span>
        </div>
        <DataTable
          columns={[
            {
              key: 'date', label: 'Fecha', width: '150px',
              render: (t) => (
                <span className="org-name-stack">
                  <span className="org-name-text">{t.date}</span>
                  <span className="org-detail">{t.timeLabel} · {t.city}</span>
                </span>
              ),
            },
            {
              key: 'provider', label: 'Fuente', width: '120px',
              render: (t) => <span className="mob-provider">{t.sourceProvider}</span>,
            },
            { key: 'mode', label: 'Modo', width: '150px', render: (t) => t.transportModeLabel },
            {
              key: 'dist', label: 'Distancia', align: 'right', width: '110px',
              render: (t) => <span className="idt-mono">{t.distanceKm} km</span>,
            },
            { key: 'dur', label: 'Duración', align: 'right', width: '100px', render: (t) => t.durationLabel },
            {
              key: 'mrv', label: 'MRV', width: '120px',
              render: () => <span className="mob-mrv">MRV-M1</span>,
            },
            {
              key: 'co2', label: 'CO₂e est.', align: 'right', width: '110px',
              render: (t) => <span className="idt-mono">{t.co2eAvoidedKg} kg</span>,
            },
            {
              key: 'ses', label: 'SES', align: 'right', width: '110px',
              render: (t) => t.isGenesis
                ? <span className="mob-genesis">Genesis · 0</span>
                : <span className="ses-delta ses-delta--up">+{t.sesDelta}</span>,
            },
            {
              key: 'anchor', label: 'Anclaje', align: 'right', width: '120px',
              render: () => <span className="mob-demo">DEMO</span>,
            },
          ]}
          rows={MOBILITY_ACTIONS}
          rowKey={(t) => t.id}
          rowAction={(t) => setParams({ trip: t.id })}
          caption="Viajes verificados del módulo de movilidad"
        />
        <p className="inst-trajectory-note">
          El primer viaje crea el Genesis Baseline de la categoría y por eso recibe SES 0.
          Click en una fila para ver la evidencia y la trazabilidad.
        </p>
      </div>

      <CarbonPanel />
      <AnchorPanel />
    </>
  );
}

const Kpi = ({ value, label, sub, accent }) => (
  <div className="dash-stat-card">
    <div className="dash-stat-card-top">
      <div className="dash-stat-card-label">{label}</div>
    </div>
    <div className="dash-stat-card-value" style={accent ? { color: accent } : undefined}>{value}</div>
    <div className="dash-stat-card-delta dash-stat-card-delta--neutral">{sub}</div>
  </div>
);

/* ── Detalle de viaje ────────────────────────────────────────── */

function TripDetail({ trip, onBack }) {
  const checks = validationChecks(trip);

  return (
    <>
      <div className="dash-card">
        <button type="button" className="inst-back" onClick={onBack}>← Volver a Movilidad</button>

        <div className="dash-section-header">
          <span className="dash-section-title">
            Movilidad verificada · {trip.distanceKm} km
          </span>
          <span className="act-count">{trip.date} · {trip.timeLabel}</span>
        </div>

        <div className="mob-detail">
          <div className="mob-evidence">
            <div className="dash-nav-group-label">Evidencia primaria</div>
            {/* La captura real del paquete. Su SHA-256 se verificó contra el
                archivo, así que la integridad que dice la ficha es comprobable. */}
            <img
              src={trip.evidence}
              alt={`Actividad registrada el ${trip.date}: ${trip.distanceKm} km en ${trip.durationLabel}`}
              className="mob-evidence-img"
              loading="lazy"
            />
            <p className="mob-evidence-meta">
              Captura de {trip.sourceProvider} · privacidad {trip.privacyMode}
            </p>
          </div>

          <div className="mob-facts">
            <dl className="udash-node-facts">
              <div><dt>Action ID</dt><dd className="udash-node-mono">{trip.id}</dd></div>
              <div><dt>Modo</dt><dd>{trip.transportModeLabel}</dd></div>
              <div><dt>Distancia</dt><dd>{trip.distanceKm} km</dd></div>
              <div><dt>Duración</dt><dd>{trip.durationLabel}</dd></div>
              <div><dt>Velocidad media</dt><dd>{trip.avgSpeedKmh.toFixed(1)} km/h</dd></div>
              {trip.maxSpeedKmh && (
                <div><dt>Velocidad máxima</dt><dd>{trip.maxSpeedKmh} km/h</dd></div>
              )}
              <div><dt>Desnivel positivo</dt><dd>{trip.positiveElevationM} m</dd></div>
              <div><dt>Clase MRV</dt><dd>{trip.mrvClass.replace('_', ' · ')}</dd></div>
              <div><dt>Profundidad</dt><dd>{trip.verificationDepth}</dd></div>
              <div>
                <dt>CO₂e evitado</dt>
                <dd>{trip.co2eAvoidedKg} kg <small>estimado</small></dd>
              </div>
              <div>
                <dt>SES</dt>
                <dd>
                  {trip.isGenesis
                    ? `Genesis Baseline · delta 0 · score ${trip.sesAfter}`
                    : `${trip.sesBefore} → ${trip.sesAfter} (+${trip.sesDelta})`}
                </dd>
              </div>
              <div>
                <dt>Fuente</dt>
                <dd>
                  {trip.sourceLink
                    ? <a href={trip.sourceLink} target="_blank" rel="noreferrer" className="idt-traj-link">Actividad original ↗</a>
                    : `${trip.sourceProvider} · sin link público`}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Controles de validación</span>
          <span className="act-count">
            {checks.filter((c) => c.pass).length} de {checks.length}
          </span>
        </div>
        <ul className="mob-checks">
          {checks.map((c) => (
            <li key={c.label} className={c.pass ? 'ok' : 'no'}>
              <span aria-hidden="true">{c.pass ? '✓' : '✕'}</span> {c.label}
            </li>
          ))}
        </ul>
        <p className="mod-scaffold-note">
          El último control está en negativo a propósito: MRV-M1 significa evidencia
          respaldada, no verificación directa contra la API del proveedor. Declararlo es la
          diferencia entre este nivel y uno superior.
        </p>
      </div>

      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Integridad y trazabilidad</span>
          <span className="mob-demo">Anclaje DEMO</span>
        </div>
        <dl className="dr-meta">
          <div>
            <dt>SHA-256 de la evidencia</dt>
            <dd><code className="aud-hash">{trip.sha256}</code></dd>
          </div>
          <div>
            <dt>Hash del paquete</dt>
            <dd><code className="aud-hash">{trip.packageHash}</code></dd>
          </div>
          <div><dt>CID IPFS</dt><dd className="dash-audit-val--pending">Pendiente de anclaje</dd></div>
          <div><dt>Transacción</dt><dd className="dash-audit-val--pending">Pendiente de anclaje</dd></div>
          <div><dt>Red</dt><dd>{ANCHOR_STATE.network} · chain {ANCHOR_STATE.chainId}</dd></div>
          <div><dt>Contrato</dt><dd className="udash-node-mono">{ANCHOR_STATE.contract}</dd></div>
        </dl>
        <p className="mod-scaffold-note">
          Los dos hashes son reales y verificables contra el archivo. El CID y la
          transacción no existen todavía: el anclaje no se ejecutó. No se muestran
          identificadores fabricados.
        </p>
      </div>
    </>
  );
}

/* ── Paneles compartidos ─────────────────────────────────────── */

function CarbonPanel() {
  const m = CARBON_METHODOLOGY;
  return (
    <div className="dash-card">
      <div className="dash-section-header">
        <span className="dash-section-title">Metodología de carbono</span>
        <span className="act-count">{m.id} v{m.version}</span>
      </div>

      <p className="inst-trajectory-lead">
        <strong>{m.formula}</strong> — referencia {m.referenceFactorLabel} ({m.referenceMode}),
        fuente {m.sourceFamily}. {m.antiInflationRule}.
      </p>

      <DataTable
        columns={[
          {
            key: 'mode', label: 'Modo / referencia',
            render: (f) => f.isBaseline ? <strong>{f.mode}</strong> : f.mode,
          },
          { key: 'factor', label: 'Factor', align: 'right', width: '150px' },
          { key: 'note', label: 'Lectura Sustain', align: 'right' },
        ]}
        rows={m.factors}
        rowKey={(f) => f.mode}
        caption="Factores de referencia"
      />

      <div className="mob-limits">
        <div className="dash-nav-group-label">Limitaciones declaradas</div>
        <ul className="mod-scaffold-list">
          {m.limitations.map((l) => <li key={l}>{l}</li>)}
        </ul>
      </div>

      <p className="mod-scaffold-note">
        <strong>{m.resultType}.</strong> La metodología institucional existe como campo pero
        está deshabilitada: {m.institutional.note.toLowerCase()}
      </p>
    </div>
  );
}

function AnchorPanel() {
  return (
    <div className="dash-card prov-note">
      <div className="dash-nav-group-label">Estado del piloto</div>
      <ul className="mod-scaffold-list">
        <li>
          <strong>Anclaje:</strong> {ANCHOR_STATE.warning}
        </li>
        <li>
          <strong>Proveedor:</strong> {MOBILITY_MODULE.sourceProviderCurrentPilot} es la fuente
          de evidencia de este piloto, no una dependencia del producto. El modelo de datos
          normaliza distancia, duración, modo y hash de evidencia, así que otro proveedor
          —Garmin, Apple Health, un GPX o una API institucional— entra sin cambios de UI.
        </li>
        <li>
          <strong>Score:</strong> política {SES_POLICY.name}, modo {SES_POLICY.mode} sin
          recompensa. Topes: {SES_POLICY.caps.perTrip} por viaje, {SES_POLICY.caps.perDay} por
          día, {SES_POLICY.caps.rolling30d} cada 30 días y {SES_POLICY.caps.historicalContribution} de
          contribución histórica.
        </li>
      </ul>
    </div>
  );
}
