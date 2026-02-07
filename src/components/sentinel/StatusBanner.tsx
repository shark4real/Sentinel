import React from 'react';
import type { StatusBannerProps, SystemStatus } from '../../types/schema';

/**
 * StatusBanner — Full-width status indicator for the current situation.
 * Self-contained. Accepts props only. No business logic.
 */
const StatusBanner: React.FC<StatusBannerProps> = ({
  status,
  title,
  message,
  timestamp,
}) => {
  const statusConfig: Record<
    SystemStatus,
    { bg: string; border: string; icon: string; textColor: string }
  > = {
    healthy: {
      bg: 'rgba(34, 197, 94, 0.08)',
      border: '#22c55e',
      icon: '✓',
      textColor: '#22c55e',
    },
    degraded: {
      bg: 'rgba(245, 158, 11, 0.08)',
      border: '#f59e0b',
      icon: '⚠',
      textColor: '#f59e0b',
    },
    critical: {
      bg: 'rgba(239, 68, 68, 0.08)',
      border: '#ef4444',
      icon: '✕',
      textColor: '#ef4444',
    },
    investigating: {
      bg: 'rgba(139, 92, 246, 0.08)',
      border: '#8b5cf6',
      icon: '🔍',
      textColor: '#8b5cf6',
    },
    maintenance: {
      bg: 'rgba(59, 130, 246, 0.08)',
      border: '#3b82f6',
      icon: '🔧',
      textColor: '#3b82f6',
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className="sentinel-banner"
      style={{
        backgroundColor: config.bg,
        borderColor: config.border,
      }}
    >
      <div className="sentinel-banner__icon" style={{ color: config.textColor }}>
        {config.icon}
      </div>
      <div className="sentinel-banner__content">
        <div className="sentinel-banner__title" style={{ color: config.textColor }}>
          {title}
        </div>
        <div className="sentinel-banner__message">{message}</div>
      </div>
      <div className="sentinel-banner__time">{timestamp}</div>
    </div>
  );
};

export default StatusBanner;
