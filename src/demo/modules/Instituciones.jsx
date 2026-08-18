import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNode } from '../components/useNode';
import { getNodeType } from '../data/nodeTypes';
import { getOrganization, flattenUnits, countUnits, meteredUnits, ORG_EXAMPLE_NOTICE } from '../data/organization';
import { dashboardKeyOf } from '../data/sustainNodes';
import { STEP_STATUS } from '../data/actions';
import DataTable from '../components/DataTable';
import StatusChip from '../components/StatusChip';
import * as M from '../data/montessori/index.js';

/**
 * § 8 del brief + Entregable 3 § 4.8 — «MODIFICAR FUERTE».
 *
 * Pasa de ser un árbol de unidades a un perfil institucional ambiental con las
 * 7 subsecciones que pide el spec: Perfil, Estructura, Responsables, Programas,
 * Proyectos, Indicadores y Frameworks.
 *
 * La nomenclatura de los niveles sale del tipo de nodo, así que el mismo módulo
 * sirve para una escuela y para un municipio sin duplicar código.
 *
 * Dos cosas que el módulo muestra en vez de tapar:
 *   · los KPIs por unidad no se pueden calcular sin submedición (ver
 *     data/organization.js);
 *   · los responsables se filtran por access_level, y se dice cuántos quedaron
 *     fuera en lugar de mostrar una lista incompleta sin avisar.
 */

const SECTIONS = [
  { id: 'perfil', label: 'Perfil' },
  { id: 'estructura', label: 'Estructura' },
  { id: 'responsables', label: 'Responsables' },
  { id: 'programas', label: 'Programas' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'indicadores', label: 'Indicadores' },
  { id: 'frameworks', label: 'Frameworks' },
];

const PROGRAM_STATUS = {
  active: { label: 'Activo', color: '#1E9E72' },
  completed: { label: 'Completado', color: '#29DDF5' },
  recurring: { label: 'Recurrente', color: '#B8860B' },
  paused: { label: 'Pausado', color: '#3E5E92' },
};

export default function Instituciones() {
  const { node } = useNode();
  const type = getNodeType(node.nodeTypeId);
  const nodeKey = dashboardKeyOf(node);
  const org = getOrganization(nodeKey);
  const hasCanonical = nodeKey === 'montessori';

  /* La subsección y el programa abierto viven en la URL, no en estado local:
     así el botón atrás funciona y se puede compartir el link a una ficha
     concreta — que es medio el punto de un perfil institucional. */
  const [params, setParams] = useSearchParams();
  const section = SECTIONS.some((s) => s.id === params.get('s')) ? params.get('s') : 'perfil';
  const programId = params.get('prog');

  const setSection = (id) => setParams(id === 'perfil' ? {} : { s: id }, { replace: false });
  const setProgramId = (id) => setParams(id ? { s: 'programas', prog: id } : { s: 'programas' });

  const resp = useMemo(
    () => (hasCanonical ? M.responsibles() : { list: [], hidden: 0 }),
    [hasCanonical],
  );
  const totals = useMemo(() => (hasCanonical ? M.indicatorsWithStatus() : []), [hasCanonical]);

  if (!org) {
    return (
      <div className="dash-card">
        <p className="dash-table-empty">
          Este nodo todavía no tiene una estructura organizativa cargada.
        </p>
      </div>
    );
  }

  const inst = node.data;
  const units = flattenUnits(org.units);
  const conMedicion = meteredUnits(org.units).length;

  return (
    <>
      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">{inst.legalName ?? node.name}</span>
          <span className="inst-origin-badge">Histórico documentado</span>
        </div>
        <nav className="inst-tabs" aria-label="Secciones del perfil institucional">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`inst-tab${section === s.id ? ' active' : ''}`}
              aria-current={section === s.id ? 'page' : undefined}
              onClick={() => setSection(s.id)}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </div>

      {section === 'perfil' && <Perfil inst={inst} org={org} units={units} conMedicion={conMedicion} />}

      {section === 'estructura' && (
        <Estructura org={org} units={units} type={type} conMedicion={conMedicion} />
      )}

      {section === 'responsables' && <Responsables resp={resp} />}

      {section === 'programas' && (
        <Programas
          programId={programId}
          onSelect={setProgramId}
          hasCanonical={hasCanonical}
        />
      )}

      {section === 'proyectos' && <Proyectos hasCanonical={hasCanonical} />}

      {section === 'indicadores' && <Indicadores totals={totals} />}

      {section === 'frameworks' && <Frameworks inst={inst} />}
    </>
  );
}

/* ── Perfil ─────────────────────────────────────────────────── */

function Perfil({ inst, org, units, conMedicion }) {
  const t = inst.trajectory;
  return (
    <>
      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Perfil</span>
        </div>
        <dl className="udash-node-facts">
          <div><dt>Razón social</dt><dd>{inst.legalName}</dd></div>
          <div><dt>Tipo</dt><dd>{inst.type}</dd></div>
          <div><dt>Ubicación</dt><dd>{inst.location}</dd></div>
          <div><dt>Histórico desde</dt><dd>{inst.historicalDataStart}</dd></div>
          <div><dt>Estado</dt><dd>{inst.status}</dd></div>
          <div><dt>Procedencia</dt><dd>{M.recordOriginLabel(inst.recordOrigin)}</dd></div>
          <div><dt>Verificación</dt><dd>{M.verificationLabel(inst.verificationStatus)}</dd></div>
          <div><dt>Fuente</dt><dd className="udash-node-mono">{inst.sourceReference}</dd></div>
        </dl>
      </div>

      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Resumen</span>
        </div>
        <div className="mod-scaffold-stats" style={{ borderBottom: 0, paddingTop: 0 }}>
          <Stat value={t.programs} label="Programas" />
          <Stat value={t.projects} label="Proyectos" />
          <Stat value={t.indicators} label="Indicadores" />
          <Stat value={t.measurements} label="Mediciones" />
          <Stat value={countUnits(org.units)} label="Unidades" />
          <Stat value={`${conMedicion} / ${units.length}`} label="Con medición propia" />
        </div>
        <p className="inst-trajectory-note">
          {t.measurementsNeedsReview} mediciones quedan fuera de los KPI públicos hasta que
          la institución confirme los datos (consultas Q04 y Q05).
        </p>
      </div>
    </>
  );
}

const Stat = ({ value, label }) => (
  <div className="mod-scaffold-stat">
    <div className="mod-scaffold-stat-value">{value}</div>
    <div className="mod-scaffold-stat-label">{label}</div>
  </div>
);

/* ── Estructura ─────────────────────────────────────────────── */

function Estructura({ org, units, type, conMedicion }) {
  const columns = [
    {
      key: 'name',
      label: type.hierarchy?.join(' / ') ?? 'Unidad',
      // El detalle va debajo del nombre, no al lado: en columna angosta el par
      // en línea se parte a mitad de palabra y queda ilegible.
      render: (u) => (
        <span className="org-name" style={{ paddingLeft: `${u.depth * 18}px` }}>
          {u.depth > 0 && <span className="org-branch" aria-hidden="true">└</span>}
          <span className="org-name-stack">
            <span className="org-name-text">{u.name}</span>
            {u.detail && <span className="org-detail">{u.detail}</span>}
          </span>
        </span>
      ),
    },
    { key: 'level', label: 'Tipo', width: '110px', render: (u) => org.levels[u.level] ?? '—' },
    {
      key: 'responsable',
      label: type.memberLabel ?? 'Responsable',
      width: '190px',
      // Sin responsable confirmado en el expediente. No se infiere (§ 4.8).
      render: (u) => u.responsable ?? <span className="trace-step-value--pending">Sin confirmar</span>,
    },
    {
      key: 'source',
      label: 'Fuente',
      width: '150px',
      render: (u) => <span className="arch-ref">{u.sourceReference ?? '—'}</span>,
    },
    {
      key: 'metered',
      label: 'Medición',
      align: 'right',
      width: '140px',
      render: (u) => (
        <StatusChip
          status={u.metered ? STEP_STATUS.COMPLETE : STEP_STATUS.UNAVAILABLE}
          label={u.metered ? 'Propia' : 'Sin medidor'}
        />
      ),
    },
  ];

  return (
    <>
      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Estructura</span>
          <span className="inst-origin-badge">Histórico documentado</span>
        </div>
        <DataTable columns={columns} rows={units} rowKey={(u) => u.id} caption="Unidades organizativas" />
      </div>

      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Cuentas de servicio y medidores</span>
        </div>
        <DataTable
          columns={[
            { key: 'meter', label: 'Medidor' },
            { key: 'type', label: 'Servicio', width: '120px' },
            { key: 'provider', label: 'Proveedor', width: '220px' },
            {
              key: 'source', label: 'Fuente', align: 'right', width: '150px',
              render: (u) => <span className="arch-ref">{u.sourceReference}</span>,
            },
          ]}
          rows={org.utilities}
          rowKey={(u) => u.id}
          caption="Cuentas de servicio"
        />
        <p className="inst-trajectory-note">
          Los identificadores de cuenta y medidor vienen restringidos en la fuente y no se
          muestran (IR-009).
        </p>
      </div>

      <div className="dash-card prov-note">
        <div className="dash-nav-group-label">Qué falta para tener KPIs por unidad</div>
        <ul className="mod-scaffold-list">
          <li>
            Los medidores de la institución son de edificio, no por unidad organizativa.
            Por eso {units.length - conMedicion} de {units.length} unidades no tienen
            consumo propio.
          </li>
          <li>
            Para desagregar hay dos caminos: <strong>submedición</strong> (un medidor por sector)
            o una <strong>regla de prorrateo</strong> acordada con la institución — por superficie,
            por matrícula o por horas de uso.
          </li>
          <li>
            Es una definición de la escuela, no técnica. El Entregable 3 § 4.8 prohíbe
            prorratear sin metodología explícita, así que hasta que se acuerde las unidades
            sin medidor muestran su estado real.
          </li>
        </ul>
        <p className="mod-scaffold-note">{ORG_EXAMPLE_NOTICE}</p>
      </div>
    </>
  );
}

/* ── Responsables ───────────────────────────────────────────── */

function Responsables({ resp }) {
  return (
    <div className="dash-card">
      <div className="dash-section-header">
        <span className="dash-section-title">Responsables</span>
        <span className="act-count">{resp.list.length} visibles</span>
      </div>

      {resp.list.length === 0 ? (
        <p className="dash-table-empty">Sin responsables visibles en este alcance.</p>
      ) : (
        <ul className="arch-list">
          {resp.list.map((p) => (
            <li key={p.person_id} className="arch-item">
              <div className="arch-item-main">
                <span className="arch-item-title">{p.display_name}</span>
                <span className="arch-item-meta">
                  {p.roles.length === 0
                    ? 'Sin rol asignado en el expediente'
                    : p.roles.map((r) => `${r.label} · ${r.scopeName}`).join(' / ')}
                </span>
              </div>
              <div className="arch-item-tags">
                <span className={`arch-access arch-access--${p.access_level}`}>
                  {M.accessLabel(p.access_level)}
                </span>
              </div>
              <div className="arch-item-source">
                <span className="arch-ref">{p.source_reference}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {resp.hidden > 0 && (
        <p className="mod-scaffold-note">
          {resp.hidden} persona{resp.hidden === 1 ? '' : 's'} con acceso restringido no
          aparece{resp.hidden === 1 ? '' : 'n'} en esta vista. Qué responsables se pueden
          mostrar es la consulta abierta Q09.
        </p>
      )}
    </div>
  );
}

/* ── Programas ──────────────────────────────────────────────── */

function Programas({ programId, onSelect, hasCanonical }) {
  if (!hasCanonical) {
    return <div className="dash-card"><p className="dash-table-empty">Sin programas cargados.</p></div>;
  }

  const detail = programId ? M.programDetail(programId) : null;

  if (detail) {
    const st = PROGRAM_STATUS[detail.status] ?? PROGRAM_STATUS.active;
    const evidence = M.evidenceFor('program', detail.program_id);
    return (
      <div className="dash-card">
        <button type="button" className="inst-back" onClick={() => onSelect(null)}>
          ← Volver a programas
        </button>
        <div className="dash-section-header">
          <span className="dash-section-title">{detail.name}</span>
          <span className="dash-cert-status" style={{ background: `${st.color}15`, border: `1px solid ${st.color}40`, color: st.color }}>
            {st.label}
          </span>
        </div>

        <dl className="udash-node-facts">
          <div><dt>Categoría</dt><dd>{detail.category}</dd></div>
          <div><dt>Objetivo</dt><dd>{detail.objective ?? 'Sin objetivo declarado en el expediente'}</dd></div>
          <div><dt>Inicio</dt><dd>{detail.start_date ?? 'Sin fecha confirmada'}</dd></div>
          <div><dt>Procedencia</dt><dd>{M.recordOriginLabel(detail.record_origin)}</dd></div>
          <div><dt>Fuente</dt><dd className="udash-node-mono">{detail.source_reference}</dd></div>
        </dl>

        <Sub title={`Proyectos (${detail.projects.length})`}>
          {detail.projects.length === 0
            ? <p className="dash-table-empty">Sin proyectos vinculados.</p>
            : detail.projects.map((p) => (
                <div key={p.project_id} className="dash-action-row">
                  <div className="dash-action-dot" />
                  <div className="dash-action-info">
                    <div className="dash-action-name">{p.name}</div>
                    <div className="dash-action-date">
                      {p.status} · {p.start_date ?? 'sin fecha'} · {p.source_reference}
                    </div>
                  </div>
                </div>
              ))}
        </Sub>

        <Sub title={`Hitos históricos (${detail.actions.length})`}>
          {detail.actions.length === 0
            ? <p className="dash-table-empty">Sin hitos registrados.</p>
            : detail.actions.map((a) => (
                <div key={a.action_id} className="dash-action-row">
                  <div className="dash-action-dot" />
                  <div className="dash-action-info">
                    <div className="dash-action-name">{a.summary}</div>
                    <div className="dash-action-date">
                      {a.occurred_at} · {M.verificationLabel(a.verification_status)} · {a.source_reference}
                    </div>
                  </div>
                </div>
              ))}
        </Sub>

        {evidence.length > 0 && (
          <Sub title={`Evidencias (${evidence.length})`}>
            {evidence.map((e) => (
              <div key={e.evidence_id} className="arch-item-source" style={{ padding: '6px 0' }}>
                <span className="arch-ref">
                  {M.isFileReferenceOnly(e) ? 'Referencia en expediente · ' : ''}{e.source_reference}
                </span>
              </div>
            ))}
          </Sub>
        )}

        <p className="mod-scaffold-note">
          Programa histórico: documentado en el expediente, no verificado por Sustain. No
          genera SES.
        </p>
      </div>
    );
  }

  return (
    <div className="dash-card">
      <div className="dash-section-header">
        <span className="dash-section-title">Programas</span>
        <span className="act-count">{M.programs.length}</span>
      </div>
      <DataTable
        columns={[
          { key: 'name', label: 'Programa' },
          { key: 'category', label: 'Categoría', width: '170px' },
          {
            key: 'status', label: 'Estado', width: '120px',
            render: (p) => {
              const st = PROGRAM_STATUS[p.status] ?? PROGRAM_STATUS.active;
              return (
                <span className="dash-cert-status" style={{ background: `${st.color}15`, border: `1px solid ${st.color}40`, color: st.color }}>
                  {st.label}
                </span>
              );
            },
          },
          {
            key: 'projects', label: 'Proyectos', align: 'right', width: '90px',
            render: (p) => M.projectsOf(p.program_id).length,
          },
          {
            key: 'source', label: 'Fuente', align: 'right', width: '190px',
            render: (p) => <span className="arch-ref">{p.source_reference}</span>,
          },
        ]}
        rows={M.programs}
        rowKey={(p) => p.program_id}
        rowAction={(p) => onSelect(p.program_id)}
        caption="Programas institucionales"
      />
      <p className="inst-trajectory-note">Click en un programa para ver su ficha.</p>
    </div>
  );
}

const Sub = ({ title, children }) => (
  <div style={{ marginTop: 16 }}>
    <div className="dash-nav-group-label">{title}</div>
    {children}
  </div>
);

/* ── Proyectos ──────────────────────────────────────────────── */

function Proyectos({ hasCanonical }) {
  if (!hasCanonical) {
    return <div className="dash-card"><p className="dash-table-empty">Sin proyectos cargados.</p></div>;
  }
  return (
    <div className="dash-card">
      <div className="dash-section-header">
        <span className="dash-section-title">Proyectos</span>
        <span className="act-count">{M.projects.length}</span>
      </div>
      <DataTable
        columns={[
          { key: 'name', label: 'Proyecto' },
          {
            key: 'program', label: 'Programa', width: '230px',
            render: (p) => M.programs.find((x) => x.program_id === p.program_id)?.name ?? '—',
          },
          { key: 'status', label: 'Estado', width: '110px' },
          {
            key: 'dates', label: 'Período', width: '150px',
            render: (p) => `${p.start_date ?? '—'} → ${p.end_date ?? 'en curso'}`,
          },
          {
            key: 'source', label: 'Fuente', align: 'right', width: '190px',
            render: (p) => <span className="arch-ref">{p.source_reference}</span>,
          },
        ]}
        rows={M.projects}
        rowKey={(p) => p.project_id}
        caption="Proyectos institucionales"
      />
    </div>
  );
}

/* ── Indicadores ────────────────────────────────────────────── */

const NO_TOTAL_REASON = {
  sin_mediciones: 'Sin mediciones cargadas',
  todas_en_revision: 'Todas en revisión',
};

function Indicadores({ totals }) {
  const conDato = totals.filter((t) => t.total).length;
  const bloqueados = totals.filter((t) => t.reason === 'todas_en_revision');

  return (
    <div className="dash-card">
      <div className="dash-section-header">
        <span className="dash-section-title">Indicadores</span>
        <span className="act-count">{conDato} de {totals.length} con total</span>
      </div>
      <DataTable
        columns={[
          { key: 'name', label: 'Indicador' },
          { key: 'category', label: 'Categoría', width: '160px' },
          {
            key: 'value', label: 'Total', align: 'right', width: '150px',
            // Un indicador sin total apto dice por qué, no desaparece.
            render: (t) => t.total
              ? <span className="idt-mono">{t.total.value} {t.unit}</span>
              : <span className="trace-step-value--pending">{NO_TOTAL_REASON[t.reason]}</span>,
          },
          {
            key: 'agg', label: 'Agregación', width: '100px',
            render: (t) => t.aggregation === 'latest' ? 'Último' : 'Suma',
          },
          {
            key: 'period', label: 'Período', align: 'right', width: '190px',
            render: (t) => t.total
              ? <span className="arch-ref">{t.total.periodStart} → {t.total.periodEnd}</span>
              : '—',
          },
          {
            key: 'excluded', label: 'Excluidas', align: 'right', width: '95px',
            // Mediciones que no entran al total por quality_status (IR-006).
            render: (t) => t.excluded > 0
              ? <span className="trace-step-value--pending">{t.excluded} / {t.measured}</span>
              : '—',
          },
        ]}
        rows={totals}
        rowKey={(t) => t.indicatorId}
        caption="Indicadores del nodo"
      />
      <p className="mod-scaffold-note">
        Los totales agregan sólo mediciones con <code>quality_status: accepted</code>. Las
        excluidas siguen en el sistema y se ven en Auditoría, pero no alimentan KPI
        públicos (IR-006).
        {bloqueados.length > 0 && (
          <> {bloqueados.map((b) => b.name).join(' y ')} no {bloqueados.length === 1 ? 'tiene' : 'tienen'} total
          porque todas sus mediciones esperan confirmación de la institución (Q04 y Q05).</>
        )}
      </p>
    </div>
  );
}

/* ── Frameworks ─────────────────────────────────────────────── */

function Frameworks({ inst }) {
  const reqs = M.frameworkRequirements;
  const assessments = M.complianceAssessments;

  return (
    <>
      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Frameworks externos</span>
        </div>
        {inst.frameworks.map((f) => (
          <dl key={f.id} className="udash-node-facts">
            <div><dt>Nombre</dt><dd>{f.name}</dd></div>
            <div><dt>Tipo</dt><dd>{f.type}</dd></div>
            <div><dt>Versión</dt><dd>{f.version}</dd></div>
            <div><dt>Estado</dt><dd>{f.status}</dd></div>
            <div><dt>Fuente</dt><dd className="udash-node-mono">{f.sourceReference}</dd></div>
          </dl>
        ))}
        <p className="mod-scaffold-note">
          COA es un framework externo asociado al nodo, no parte de la taxonomía de
          Sustain (IR-010). El mismo sistema sirve para otra institución con otra
          certificación sin tocar el core.
        </p>
      </div>

      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Requisitos y cumplimiento</span>
          <span className="act-count">{reqs.length} requisitos · {assessments.length} evaluaciones</span>
        </div>
        <DataTable
          columns={[
            { key: 'description', label: 'Requisito' },
            { key: 'category', label: 'Categoría', width: '170px' },
            { key: 'status', label: 'Estado', width: '140px' },
          ]}
          rows={reqs}
          rowKey={(r) => r.requirement_id}
          caption="Requisitos del framework"
        />
      </div>
    </>
  );
}
