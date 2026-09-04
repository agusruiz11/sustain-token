import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNode } from '../components/useNode';
import { actionsForNode, buildTimeline, STEP_STATUS } from '../data/actions';
import { dashboardKeyOf } from '../data/sustainNodes';
import { CATEGORIES } from '../data/categories';
import { moduleHref } from '../data/nodeTypes';
import { SesDelta } from '../components/StatusChip';
import { stepStyle } from '../components/stepStyle';
import { anchorLinks } from '../data/anchorLinks';
import {
  historicalTimeline, verificationLabel, programs as montPrograms,
} from '../data/montessori/index.js';

/**
 * § 5 del brief + Entregable 3 § 4.4 — «Timeline ambiental del nodo».
 *
 * Antes era sólo buildTimeline() sobre las acciones Sustain. Ahora une dos
 * cronologías de naturaleza distinta y las mantiene distinguibles:
 *
 *   · Acción Sustain → los 6 hitos del pipeline (Acción → Validación → Hash →
 *     IPFS → Blockchain → SES) y link a su ficha.
 *   · Hito histórico → ficha documental con fuente y estado. **Sin pipeline
 *     MRV simulado**: el spec lo prohíbe explícitamente porque sugeriría una
 *     verificación que nunca ocurrió.
 *
 * El badge de origen y el color del punto son lo que separa una cosa de la
 * otra de un vistazo.
 */

const FILTERS = [
  { id: 'todo', label: 'Todo' },
  { id: 'sustain', label: 'Acciones Sustain' },
  { id: 'historico', label: 'Histórico' },
  { id: 'proyectos', label: 'Programas y proyectos' },
];

/* Color por tipo de evento histórico. El violeta es el color de "histórico
   documentado" en todo el producto; los proyectos usan un tono contiguo para
   diferenciarse sin salirse de la familia. */
const HIST_COLOR = { action: '#8A7BB8', project: '#6C8FC7' };

const HIST_TYPE_LABEL = {
  committee_formation: 'Conformación de comité',
  certification_application: 'Postulación a certificación',
  asset_commissioning: 'Puesta en marcha de activo',
  sustainable_mobility_event: 'Evento de movilidad',
  training: 'Capacitación',
  green_infrastructure: 'Infraestructura verde',
  award_received: 'Reconocimiento recibido',
  communication_campaign: 'Campaña de comunicación',
};

export default function Timeline() {
  const { node, routeSegment } = useNode();
  const [filtro, setFiltro] = useState('todo');

  const nodeKey = dashboardKeyOf(node);
  const hasHistory = nodeKey === 'montessori';

  const actions = useMemo(
    () => actionsForNode(node).sort((a, b) => b.date.localeCompare(a.date)),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ver MisAcciones
    [nodeKey],
  );

  const historical = useMemo(() => (hasHistory ? historicalTimeline() : []), [hasHistory]);

  const base = moduleHref(node.nodeTypeId, node.slug, 'acciones', routeSegment);
  const pendientes = actions.filter((a) => a.anchor.chainStatus !== STEP_STATUS.COMPLETE).length;

  /* Una sola lista ordenada por fecha, con el tipo de evento como
     discriminante. Mezclar en el tiempo es el punto del módulo; lo que no se
     mezcla es la naturaleza del registro. */
  const events = useMemo(() => {
    const sustain = actions.map((a) => ({ kind: 'sustain', date: a.date, action: a }));
    const hist = historical.map((h) => ({ kind: h.kind, date: h.date, hist: h }));
    return [...sustain, ...hist]
      .filter((e) => {
        if (filtro === 'todo') return true;
        if (filtro === 'sustain') return e.kind === 'sustain';
        if (filtro === 'historico') return e.kind === 'action';
        if (filtro === 'proyectos') return e.kind === 'project';
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [actions, historical, filtro]);

  const programName = (id) =>
    montPrograms.find((p) => p.program_id === id)?.name ?? null;

  return (
    <>
      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">
            {hasHistory ? 'Timeline ambiental del nodo' : 'Timeline del nodo'}
          </span>
          <span className="act-count">{events.length} eventos · más reciente primero</span>
        </div>

        {hasHistory && (
          <div className="act-filters">
            <label className="act-filter">
              <span>Origen</span>
              <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
                {FILTERS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
              </select>
            </label>
          </div>
        )}

        {events.length === 0 ? (
          <p className="dash-table-empty">No hay eventos para este filtro.</p>
        ) : (
          <ol className="tl-list">
            {events.map((e) => (
              e.kind === 'sustain'
                ? <SustainEvent key={e.action.id} action={e.action} base={base} />
                : <HistoricalEvent
                    key={e.hist.id}
                    ev={e.hist}
                    programName={programName(e.hist.programId)}
                  />
            ))}
          </ol>
        )}
      </div>

      {pendientes > 0 && (
        <p className="mod-scaffold-note">
          {pendientes} de {actions.length} acciones Sustain están pendientes de anclaje en
          IPFS y blockchain. Es el estado real del piloto, no un dato faltante de la demo.
        </p>
      )}

      {hasHistory && (
        <p className="mod-scaffold-note">
          Los hitos históricos no muestran cadena MRV: son actividades documentadas en el
          expediente institucional, anteriores a Sustain. No generan SES ni anclaje.
        </p>
      )}
    </>
  );
}

/** Acción verificada: los 6 hitos del pipeline y link a la ficha. */
function SustainEvent({ action, base }) {
  const cat = CATEGORIES[action.categoryId];
  const milestones = buildTimeline(action);
  const links = anchorLinks(action.anchor);

  return (
    <li className="tl-item">
      <div className="tl-rail" aria-hidden="true">
        <span className="tl-dot" style={{ background: cat.color }} />
      </div>

      <div className="tl-body">
        <div className="tl-head">
          <Link to={`${base}/${action.id}`} className="tl-title">{action.title}</Link>
          <span className="tl-origin tl-origin--sustain">Sustain</span>
          <span className="tl-date">{action.dateLabel}</span>
          <SesDelta value={action.ses.delta} />
        </div>

        <ol className="tl-milestones">
          {milestones.map((m) => {
            const s = stepStyle(m.status);
            /* IPFS y blockchain se pueden abrir desde el propio timeline
               cuando hay dato: es el recorrido que se muestra en el celular. */
            const href = m.key === 'ipfs' ? links.ipfs : m.key === 'blockchain' ? links.tx : null;
            const inner = (
              <>
                <span className="tl-ms-mark" style={{ color: s.color }}>{s.mark}</span>
                <span className="tl-ms-label">{m.label}</span>
              </>
            );
            return (
              <li key={m.key} className="tl-ms" title={m.detail ?? ''}>
                {href
                  ? <a className="tl-ms-link" href={href} target="_blank" rel="noreferrer noopener">{inner}↗</a>
                  : inner}
              </li>
            );
          })}
        </ol>
      </div>
    </li>
  );
}

/**
 * Hito histórico: ficha documental.
 * Deliberadamente NO renderiza `tl-milestones` — ver la nota de arriba.
 */
function HistoricalEvent({ ev, programName }) {
  const color = HIST_COLOR[ev.kind] ?? HIST_COLOR.action;
  const typeLabel = ev.kind === 'project'
    ? 'Proyecto'
    : HIST_TYPE_LABEL[ev.type] ?? ev.type;

  return (
    <li className="tl-item">
      <div className="tl-rail" aria-hidden="true">
        <span className="tl-dot tl-dot--hollow" style={{ borderColor: color }} />
      </div>

      <div className="tl-body">
        <div className="tl-head">
          <span className="tl-title tl-title--plain">{ev.title}</span>
          <span className="tl-origin tl-origin--hist">
            {verificationLabel(ev.verificationStatus)}
          </span>
          <span className="tl-date">{ev.date}</span>
        </div>
        <div className="tl-hist-meta">
          <span>{typeLabel}</span>
          {programName && <span>· {programName}</span>}
          {ev.sourceReference && <span className="tl-hist-src">· {ev.sourceReference}</span>}
        </div>
      </div>
    </li>
  );
}
