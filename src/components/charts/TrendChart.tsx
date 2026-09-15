import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { TrendPoint } from '../../types';

interface TrendChartProps {
  data: TrendPoint[];
  color?: string;
  unit?: string;
  height?: number;
  showDots?: boolean;
}

function CustomTooltip({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-lg shadow-card-hover p-2.5 text-xs">
      <div className="text-text-secondary mb-1">{label}</div>
      <div className="font-semibold text-text-primary">
        {payload[0].value} {unit}
      </div>
    </div>
  );
}

export default function TrendChart({
  data,
  color = '#782980',
  unit = '',
  height = 80,
  showDots = false,
}: TrendChartProps) {
  const formatted = data.map((d) => ({
    date: d.date.slice(5), // MM-DD
    value: d.value,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={formatted} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: '#667085' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis hide domain={['auto', 'auto']} />
        <Tooltip content={<CustomTooltip unit={unit} />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={showDots ? { r: 2, fill: color } : false}
          activeDot={{ r: 3, fill: color, stroke: '#fff', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
