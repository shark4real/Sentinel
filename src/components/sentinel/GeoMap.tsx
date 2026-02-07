import React from 'react';
import type { GeoMapProps } from '../../types/schema';

/**
 * GeoMap — Abstract geographic visualization using SVG.
 * Self-contained. Accepts props only. No business logic.
 * Uses a stylized grid to represent geographic distribution.
 */
const GeoMap: React.FC<GeoMapProps> = ({ title, points }) => {
  const width = 400;
  const height = 220;

  const statusColors: Record<string, string> = {
    normal: '#3b82f6',
    warning: '#f59e0b',
    critical: '#ef4444',
  };

  return (
    <div className="sentinel-card sentinel-geomap">
      <h3 className="sentinel-card__title">{title}</h3>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="sentinel-geomap__svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid background */}
        {Array.from({ length: 9 }, (_, i) => (
          <line
            key={`v${i}`}
            x1={((i + 1) * width) / 10}
            y1={0}
            x2={((i + 1) * width) / 10}
            y2={height}
            stroke="var(--color-border)"
            strokeWidth={0.5}
            opacity={0.3}
          />
        ))}
        {Array.from({ length: 5 }, (_, i) => (
          <line
            key={`h${i}`}
            x1={0}
            y1={((i + 1) * height) / 6}
            x2={width}
            y2={((i + 1) * height) / 6}
            stroke="var(--color-border)"
            strokeWidth={0.5}
            opacity={0.3}
          />
        ))}

        {/* Abstract continent shapes */}
        <ellipse cx={120} cy={90} rx={60} ry={40} fill="var(--color-surface-raised)" opacity={0.5} />
        <ellipse cx={280} cy={80} rx={70} ry={50} fill="var(--color-surface-raised)" opacity={0.5} />
        <ellipse cx={320} cy={160} rx={40} ry={25} fill="var(--color-surface-raised)" opacity={0.5} />
        <ellipse cx={100} cy={170} rx={30} ry={20} fill="var(--color-surface-raised)" opacity={0.5} />

        {/* Data points */}
        {points.map((point) => {
          const cx = (point.x / 100) * width;
          const cy = (point.y / 100) * height;
          const color = statusColors[point.status];
          return (
            <g key={point.id}>
              {/* Pulse ring for critical/warning */}
              {point.status !== 'normal' && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={12}
                  fill="none"
                  stroke={color}
                  strokeWidth={1}
                  opacity={0.4}
                  className="sentinel-geomap__pulse"
                />
              )}
              <circle cx={cx} cy={cy} r={5} fill={color} />
              <text
                x={cx}
                y={cy - 10}
                textAnchor="middle"
                className="sentinel-geomap__label"
              >
                {point.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default GeoMap;
