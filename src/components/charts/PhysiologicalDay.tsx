import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import type { HRMeasurement, MealEvent, ActivitySummary } from '../../types';

const mealLabels: Record<string, string> = {
  breakfast: 'Desayuno',
  lunch: 'Almuerzo',
  snack: 'Snack',
  dinner: 'Cena',
};

const actLabelMap: Record<number, string> = {
  1: 'Reposo',
  2: 'Ligera',
  3: 'Moderada',
  4: 'Intensa',
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// Custom Reference Label for feeding events (strictly #782980)
function MealMarkerLabel({
  viewBox,
  name,
}: {
  viewBox?: { x: number; y: number; width: number; height: number };
  name: string;
}) {
  if (!viewBox) return null;
  const cx = viewBox.x;
  const bottom = viewBox.y + viewBox.height;

  return (
    <g>
      <circle cx={cx} cy={bottom + 8} r={3} fill="#782980" />
      <text
        x={cx}
        y={bottom + 21}
        textAnchor="middle"
        fontSize={10}
        fontWeight={600}
        fill="#782980"
        fontFamily="Manrope, sans-serif"
      >
        {name}
      </text>
    </g>
  );
}

interface TimelinePoint {
  time: string;
  fc: number;
  act: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number; payload: TimelinePoint }>;
  label?: string;
  mealEvents: MealEvent[];
}

function EditorialTooltip({ active, payload, label, mealEvents }: CustomTooltipProps) {
  if (!active || !payload?.length || !label) return null;
  const fcEntry = payload.find((p) => p.dataKey === 'fc');
  const actEntry = payload.find((p) => p.dataKey === 'act');
  
  // Match meal by proximity to label time
  const meal = mealEvents.find((m) => {
    const mt = formatTime(m.timestamp);
    if (mt === label) return true;
    const [lh, lm] = label.split(':').map(Number);
    const [mh, mm] = mt.split(':').map(Number);
    return Math.abs((lh * 60 + lm) - (mh * 60 + mm)) <= 10;
  });

  return (
    <div className="bg-white border border-[#E1E7EC] rounded-[6px] p-3 text-xs shadow-[0_2px_8px_rgba(7,43,74,0.08)] min-w-[160px] font-sans">
      <div className="flex items-center justify-between font-mono text-[11px] text-[#667085] border-b border-[#E1E7EC] pb-1.5 mb-2">
        <span>{label}</span>
        {meal && (
          <span className="text-[#782980] font-semibold text-[10px]">
            {mealLabels[meal.type]}
          </span>
        )}
      </div>

      <div className="space-y-1">
        {fcEntry && (
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[#667085] text-[11px]">Frecuencia Cardíaca</span>
            <span className="font-mono font-bold text-[#072B4A] text-xs">
              {fcEntry.value} <span className="text-[10px] text-[#667085] font-normal">bpm</span>
            </span>
          </div>
        )}
        {actEntry && (
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[#667085] text-[11px]">Nivel Actividad</span>
            <span className="font-medium text-[#172B3A] text-xs">
              {actLabelMap[actEntry.value] ?? 'Reposo'}
            </span>
          </div>
        )}
        {meal && (
          <div className="pt-1.5 mt-1 border-t border-[#E1E7EC] flex items-center justify-between text-[11px]">
            <span className="text-[#782980] font-medium">Elevación ΔFC</span>
            <span className="font-mono font-bold text-[#782980]">+{meal.deltaHR} bpm</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface PhysiologicalDayProps {
  measurements: HRMeasurement[];
  mealEvents: MealEvent[];
  activitySummary: ActivitySummary;
}

export default function PhysiologicalDay({
  measurements,
  mealEvents,
  activitySummary,
}: PhysiologicalDayProps) {
  const actLevelMap: Record<string, number> = { rest: 1, light: 2, moderate: 3, intense: 4 };

  // Sample every 15 min
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
      };
    });

  // Map each meal to the nearest timeline point in chartData so all 4 meals display cleanly
  const mealMarkers = mealEvents.map((m) => {
    const [mh, mm] = formatTime(m.timestamp).split(':').map(Number);
    const mealMin = mh * 60 + mm;

    let closestTime = chartData[0]?.time ?? '';
    let minDiff = Infinity;

    for (const pt of chartData) {
      const [ph, pm] = pt.time.split(':').map(Number);
      const ptMin = ph * 60 + pm;
      const diff = Math.abs(ptMin - mealMin);
      if (diff < minDiff) {
        minDiff = diff;
        closestTime = pt.time;
      }
    }

    return {
      time: closestTime,
      name: mealLabels[m.type],
    };
  });

  return (
    <div className="bg-white border border-[#E1E7EC] rounded-[8px] p-6 shadow-[0_1px_3px_rgba(7,43,74,0.04)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-[#E1E7EC] mb-4">
        <div>
          <h2 className="text-xs font-mono font-bold tracking-wider text-[#072B4A] uppercase">
            Perfil fisiológico del día
          </h2>
          <p className="text-xs text-[#667085] mt-0.5 font-sans">
            Frecuencia cardíaca (FC), nivel de actividad física y eventos de alimentación
          </p>
        </div>

        {/* Clean legend matching palette */}
        <div className="flex items-center gap-4 text-[11px] font-sans text-[#667085]">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 bg-[#004E75] inline-block" />
            <span>FC</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#8CBCCB] rounded-[2px] inline-block" />
            <span>Actividad</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#782980] inline-block" />
            <span className="text-[#782980] font-medium">Ingesta</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#98A2B3] inline-block" />
            <span>Basal</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart
          data={chartData}
          margin={{ top: 10, right: 16, bottom: 30, left: 0 }}
        >
          {/* Grid line strictly #E8EDF1 */}
          <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF1" vertical={false} />
          
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: '#667085', fontFamily: '"IBM Plex Mono", monospace' }}
            tickLine={false}
            axisLine={{ stroke: '#E1E7EC' }}
            interval={3}
          />
          
          {/* FC primary axis */}
          <YAxis
            yAxisId="fc"
            domain={[45, 115]}
            tick={{ fontSize: 10, fill: '#667085', fontFamily: '"IBM Plex Mono", monospace' }}
            tickLine={false}
            axisLine={false}
            unit=" bpm"
            width={52}
          />

          {/* Activity secondary axis (hidden) */}
          <YAxis
            yAxisId="act"
            domain={[0, 26]}
            orientation="right"
            hide
          />

          <Tooltip
            content={<EditorialTooltip mealEvents={mealEvents} />}
          />

          {/* Basal HR reference line strictly #98A2B3 */}
          <ReferenceLine
            yAxisId="fc"
            y={64}
            stroke="#98A2B3"
            strokeDasharray="4 3"
            strokeWidth={1}
          />

          {/* Meal event markers strictly #782980 */}
          {mealMarkers.map((meal) => (
            <ReferenceLine
              key={meal.name}
              yAxisId="fc"
              x={meal.time}
              stroke="#782980"
              strokeDasharray="3 3"
              strokeWidth={1.5}
              label={<MealMarkerLabel name={meal.name} />}
            />
          ))}

          {/* Activity bars strictly #8CBCCB */}
          <Bar
            yAxisId="act"
            dataKey="act"
            fill="#8CBCCB"
            maxBarSize={6}
            radius={[1, 1, 0, 0]}
            isAnimationActive={false}
          />

          {/* FC curve strictly #004E75 with minimal opacity fill */}
          <Area
            yAxisId="fc"
            type="monotone"
            dataKey="fc"
            stroke="#004E75"
            strokeWidth={2}
            fill="#004E75"
            fillOpacity={0.04}
            dot={false}
            activeDot={{ r: 4, fill: '#004E75', stroke: '#FFFFFF', strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
