import React, { useState } from 'react';
import type { ActionChecklistProps } from '../../types/schema';

/**
 * ActionChecklist — Interactive checklist for incident response steps.
 * Self-contained. Accepts props only. Local toggle state is UI-only.
 */
const ActionChecklist: React.FC<ActionChecklistProps> = ({ title, items }) => {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(
    new Set(items.filter((i) => i.completed).map((i) => i.id))
  );

  const toggle = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const priorityColors: Record<string, string> = {
    critical: 'var(--color-accent-red)',
    high: 'var(--color-accent-amber)',
    medium: 'var(--color-accent-blue)',
    low: 'var(--color-text-muted)',
  };

  const completed = checkedIds.size;
  const total = items.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="sentinel-card sentinel-checklist">
      <div className="sentinel-checklist__header">
        <h3 className="sentinel-card__title">{title}</h3>
        <span className="sentinel-checklist__count">
          {completed}/{total}
        </span>
      </div>
      <div className="sentinel-checklist__progress">
        <div
          className="sentinel-checklist__progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="sentinel-checklist__items">
        {items.map((item) => {
          const isChecked = checkedIds.has(item.id);
          return (
            <label
              key={item.id}
              className={`sentinel-checklist__item ${isChecked ? 'sentinel-checklist__item--done' : ''}`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggle(item.id)}
                className="sentinel-checklist__checkbox"
              />
              <span
                className="sentinel-checklist__priority"
                style={{ color: priorityColors[item.priority] }}
              >
                [{item.priority.charAt(0).toUpperCase()}]
              </span>
              <span className="sentinel-checklist__label">{item.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default ActionChecklist;
