import { stepStyle } from './stepStyle';

export default function StatusChip({ status, label }) {
  const s = stepStyle(status);
  return (
    <span
      className="dash-cert-status"
      style={{
        background: `${s.color}15`,
        border: `1px solid ${s.color}40`,
        color: s.color,
        whiteSpace: 'nowrap',
      }}
    >
      {label ?? s.label}
    </span>
  );
}

/** Delta de SES con su signo y color. `null` = todavía no se conoce. */
export function SesDelta({ value }) {
  if (value === null || value === undefined) {
    return <span className="ses-delta ses-delta--unknown">Pendiente</span>;
  }
  const cls = value > 0 ? 'ses-delta--up' : value < 0 ? 'ses-delta--down' : 'ses-delta--flat';
  return (
    <span className={`ses-delta ${cls}`}>
      {value > 0 ? `+${value}` : value} SES
    </span>
  );
}

/**
 * Variación porcentual contra la línea base. Negativo = reducción = bueno.
 *
 * `null` no es un dato faltante: hay acciones que no se miden contra una línea
 * base de consumo propio —un viaje en bici, por ejemplo— y para esas la
 * variación porcentual no existe. Se dice, no se muestra un 0 que mentiría.
 */
export function DeltaPct({ value, fallback = 'No aplica' }) {
  if (value === null || value === undefined) {
    return <span className="ses-delta ses-delta--unknown">{fallback}</span>;
  }
  const cls = value < 0 ? 'ses-delta--up' : value > 0 ? 'ses-delta--down' : 'ses-delta--flat';
  return (
    <span className={`ses-delta ${cls}`}>
      {value > 0 ? '+' : ''}{value}%
    </span>
  );
}
