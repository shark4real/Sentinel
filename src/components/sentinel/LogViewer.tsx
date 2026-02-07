import React from 'react';
import type { LogViewerProps } from '../../types/schema';

/**
 * LogViewer — Renders a scrollable log pane with level-based coloring.
 * Self-contained. Accepts props only. No business logic.
 */
const LogViewer: React.FC<LogViewerProps> = ({
  logs,
  title = 'System Logs',
}) => {
  const levelColors: Record<string, string> = {
    error: 'var(--color-accent-red)',
    warn: 'var(--color-accent-amber)',
    info: 'var(--color-accent-blue)',
    debug: 'var(--color-text-muted)',
  };

  return (
    <div className="sentinel-card sentinel-logs">
      <h3 className="sentinel-card__title">{title}</h3>
      <div className="sentinel-logs__container">
        {logs.map((entry) => (
          <div key={entry.id} className="sentinel-logs__entry">
            <span className="sentinel-logs__timestamp">{entry.timestamp}</span>
            <span
              className="sentinel-logs__level"
              style={{ color: levelColors[entry.level] }}
            >
              [{entry.level.toUpperCase()}]
            </span>
            <span className="sentinel-logs__source">{entry.source}</span>
            <span className="sentinel-logs__message">{entry.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogViewer;
