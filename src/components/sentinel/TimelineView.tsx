import React from 'react';
import type { TimelineViewProps, Severity } from '../../types/schema';

/**
 * TimelineView — Renders a vertical timeline of events.
 * Self-contained. Accepts props only. No business logic.
 */
const TimelineView: React.FC<TimelineViewProps> = ({
  events,
  title = 'Event Timeline',
}) => {
  const severityColors: Record<Severity, string> = {
    critical: 'var(--color-accent-red)',
    warning: 'var(--color-accent-amber)',
    info: 'var(--color-accent-blue)',
  };

  return (
    <div className="sentinel-card sentinel-timeline">
      <h3 className="sentinel-card__title">{title}</h3>
      <div className="sentinel-timeline__track">
        {events.map((event, index) => (
          <div key={event.id} className="sentinel-timeline__event">
            <div className="sentinel-timeline__connector">
              <div
                className="sentinel-timeline__dot"
                style={{ backgroundColor: severityColors[event.severity] }}
              />
              {index < events.length - 1 && (
                <div className="sentinel-timeline__line" />
              )}
            </div>
            <div className="sentinel-timeline__content">
              <div className="sentinel-timeline__time">{event.timestamp}</div>
              <div className="sentinel-timeline__title">{event.title}</div>
              <div className="sentinel-timeline__desc">{event.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineView;
