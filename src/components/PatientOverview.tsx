import type { PatientSummary, Period } from '../types';

interface PatientOverviewProps {
  summary: PatientSummary;
  period: Period;
  onPeriodChange: (p: Period) => void;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return `${h} h ${m > 0 ? `${m} m` : ''}`;
}

export default function PatientOverview({
  summary,
  period,
  onPeriodChange,
}: PatientOverviewProps) {
  const periods: { label: string; value: Period }[] = [
    { label: 'Hoy', value: 'today' },
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
  ];

  return (
    <div className="space-y-4">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-[#E1E7EC]">
        <div>
          <div className="text-[10px] font-mono tracking-wider text-[#667085] uppercase">
            NutriSense / Paciente
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#072B4A] mt-0.5">
            {summary.patient.name}
          </h1>
          <div className="text-xs text-[#667085] mt-0.5 font-sans">
            {summary.patient.dietaryPlan} · Seguimiento longitudinal · <span className="font-mono text-[11px]">07 Sep 2026</span>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex items-center border border-[#E1E7EC] rounded-[6px] p-0.5 bg-white self-start sm:self-auto">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => onPeriodChange(p.value)}
              className={`px-3 py-1 text-xs font-mono transition-all rounded-[4px] ${
                period === p.value
                  ? 'bg-[#072B4A] text-white font-medium'
                  : 'text-[#667085] hover:text-[#072B4A]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Superiores: Un solo bloque blanco continuo con divisores verticales */}
      <div className="bg-white border border-[#E1E7EC] rounded-[8px] p-5 shadow-[0_1px_3px_rgba(7,43,74,0.04)]">
        <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-[#E1E7EC] -my-1">
          {/* 1. FC reposo */}
          <div className="py-2 md:py-0 md:px-4 first:pl-0">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#072B4A] font-mono">
                {summary.restingHR}
              </span>
              <span className="text-xs font-mono text-[#667085]">bpm</span>
            </div>
            <div className="text-xs font-medium text-[#667085] mt-0.5">
              FC reposo
            </div>
            <div className="text-[11px] font-mono text-[#168567] mt-0.5">
              ↓ 3 bpm vs sem. ant.
            </div>
          </div>

          {/* 2. Pasos / Actividad */}
          <div className="py-2 md:py-0 md:px-4">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#072B4A] font-mono">
                {summary.dailySteps.toLocaleString()}
              </span>
            </div>
            <div className="text-xs font-medium text-[#667085] mt-0.5">
              Pasos diarios
            </div>
            <div className="text-[11px] font-mono text-[#667085] mt-0.5">
              Meta: {summary.stepGoal.toLocaleString()} (74%)
            </div>
          </div>

          {/* 3. Sedentario */}
          <div className="py-2 md:py-0 md:px-4">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#072B4A] font-mono">
                {formatDuration(summary.sedentaryMinutes)}
              </span>
            </div>
            <div className="text-xs font-medium text-[#667085] mt-0.5">
              Tiempo sedentario
            </div>
            <div className="text-[11px] font-mono text-[#667085] mt-0.5">
              {formatDuration(summary.activeMinutes)} activo hoy
            </div>
          </div>

          {/* 4. Ingestas (con pequeño acento morado #782980) */}
          <div className="py-2 md:py-0 md:px-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[#782980] font-mono">
                {summary.mealsDetected}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#782980]" />
            </div>
            <div className="text-xs font-medium text-[#172B3A] mt-0.5">
              Ingestas detectadas
            </div>
            <div className="text-[11px] font-mono text-[#782980] mt-0.5">
              {summary.mealsConfirmed} confirmadas
            </div>
          </div>

          {/* 5. Calidad de datos */}
          <div className="py-2 md:py-0 md:px-4 last:pr-0">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#072B4A] font-mono">
                {summary.dataQuality}%
              </span>
            </div>
            <div className="text-xs font-medium text-[#667085] mt-0.5">
              Datos válidos
            </div>
            <div className="text-[11px] font-mono text-[#168567] mt-0.5 font-medium">
              Calidad excelente
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
