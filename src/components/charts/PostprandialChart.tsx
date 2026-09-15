import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import type { PostprandialResponse } from '../../types';

interface PostprandialChartProps {
  data: PostprandialResponse;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E1E7EC] rounded-[6px] shadow-[0_2px_8px_rgba(7,43,74,0.08)] p-2.5 text-xs min-w-[140px] font-sans">
      <div className="font-mono text-[11px] text-[#667085] mb-1">
        {label >= 0 ? `+${label} min` : `${label} min`}
      </div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex justify-between gap-3 font-mono">
          <span style={{ color: p.color }} className="font-medium text-[11px]">{p.name}:</span>
          <span className="font-bold text-[#172B3A] text-xs">
            {p.name === 'FC' ? `${p.value} bpm` : `${p.value}%`}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function PostprandialChart({ data }: PostprandialChartProps) {
  const chartData = data.timeline.map((pt) => ({
    min: pt.minuteOffset,
    FC: pt.hr,
    PI: parseFloat((pt.pi).toFixed(2)),
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData} margin={{ top: 8, right: 12, bottom: 5, left: -10 }}>
        {/* Grid line strictly #E8EDF1 */}
        <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF1" vertical={false} />
        
        <XAxis
          dataKey="min"
          tick={{ fontSize: 10, fill: '#667085', fontFamily: '"IBM Plex Mono"' }}
          tickLine={false}
          axisLine={{ stroke: '#E1E7EC' }}
          tickFormatter={(v) => (v === 0 ? '0' : v > 0 ? `+${v}` : `${v}`)}
          interval={3}
        />
        
        {/* FC Primary Y Axis */}
        <YAxis
          yAxisId="hr"
          domain={[55, 95]}
          tick={{ fontSize: 10, fill: '#667085', fontFamily: '"IBM Plex Mono"' }}
          tickLine={false}
          axisLine={false}
          unit=" bpm"
          width={54}
        />
        
        {/* PI Secondary Y Axis */}
        <YAxis
          yAxisId="pi"
          orientation="right"
          domain={[1.5, 4.5]}
          tick={{ fontSize: 10, fill: '#667085', fontFamily: '"IBM Plex Mono"' }}
          tickLine={false}
          axisLine={false}
          unit="%"
          width={36}
        />
        
        <Tooltip content={<CustomTooltip />} />
        
        <Legend
          iconType="plainline"
          iconSize={14}
          wrapperStyle={{ fontSize: 11, color: '#667085', paddingTop: 6, fontFamily: 'Manrope, sans-serif' }}
        />
        
        {/* Ingestion time reference line at min = 0 in EMBS Purple #782980 */}
        <ReferenceLine
          yAxisId="hr"
          x={0}
          stroke="#782980"
          strokeDasharray="4 2"
          label={{ value: 'Ingesta', position: 'top', fontSize: 10, fill: '#782980', fontFamily: 'Manrope' }}
        />
        
        {/* Basal HR reference line in #98A2B3 */}
        <ReferenceLine
          yAxisId="hr"
          y={data.basalHR}
          stroke="#98A2B3"
          strokeDasharray="4 3"
          strokeWidth={1}
        />

        {/* FC line in Institutional Blue #004E75 */}
        <Line
          yAxisId="hr"
          type="monotone"
          dataKey="FC"
          stroke="#004E75"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3.5, fill: '#004E75' }}
          name="FC (#004E75)"
        />

        {/* PI line in IEEE Blue #0076A8 */}
        <Line
          yAxisId="pi"
          type="monotone"
          dataKey="PI"
          stroke="#0076A8"
          strokeWidth={1.5}
          strokeDasharray="3 2"
          dot={false}
          activeDot={{ r: 3, fill: '#0076A8' }}
          name="PI (#0076A8)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
