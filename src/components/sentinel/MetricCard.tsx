import React from 'react';
import type { MetricCardProps } from '../../types/schema';

/**
 * MetricCard — Displays a single key metric with optional trend indicator.
 * Self-contained. Accepts props only. No business logic.
 */
const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeDirection = 'stable',
  unit,
  status = 'normal',
}) => {
  const statusColors: Record<string, string> = {
    normal: 'var(--color-accent-blue)',
    warning: 'var(--color-accent-amber)',
    critical: 'var(--color-accent-red)',
  };

  const directionIcon =
    changeDirection === 'up' ? '↑' : changeDirection === 'down' ? '↓' : '→';

  const changeColor =
    changeDirection === 'up'
      ? 'var(--color-accent-red)'
      : changeDirection === 'down'
        ? 'var(--color-accent-green)'
        : 'var(--color-text-muted)';

  return (
    <div
      className="sentinel-card sentinel-metric"
      style={{ borderTopColor: statusColors[status] }}
    >
      <div className="sentinel-metric__label">{title}</div>
      <div className="sentinel-metric__value">
        {value}
        {unit && <span className="sentinel-metric__unit">{unit}</span>}
      </div>
      {change !== undefined && (
        <div className="sentinel-metric__change" style={{ color: changeColor }}>
          {directionIcon} {Math.abs(change)}%
        </div>
      )}
    </div>
  );
};

export default MetricCard;
