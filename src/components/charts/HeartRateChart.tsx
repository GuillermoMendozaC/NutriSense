import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import type { HRMeasurement, MealEvent } from '../../types';

interface HeartRateChartProps {
  measurements: HRMeasurement[];
  mealEvents: MealEvent[];
}

const mealColors: Record<string, string> = {
  breakfast: '#F59E0B',
  lunch: '#782980',
  snack: '#004E75',
  dinner: '#16A36A',
};

const mealLabels: Record<string, string> = {
  breakfast: 'Desayuno',
  lunch: 'Almuerzo',
  snack: 'Snack',
  dinner: 'Cena',
};

function formatHour(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
  mealEvents: MealEvent[];
}

function CustomTooltip({ active, payload, label, mealEvents }: CustomTooltipProps) {
  if (!active || !payload?.length || !label) return null;

  const meal = mealEvents.find((m) => {
    const mHour = formatHour(m.timestamp);
    return mHour === label;
  });

  const bpm = payload.find((p) => p.name === 'FC')?.value;

  return (
    <div className="bg-white border border-border rounded-lg shadow-card-hover p-3 text-xs min-w-[160px]">
      <div className="font-semibold text-text-primary mb-2">{label}</div>
      {bpm !== undefined && (
        <div className="flex justify-between gap-4">
          <span className="text-text-secondary">FC:</span>
          <span className="font-semibold text-primary-purple">{bpm} bpm</span>
        </div>
      )}
      <div className="flex justify-between gap-4">
        <span className="text-text-secondary">Actividad:</span>
        <span className="font-medium text-text-primary capitalize">
          {bpm !== undefined && bpm > 90 ? 'Moderada' : bpm !== undefined && bpm > 75 ? 'Ligera' : 'Reposo'}
        </span>
      </div>
      {meal && (
        <div className="mt-2 pt-2 border-t border-border">
          <span className="text-warning font-medium">🍽 {mealLabels[meal.type]}</span>
        </div>
      )}
    </div>
  );
}

export default function HeartRateChart({ measurements, mealEvents }: HeartRateChartProps) {
  // Sample every 3 points for performance
  const data = measurements
    .filter((_, i) => i % 3 === 0)
    .map((m) => ({
      time: formatHour(m.timestamp),
      FC: m.bpm,
      Basal: 64,
    }));

  const mealTimes = mealEvents.map((m) => ({
    time: formatHour(m.timestamp),
    type: m.type,
    color: mealColors[m.type],
    label: mealLabels[m.type],
  }));

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="section-title">Frecuencia cardíaca durante el día</div>
          <div className="section-subtitle mt-0.5">Hoy · FC registrada y FC basal de referencia</div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-primary-purple rounded" />
            <span className="text-text-secondary">FC registrada</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 border-t border-dashed border-text-secondary" />
            <span className="text-text-secondary">FC basal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-warning opacity-30" />
            <span className="text-text-secondary">Ingesta</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fill: '#667085' }}
            tickLine={false}
            axisLine={false}
            interval={5}
          />
          <YAxis
            domain={[50, 110]}
            tick={{ fontSize: 11, fill: '#667085' }}
            tickLine={false}
            axisLine={false}
            unit=" bpm"
            width={60}
          />
          <Tooltip content={<CustomTooltip mealEvents={mealEvents} />} />

          {/* Meal event reference areas */}
          {mealTimes.map((meal) => (
            <ReferenceLine
              key={meal.time}
              x={meal.time}
              stroke={meal.color}
              strokeWidth={2}
              strokeDasharray="4 2"
              label={{
                value: meal.label,
                position: 'top',
                fontSize: 10,
                fill: meal.color,
                fontWeight: 600,
              }}
            />
          ))}

          {/* Basal reference line */}
          <ReferenceLine y={64} stroke="#667085" strokeDasharray="5 3" strokeWidth={1} />

          {/* Heart rate area */}
          <Area
            type="monotone"
            dataKey="FC"
            stroke="#782980"
            strokeWidth={2}
            fill="#782980"
            fillOpacity={0.07}
            dot={false}
            activeDot={{ r: 4, fill: '#782980', stroke: '#fff', strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
