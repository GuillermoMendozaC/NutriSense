import {
  ComposedChart,
  Area,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import type { HRMeasurement, MealEvent, ActivitySummary } from '../../types';

const activityColors: Record<string, string> = {
  rest: '#D1D5DB',
  light: '#93C5FD',
  moderate: '#782980',
  intense: '#D92D20',
};

const mealEmojis: Record<string, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  snack: '🍎',
  dinner: '🌙',
};

const mealLabels: Record<string, string> = {
  breakfast: 'Desayuno',
  lunch: 'Almuerzo',
  snack: 'Snack',
  dinner: 'Cena',
};

const mealLineColors: Record<string, string> = {
  breakfast: '#F59E0B',
  lunch: '#782980',
  snack: '#004E75',
  dinner: '#16A36A',
};

const actLevelMap: Record<string, number> = { rest: 1, light: 2, moderate: 3, intense: 4 };
const actLabelMap: Record<number, string> = { 1: 'Reposo', 2: 'Ligera', 3: 'Moderada', 4: 'Intensa' };

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// Custom label component for meal reference lines (renders below chart area)
function MealReferenceLabel({
  viewBox,
  emoji,
  name,
}: {
  viewBox?: { x: number; y: number; width: number; height: number };
  emoji: string;
  name: string;
}) {
  if (!viewBox) return null;
  const cx = viewBox.x;
  const bottom = viewBox.y + viewBox.height;
  return (
    <g>
      <text x={cx} y={bottom + 24} textAnchor="middle" fontSize={13} dominantBaseline="middle">
        {emoji}
      </text>
      <text x={cx} y={bottom + 42} textAnchor="middle" fontSize={9} fill="#667085" fontFamily="Inter, sans-serif">
        {name}
      </text>
    </g>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number; payload: TimelinePoint }>;
  label?: string;
  mealEvents: MealEvent[];
}

interface TimelinePoint {
  time: string;
  fc: number;
  act: number;
  actLevelKey: string;
}

function CustomTooltip({ active, payload, label, mealEvents }: CustomTooltipProps) {
  if (!active || !payload?.length || !label) return null;
  const fcEntry = payload.find((p) => p.dataKey === 'fc');
  const actEntry = payload.find((p) => p.dataKey === 'act');
  const meal = mealEvents.find((m) => formatTime(m.timestamp) === label);

  return (
    <div className="bg-white border border-border rounded-lg shadow-card-hover p-3 text-xs min-w-[150px]">
      <div className="font-semibold text-text-primary mb-2">{label}</div>
      {fcEntry && (
        <div className="flex justify-between gap-4">
          <span className="text-text-secondary">FC:</span>
          <span className="font-bold text-primary-purple">{fcEntry.value} bpm</span>
        </div>
      )}
      {actEntry && (
        <div className="flex justify-between gap-4">
          <span className="text-text-secondary">Actividad:</span>
          <span className="font-medium text-text-primary">{actLabelMap[actEntry.value]}</span>
        </div>
      )}
      {meal && (
        <div className="mt-2 pt-2 border-t border-border flex items-center gap-1.5">
          <span>{mealEmojis[meal.type]}</span>
          <span className="font-medium text-text-primary">{mealLabels[meal.type]}</span>
        </div>
      )}
    </div>
  );
}

interface PhysiologicalTimelineProps {
  measurements: HRMeasurement[];
  mealEvents: MealEvent[];
  activitySummary: ActivitySummary;
}

export default function PhysiologicalTimeline({
  measurements,
  mealEvents,
  activitySummary,
}: PhysiologicalTimelineProps) {
  // Build timeline data: sample every 15 min, merge activity
  const chartData: TimelinePoint[] = measurements
    .filter((_, i) => i % 3 === 0)
    .map((m) => {
      const hour = new Date(m.timestamp).getHours();
      const hourAct = activitySummary.hourlyBreakdown.find((h) => h.hour === hour);
      const levelKey = hourAct?.level ?? 'rest';
      return {
        time: formatTime(m.timestamp),
        fc: m.bpm,
        act: actLevelMap[levelKey],
        actLevelKey: levelKey,
      };
    });

  const mealMarkers = mealEvents.map((m) => ({
    time: formatTime(m.timestamp),
    type: m.type,
    emoji: mealEmojis[m.type],
    name: mealLabels[m.type],
    color: mealLineColors[m.type],
  }));

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="section-title">Actividad y respuesta fisiológica</div>
          <div className="section-subtitle mt-0.5">
            Frecuencia cardíaca · Nivel de actividad · Eventos de alimentación
          </div>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-text-secondary">
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-0.5 bg-primary-purple rounded" />
            <span>FC registrada</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-[#93C5FD] opacity-70" />
            <span>Actividad</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-warning font-medium">— —</span>
            <span>Ingesta</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart
          data={chartData}
          margin={{ top: 8, right: 20, bottom: 55, left: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fill: '#667085' }}
            tickLine={false}
            axisLine={false}
            interval={3}
          />
          {/* FC axis (left, visible) */}
          <YAxis
            yAxisId="fc"
            domain={[45, 120]}
            tick={{ fontSize: 11, fill: '#667085' }}
            tickLine={false}
            axisLine={false}
            unit=" bpm"
            width={58}
          />
          {/* Activity axis (right, hidden) — values 1-4 on [0,28] appear at bottom 4-14% */}
          <YAxis
            yAxisId="act"
            domain={[0, 28]}
            orientation="right"
            hide
          />

          <Tooltip
            content={
              <CustomTooltip mealEvents={mealEvents} />
            }
          />

          {/* FC basal reference */}
          <ReferenceLine
            yAxisId="fc"
            y={64}
            stroke="#667085"
            strokeDasharray="5 3"
            strokeWidth={1}
          />

          {/* Meal event reference lines */}
          {mealMarkers.map((meal) => (
            <ReferenceLine
              key={meal.time}
              yAxisId="fc"
              x={meal.time}
              stroke={meal.color}
              strokeDasharray="4 2"
              strokeWidth={1.5}
              label={
                <MealReferenceLabel emoji={meal.emoji} name={meal.name} />
              }
            />
          ))}

          {/* Activity bars (small, at bottom due to secondary axis scaling) */}
          <Bar
            yAxisId="act"
            dataKey="act"
            maxBarSize={8}
            radius={[2, 2, 0, 0]}
            isAnimationActive={false}
          >
            {chartData.map((entry, i) => (
              <Cell
                key={i}
                fill={activityColors[entry.actLevelKey]}
                fillOpacity={0.65}
              />
            ))}
          </Bar>

          {/* FC area (renders on top of bars) */}
          <Area
            yAxisId="fc"
            type="monotone"
            dataKey="fc"
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
