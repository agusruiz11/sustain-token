export default function ChartLine({ series = [], months = [], yMax = 300, yLabel = 'kg', height = 200 }) {
  const W = 600;
  const H = height;
  const PAD = { top: 16, right: 20, bottom: 32, left: 48 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const n = months.length;

  const yTicks = 4;
  const xStep = chartW / Math.max(n - 1, 1);

  function pointsToPath(pointsStr) {
    const pts = pointsStr.trim().split(' ').map(p => {
      const [x, y] = p.split(',').map(Number);
      return { x, y };
    });
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const cx = (prev.x + curr.x) / 2;
      d += ` C ${cx},${prev.y} ${cx},${curr.y} ${curr.x},${curr.y}`;
    }
    return d;
  }

  function pointsToArea(pointsStr, bottom) {
    const pts = pointsStr.trim().split(' ').map(p => {
      const [x, y] = p.split(',').map(Number);
      return { x, y };
    });
    if (pts.length < 2) return '';
    const lastX = pts[pts.length - 1].x;
    const firstX = pts[0].x;
    let d = `M ${pts[0].x} ${bottom}`;
    d += ` L ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const cx = (prev.x + curr.x) / 2;
      d += ` C ${cx},${prev.y} ${cx},${curr.y} ${curr.x},${curr.y}`;
    }
    d += ` L ${lastX} ${bottom} Z`;
    return d;
  }

  const BOTTOM_Y = PAD.top + chartH;
  const TOP_Y = PAD.top;

  return (
    <div style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="dash-chart-line-svg"
        aria-hidden="true"
      >
        {/* Grid lines */}
        {Array.from({ length: yTicks + 1 }).map((_, i) => {
          const y = PAD.top + (chartH / yTicks) * i;
          const val = Math.round(yMax - (yMax / yTicks) * i);
          return (
            <g key={i}>
              <line
                x1={PAD.left} y1={y}
                x2={PAD.left + chartW} y2={y}
                stroke="rgba(29,41,64,0.8)"
                strokeWidth="1"
              />
              <text
                x={PAD.left - 6} y={y + 4}
                textAnchor="end"
                fill="#3E5E92"
                fontSize="9"
                fontFamily="JetBrains Mono, monospace"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* X axis labels */}
        {months.map((m, i) => {
          const x = PAD.left + i * xStep;
          return (
            <text
              key={i}
              x={x} y={H - 6}
              textAnchor="middle"
              fill="#3E5E92"
              fontSize="9"
              fontFamily="JetBrains Mono, monospace"
            >
              {m}
            </text>
          );
        })}

        {/* Area fills */}
        {series.map((s, si) => (
          <path
            key={`area-${si}`}
            d={pointsToArea(s.points, BOTTOM_Y)}
            fill={s.color}
            opacity="0.04"
          />
        ))}

        {/* Lines */}
        {series.map((s, si) => (
          <path
            key={`line-${si}`}
            d={pointsToPath(s.points)}
            fill="none"
            stroke={s.color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* End dots */}
        {series.map((s, si) => {
          const lastPt = s.points.trim().split(' ').pop();
          const [lx, ly] = lastPt.split(',').map(Number);
          return (
            <g key={`dot-${si}`}>
              <circle cx={lx} cy={ly} r="4" fill={s.color} />
              <circle cx={lx} cy={ly} r="7" fill={s.color} opacity="0.15" />
            </g>
          );
        })}

        {/* Y axis label */}
        <text
          x={10} y={PAD.top + chartH / 2}
          textAnchor="middle"
          fill="#3E5E92"
          fontSize="9"
          fontFamily="JetBrains Mono, monospace"
          transform={`rotate(-90, 10, ${PAD.top + chartH / 2})`}
        >
          {yLabel}
        </text>
      </svg>

      <div className="dash-chart-legend">
        {series.map((s) => (
          <div key={s.label} className="dash-chart-legend-item">
            <div className="dash-chart-legend-dot" style={{ background: s.color }} />
            <span>{s.label}</span>
            {s.lastVal && (
              <span style={{ color: s.color, fontWeight: 600 }}>{s.lastVal}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
