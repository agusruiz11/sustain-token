export default function ChartDonut({ segments = [], totalLabel = '', totalSub = '', r = 55 }) {
  const cx = 80;
  const cy = 80;
  const circumference = 2 * Math.PI * r;
  const stroke = 16;

  return (
    <div className="dash-donut-wrap">
      <div className="dash-donut-svg-wrap">
        <svg viewBox="0 0 160 160" width="160" height="160" aria-hidden="true">
          {/* Background ring */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="rgba(29,41,64,0.6)"
            strokeWidth={stroke}
          />
          {/* Segments */}
          {segments.map((seg, i) => (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={stroke}
              strokeDasharray={seg.dasharray}
              strokeDashoffset={seg.dashoffset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
          ))}
          {/* Inner glow */}
          <circle
            cx={cx} cy={cy} r={r - stroke / 2 - 4}
            fill="rgba(41,221,245,0.02)"
          />
        </svg>
        <div className="dash-donut-center">
          <div className="dash-donut-center-val">{totalLabel}</div>
          <div className="dash-donut-center-sub">{totalSub}</div>
        </div>
      </div>

      <div className="dash-donut-legend">
        {segments.map((seg) => (
          <div key={seg.label} className="dash-donut-legend-item">
            <div className="dash-donut-legend-left">
              <div
                className="dash-donut-legend-bar"
                style={{ background: seg.color }}
              />
              <span>{seg.label}</span>
            </div>
            <span className="dash-donut-legend-pct">{seg.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
