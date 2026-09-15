import type { MealEvent } from '../types';

interface MealTimelineProps {
  meals: MealEvent[];
  onSelectMeal: (meal: MealEvent) => void;
  maxItems?: number;
}

const typeLabels: Record<string, string> = {
  breakfast: 'DESAYUNO',
  lunch: 'ALMUERZO',
  snack: 'SNACK',
  dinner: 'CENA',
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function MealTimeline({
  meals,
  onSelectMeal,
  maxItems,
}: MealTimelineProps) {
  const sorted = [...meals].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const displayList = maxItems ? sorted.slice(0, maxItems) : sorted;

  return (
    <div className="bg-white border border-[#E1E7EC] rounded-[8px] p-6 shadow-[0_1px_3px_rgba(7,43,74,0.04)]">
      {/* Header */}
      <div className="flex items-baseline justify-between pb-3 border-b border-[#E1E7EC] mb-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#782980]" />
          <h3 className="text-xs font-mono font-bold tracking-wider text-[#072B4A] uppercase">
            Hoy / Eventos de alimentación
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#667085]">
          {meals.length} comidas registradas
        </span>
      </div>

      {/* Editorial List with Controlled Purple Accents */}
      <div className="divide-y divide-[#E1E7EC]">
        {displayList.map((meal) => (
          <div
            key={meal.id}
            onClick={() => onSelectMeal(meal)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelectMeal(meal)}
            className="py-3.5 hover:bg-[#F6F8FA] -mx-6 px-6 transition-colors cursor-pointer group flex items-baseline justify-between text-left"
          >
            {/* Left: Purple Dot, Time, Meal Name */}
            <div className="flex items-baseline gap-3">
              <span className="text-[#782980] text-xs font-bold select-none">●</span>
              <span className="font-mono text-xs font-medium text-[#172B3A] w-12">
                {formatTime(meal.timestamp)}
              </span>
              <div>
                <span className="font-bold text-xs tracking-wider text-[#072B4A] group-hover:text-[#782980] transition-colors">
                  {typeLabels[meal.type]}
                </span>
                <span className="text-[11px] font-mono text-[#667085] ml-2">
                  {meal.durationMinutes} min
                </span>
              </div>
            </div>

            {/* Right: ΔFC in purple, Status in green/yellow */}
            <div className="flex items-baseline gap-4 text-right">
              {meal.status === 'confirmed' ? (
                <>
                  <span className="font-mono text-xs font-bold text-[#782980]">
                    ΔFC +{meal.deltaHR} bpm
                  </span>
                  {meal.type === 'lunch' && (
                    <span className="hidden sm:inline font-mono text-[11px] text-[#667085]">
                      42 min recup.
                    </span>
                  )}
                  <span className="status-badge status-badge-success">
                    Confirmado
                  </span>
                </>
              ) : (
                <span className="status-badge status-badge-warning">
                  Pendiente
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
