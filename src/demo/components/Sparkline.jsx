/**
 * Sparkline — primitiva de gráfico (decisión D3 del plan).
 *
 * El brief pide 13 categorías con su serie. Dibujar 13 SVG a mano como los
 * actuales no escala, y meter una librería rompería el look que el cliente pidió
 * no tocar. La salida es esta primitiva: normaliza los valores y dibuja en el
 * mismo lenguaje visual que ChartLine, sin dependencias.
 *
 * Recibe una o dos series (típicamente consumo vs. línea base) ya en valores
 * reales; la normalización a coordenadas ocurre acá, no en los datos.
 */
export default function Sparkline({
  series,
  width = 220,
  height = 48,
  pad = 3,
  label,
}) {
  const all = series.flatMap((s) => s.values).filter((v) => Number.isFinite(v));
  if (all.length < 2) return null;

  const min = Math.min(...all);
  const max = Math.max(...all);
  // Rango cero (todos los valores iguales): se centra la línea en vez de dividir por 0.
  const span = max - min || 1;
  const flat = max === min;

  const toPoints = (values) => values.map((v, i) => {
    const x = pad + (i * (width - pad * 2)) / (values.length - 1);
    const y = flat
      ? height / 2
      : height - pad - ((v - min) / span) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <svg
      className="spark"
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      role="img"
      aria-label={label ?? 'Serie temporal'}
    >
      {series.map((s) => (
        <polyline
          key={s.label}
          points={toPoints(s.values)}
          fill="none"
          stroke={s.color}
          strokeWidth={s.dashed ? 1 : 1.6}
          strokeDasharray={s.dashed ? '3 3' : undefined}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
