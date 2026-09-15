import { useEffect, useState } from 'react';
import { getMealEvents } from '../services/api';
import { MOCK_POSTPRANDIAL } from '../data/mockData';
import type { MealEvent } from '../types';
import MealDetailDrawer from '../components/MealDetailDrawer';

const typeLabels: Record<string, string> = {
  breakfast: 'Desayuno',
  lunch: 'Almuerzo',
  snack: 'Snack',
  dinner: 'Cena',
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function Alimentacion() {
  const [events, setEvents] = useState<MealEvent[]>([]);
  const [selected, setSelected] = useState<MealEvent | null>(null);

  useEffect(() => {
    getMealEvents('p001').then((data) => {
      setEvents(data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
    });
  }, []);

  const confirmedCount = events.filter((e) => e.status === 'confirmed').length;
  const pendingCount = events.filter((e) => e.status === 'pending').length;
  const avgDelta = events.length > 0
    ? Math.round(events.reduce((acc, e) => acc + e.deltaHR, 0) / events.length)
    : 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white border border-[#E1E7EC] rounded-[8px] p-6 shadow-[0_1px_3px_rgba(7,43,74,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-[#E1E7EC]">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[#667085] uppercase">
              NutriSense / Alimentación
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#072B4A] mt-0.5">
              Registro de ingestas y respuestas
            </h1>
            <p className="text-xs text-[#667085] mt-0.5 font-sans">
              Sophia Eras · Jornada actual · Detección multimodal de eventos
            </p>
          </div>

          {/* Summary Strip */}
          <div className="flex items-baseline gap-5 text-xs font-mono">
            <div>
              <span className="text-[#667085]">Confirmadas: </span>
              <strong className="text-[#168567]">{confirmedCount}</strong>
            </div>
            <div>
              <span className="text-[#667085]">Pendientes: </span>
              <strong className="text-[#DFA321]">{pendingCount}</strong>
            </div>
            <div>
              <span className="text-[#667085]">ΔFC promedio: </span>
              <strong className="text-[#782980]">+{avgDelta} bpm</strong>
            </div>
          </div>
        </div>

        <div className="pt-2.5 text-[11px] font-sans text-[#667085] flex items-center gap-2">
          <span className="text-[#782980] font-bold">●</span>
          <span>Haz clic sobre cualquier ingesta para consultar su curva postprandial y métricas detalladas en el panel lateral.</span>
        </div>
      </div>

      {/* Timeline List */}
      <div className="bg-white border border-[#E1E7EC] rounded-[8px] shadow-[0_1px_3px_rgba(7,43,74,0.04)] divide-y divide-[#E1E7EC] overflow-hidden">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => setSelected(event)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setSelected(event)}
            className="p-5 hover:bg-[#F6F8FA] transition-colors cursor-pointer group flex flex-col sm:flex-row sm:items-baseline justify-between gap-3"
          >
            {/* Left: Time & Meal Type */}
            <div className="flex items-baseline gap-3">
              <span className="text-[#782980] text-xs font-bold select-none">●</span>
              <span className="font-mono text-xs font-medium text-[#172B3A] w-12">
                {formatTime(event.timestamp)}
              </span>
              <div>
                <span className="font-semibold text-sm text-[#072B4A] group-hover:text-[#782980] transition-colors">
                  {typeLabels[event.type]}
                </span>
                <span className="text-xs font-mono text-[#667085] ml-2">
                  {event.durationMinutes} min de duración
                </span>
                {event.notes && (
                  <div className="text-xs text-[#667085] mt-0.5 font-sans">
                    {event.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Metrics & Status */}
            <div className="flex items-baseline gap-5 text-right font-mono text-xs">
              <div>
                <span className="text-[#667085]">Elevación: </span>
                <strong className="text-[#782980] font-semibold">+{event.deltaHR} bpm</strong>
              </div>

              <div>
                <span className="text-[#667085]">Calidad: </span>
                <strong className={event.dataQuality >= 90 ? 'text-[#168567]' : 'text-[#DFA321]'}>
                  {event.dataQuality}%
                </strong>
              </div>

              <div>
                {event.status === 'confirmed' ? (
                  <span className="status-badge status-badge-success">
                    Confirmado
                  </span>
                ) : (
                  <span className="status-badge status-badge-warning">
                    Pendiente
                  </span>
                )}
              </div>

              <span className="text-[#667085] group-hover:text-[#072B4A] transition-colors">
                →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Slide-over Drawer */}
      <MealDetailDrawer
        meal={selected}
        postprandial={MOCK_POSTPRANDIAL}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
