import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  trend?: number; // positive = up, negative = down
  trendLabel?: string;
  icon: ReactNode;
  iconBg?: string;
  accentColor?: string;
  progress?: number; // 0-100 for progress bar
  progressLabel?: string;
  badge?: { text: string; color: 'success' | 'warning' | 'error' | 'blue' | 'purple' };
  compact?: boolean;
}

export default function MetricCard({
  title,
  value,
  unit,
  subtitle,
  trend,
  trendLabel,
  icon,
  iconBg = 'bg-purple-bg',
  accentColor = 'text-primary-purple',
  progress,
  progressLabel,
  badge,
}: MetricCardProps) {
  const trendPositive = trend !== undefined && trend > 0;
  const trendNegative = trend !== undefined && trend < 0;
  const trendNeutral = trend !== undefined && trend === 0;

  const badgeClass = {
    success: 'chip-success',
    warning: 'chip-warning',
    error: 'chip-error',
    blue: 'bg-blue-bg text-primary-blue',
    purple: 'bg-purple-bg text-primary-purple',
  };

  return (
    <div className="card p-4 flex flex-col gap-3 hover:shadow-card-hover transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0 ${accentColor}`}>
          {icon}
        </div>
        {badge && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full inline-flex items-center ${badgeClass[badge.color]}`}>
            {badge.text}
          </span>
        )}
      </div>

      {/* Value */}
      <div>
        <div className="metric-label mb-1">{title}</div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-text-primary">{value}</span>
          {unit && <span className="text-sm font-medium text-text-secondary">{unit}</span>}
        </div>
        {subtitle && (
          <div className="text-xs text-text-secondary mt-0.5">{subtitle}</div>
        )}
      </div>

      {/* Progress bar */}
      {progress !== undefined && (
        <div>
          <div className="flex justify-between text-xs text-text-secondary mb-1">
            <span>{progressLabel}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-border rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-primary-purple transition-all"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        </div>
      )}

      {/* Trend */}
      {trend !== undefined && (
        <div
          className={`flex items-center gap-1 text-xs font-medium ${
            trendPositive ? 'text-success' : trendNegative ? 'text-error' : 'text-text-secondary'
          }`}
        >
          {trendPositive && <TrendingUp size={13} />}
          {trendNegative && <TrendingDown size={13} />}
          {trendNeutral && <Minus size={13} />}
          <span>
            {trend > 0 ? '+' : ''}{trend} {unit} {trendLabel}
          </span>
        </div>
      )}
    </div>
  );
}
