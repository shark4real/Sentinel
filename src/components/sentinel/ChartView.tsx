import React from 'react';
import type { ChartViewProps } from '../../types/schema';

/**
 * ChartView — Renders a simple SVG bar or area chart.
 * Self-contained. Accepts props only. No business logic.
 * Uses pure SVG — no external charting library needed.
 */
const ChartView: React.FC<ChartViewProps> = ({
  title,
  data,
  chartType = 'bar',
  color = 'var(--color-accent-blue)',
}) => {
  const width = 400;
  const height = 180;
  const padding = { top: 10, right: 10, bottom: 30, left: 10 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map((d) => d.value), 1);

  const renderBars = () => {
    const barWidth = chartW / data.length - 4;
    return data.map((d, i) => {
      const barH = (d.value / maxVal) * chartH;
      const x = padding.left + i * (chartW / data.length) + 2;
      const y = padding.top + chartH - barH;
      return (
        <g key={i}>
          <rect
            x={x}
            y={y}
            width={barWidth}
            height={barH}
            fill={color}
            opacity={0.85}
            rx={2}
          />
          <text
            x={x + barWidth / 2}
            y={height - 5}
            textAnchor="middle"
            className="sentinel-chart__label"
          >
            {d.label}
          </text>
        </g>
      );
    });
  };

  const renderLine = () => {
    const points = data.map((d, i) => {
      const x = padding.left + (i / (data.length - 1 || 1)) * chartW;
      const y = padding.top + chartH - (d.value / maxVal) * chartH;
      return `${x},${y}`;
    });

    const areaPoints = [
      `${padding.left},${padding.top + chartH}`,
      ...points,
      `${padding.left + chartW},${padding.top + chartH}`,
    ].join(' ');

    return (
      <>
        {chartType === 'area' && (
          <polygon points={areaPoints} fill={color} opacity={0.15} />
        )}
        <polyline
          points={points.join(' ')}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {data.map((d, i) => {
          const x = padding.left + (i / (data.length - 1 || 1)) * chartW;
          const y = padding.top + chartH - (d.value / maxVal) * chartH;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={3} fill={color} />
              <text
                x={x}
                y={height - 5}
                textAnchor="middle"
                className="sentinel-chart__label"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </>
    );
  };

  return (
    <div className="sentinel-card sentinel-chart">
      <h3 className="sentinel-card__title">{title}</h3>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="sentinel-chart__svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((frac) => (
          <line
            key={frac}
            x1={padding.left}
            y1={padding.top + chartH - frac * chartH}
            x2={padding.left + chartW}
            y2={padding.top + chartH - frac * chartH}
            stroke="var(--color-border)"
            strokeWidth={0.5}
            strokeDasharray="4 4"
          />
        ))}
        {chartType === 'bar' ? renderBars() : renderLine()}
      </svg>
    </div>
  );
};

export default ChartView;
