import { TrendingDown, TrendingUp } from 'lucide-react';

export default function WeeklySummaryEditorial() {
  const metrics = [
    {
      label: 'Frecuencia cardíaca en reposo',
      value: '67 → 64 bpm',
      delta: '↓ 3 bpm',
      positive: true,
      sub: 'Evolución favorable del tono autonómico',
    },
    {
      label: 'Nivel de actividad física',
      value: '7 840 pasos/día',
      delta: '+14 %',
      positive: true,
      sub: 'Mayor movilidad diaria registrada',
    },
    {
      label: 'Tiempo sedentario diario',
      value: '5h 12m promedio',
      delta: '−8 %',
      positive: true,
      sub: 'Reducción sostenida de inactividad',
    },
    {
      label: 'Ingestas semanales registradas',
      value: '23 comidas',
      delta: '91% confirmadas',
      positive: null,
      sub: 'Adherencia alta al registro',
    },
    {
      label: 'Respuesta postprandial media',
      value: 'ΔFC +12 bpm',
      delta: 'Recup: 38 min',
      positive: null,
      sub: 'Amplitud de elevación controlada',
    },
  ];

  return (
    <div className="bg-white border border-[#E1E7EC] rounded-[8px] p-6 shadow-[0_1px_3px_rgba(7,43,74,0.04)] flex flex-col justify-between">
      {/* Header */}
      <div className="pb-3 border-b border-[#E1E7EC] mb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#072B4A]" />
            <h3 className="text-xs font-mono font-bold tracking-wider text-[#072B4A] uppercase">
              Resumen semanal
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#667085]">Últimos 7 días</span>
        </div>
      </div>

      {/* Metrics List */}
      <div className="divide-y divide-[#E1E7EC]">
        {metrics.map((m) => (
          <div key={m.label} className="py-3 flex items-baseline justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-[#172B3A]">{m.label}</div>
              <div className="text-[11px] text-[#667085] mt-0.5">{m.sub}</div>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="font-mono text-xs font-bold text-[#072B4A]">{m.value}</div>
              <div className="flex items-center justify-end gap-1 font-mono text-[11px] mt-0.5">
                {m.positive === true && <TrendingDown size={11} className="text-[#168567]" />}
                {m.positive === false && <TrendingUp size={11} className="text-[#C94C4C]" />}
                <span
                  className={
                    m.positive === true
                      ? 'text-[#168567] font-medium'
                      : m.positive === false
                      ? 'text-[#C94C4C] font-medium'
                      : 'text-[#782980] font-medium'
                  }
                >
                  {m.delta}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
