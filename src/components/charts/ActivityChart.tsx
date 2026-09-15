import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ActivitySummary } from '../../types';

interface ActivityChartProps {
  data: ActivitySummary;
}

const levelColors = {
  rest: '#E4E7EC',
  light: '#004E75',
  moderate: '#782980',
  intense: '#D92D20',
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-lg shadow-card-hover p-3 text-xs min-w-[140px]">
      <div className="font-semibold text-text-primary mb-1.5">{String(label).padStart(2,'0')}:00</div>
      {payload.map((p: any) => (
        p.value > 0 && (
          <div key={p.name} className="flex justify-between gap-3">
            <span style={{ color: p.fill }} className="font-medium">{p.name}:</span>
            <span className="font-semibold text-text-primary">{p.value} min</span>
          </div>
        )
      ))}
    </div>
  );
}

export default function ActivityChart({ data }: ActivityChartProps) {
  const chartData = data.hourlyBreakdown.map((h) => ({
    hour: h.hour,
    Reposo: h.level === 'rest' ? h.minutes : 0,
    Ligera: h.level === 'light' ? h.minutes : 0,
    Moderada: h.level === 'moderate' ? h.minutes : 0,
    Intensa: h.level === 'intense' ? h.minutes : 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }} barSize={14}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" vertical={false} />
        <XAxis
          dataKey="hour"
          tick={{ fontSize: 11, fill: '#667085' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}h`}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#667085' }}
          tickLine={false}
          axisLine={false}
          unit=" min"
          width={52}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="square"
          iconSize={10}
          wrapperStyle={{ fontSize: 11, color: '#667085', paddingTop: 8 }}
        />
        <Bar dataKey="Reposo" stackId="a" fill={levelColors.rest} radius={[0, 0, 0, 0]} />
        <Bar dataKey="Ligera" stackId="a" fill={levelColors.light} />
        <Bar dataKey="Moderada" stackId="a" fill={levelColors.moderate} />
        <Bar dataKey="Intensa" stackId="a" fill={levelColors.intense} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
