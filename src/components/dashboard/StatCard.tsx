import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'info';
}

const variantStyles = {
  default: 'bg-card border border-border',
  primary: 'bg-primary text-primary-foreground',
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
  info: 'bg-accent text-accent-foreground',
};

export function StatCard({ title, value, icon, trend, className, variant = 'default' }: StatCardProps) {
  const isLight = variant === 'default';

  return (
    <div className={cn('stat-card', variantStyles[variant], className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={cn('text-sm font-medium', isLight ? 'text-muted-foreground' : 'opacity-80')}>
            {title}
          </p>
          <p className="metric-value">{value}</p>
          {trend && (
            <div className={cn('flex items-center gap-1 text-sm', isLight ? '' : 'opacity-90')}>
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span className={trend.isPositive ? 'text-success' : 'text-destructive'}>
                {trend.value}%
              </span>
              <span className={isLight ? 'text-muted-foreground' : 'opacity-70'}>vs last month</span>
            </div>
          )}
        </div>
        <div className={cn(
          'flex h-12 w-12 items-center justify-center rounded-xl',
          isLight ? 'bg-primary/10 text-primary' : 'bg-white/20'
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
}
