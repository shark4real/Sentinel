import React from 'react';
import type { AlertPanelProps, Severity } from '../../types/schema';

/**
 * AlertPanel — Displays a list of severity-coded alerts.
 * Self-contained. Accepts props only. No business logic.
 */
const AlertPanel: React.FC<AlertPanelProps> = ({
  alerts,
  title = 'Active Alerts',
}) => {
  const severityConfig: Record<Severity, { icon: string; color: string }> = {
    critical: { icon: '🔴', color: 'var(--color-accent-red)' },
    warning: { icon: '🟡', color: 'var(--color-accent-amber)' },
    info: { icon: '🔵', color: 'var(--color-accent-blue)' },
  };

  const sorted = [...alerts].sort((a, b) => {
    const order: Record<Severity, number> = { critical: 0, warning: 1, info: 2 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <div className="sentinel-card sentinel-alerts">
      <h3 className="sentinel-card__title">{title}</h3>
      <div className="sentinel-alerts__list">
        {sorted.map((alert) => {
          const config = severityConfig[alert.severity];
          return (
            <div
              key={alert.id}
              className="sentinel-alerts__item"
              style={{ borderLeftColor: config.color }}
            >
              <div className="sentinel-alerts__header">
                <span className="sentinel-alerts__icon">{config.icon}</span>
                <span className="sentinel-alerts__severity">
                  {alert.severity.toUpperCase()}
                </span>
                <span className="sentinel-alerts__source">{alert.source}</span>
                <span className="sentinel-alerts__time">{alert.timestamp}</span>
              </div>
              <div className="sentinel-alerts__message">{alert.message}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertPanel;
