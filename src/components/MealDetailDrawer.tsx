import { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import type { MealEvent, PostprandialResponse } from '../types';
import PostprandialChart from './charts/PostprandialChart';

interface MealDetailDrawerProps {
  meal: MealEvent | null;
  postprandial: PostprandialResponse;
  onClose: () => void;
}

const typeLabels: Record<string, string> = {
  breakfast: 'Desayuno',
  lunch: 'Almuerzo',
  snack: 'Snack',
  dinner: 'Cena',
};

function formatTimeRange(start: string, durationMin: number): string {
  const s = new Date(start);
  const e = new Date(s.getTime() + durationMin * 60000);
  const fmt = (d: Date) =>
    `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return `${fmt(s)} — ${fmt(e)}`;
}

const actLabels: Record<string, string> = { low: 'Baja', moderate: 'Moderada', high: 'Alta' };

export default function MealDetailDrawer({
  meal,
  postprandial,
  onClose,
}: MealDetailDrawerProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const isOpen = meal !== null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#072B4A]/25 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer Panel */}
      <aside
        className={`
          fixed top-0 right-0 bottom-0 w-[440px] bg-white z-50
          border-l border-[#E1E7EC] shadow-[-4px_0_24px_rgba(7,43,74,0.10)] flex flex-col
          transition-transform duration-200 ease-out font-sans
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {meal && (
          <>
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-[#E1E7EC] flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#782980]" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#667085]">
                    Episodio de alimentación
                  </span>
                </div>
                <h2 className="text-xl font-bold text-[#072B4A] mt-1">
                  {typeLabels[meal.type]}
                </h2>
                <div className="font-mono text-xs text-[#667085] mt-0.5">
                  {formatTimeRange(meal.timestamp, meal.durationMinutes)} · {meal.durationMinutes} min de duración
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 text-[#667085] hover:text-[#072B4A] hover:bg-[#F6F8FA] rounded transition-colors"
                aria-label="Cerrar panel"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Primary Postprandial Indicators Grid */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#E1E7EC]">
                <div>
                  <div className="text-[11px] font-mono text-[#667085]">Respuesta Cardíaca</div>
                  <div className="text-base font-bold text-[#072B4A] mt-0.5 font-mono">
                    {postprandial.basalHR} → {postprandial.maxHR} <span className="text-xs font-normal text-[#667085]">bpm</span>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-mono text-[#667085]">Elevación ΔFC</div>
                  <div className="text-base font-bold text-[#782980] mt-0.5 font-mono">
                    +{meal.deltaHR} bpm
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-mono text-[#667085]">Recuperación</div>
                  <div className="text-base font-bold text-[#072B4A] mt-0.5 font-mono">
                    {postprandial.recoveryTimeMinutes} min
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-mono text-[#667085]">Actividad Previa</div>
                  <div className="text-sm font-semibold text-[#172B3A] mt-0.5">
                    {actLabels[postprandial.priorActivity]}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-mono text-[#667085]">Calidad de Registro</div>
                  <div className="text-sm font-semibold text-[#168567] mt-0.5 font-mono">
                    {meal.dataQuality}% (Confiable)
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-mono text-[#667085]">Estado Registro</div>
                  <div className="mt-0.5">
                    {meal.status === 'confirmed' ? (
                      <span className="status-badge status-badge-success">
                        Confirmado
                      </span>
                    ) : (
                      <span className="status-badge status-badge-warning">
                        Pendiente
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Postprandial Response Curve (-30 to +90 min) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#667085]">
                    Cinética Postprandial (-30 a +90 min)
                  </span>
                  <span className="text-[10px] font-mono text-[#782980]">
                    T0 = Ingesta
                  </span>
                </div>

                <div className="border border-[#E1E7EC] rounded-[6px] p-3 bg-white">
                  <PostprandialChart data={postprandial} />
                </div>
              </div>

              {/* Notes if available */}
              {meal.notes && (
                <div className="p-3 bg-[#F6F8FA] rounded-[6px] border border-[#E1E7EC]">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#667085] mb-1">
                    Anotaciones clínicas
                  </div>
                  <p className="text-xs text-[#172B3A] leading-relaxed">{meal.notes}</p>
                </div>
              )}

              {/* Collapsible Advanced Metrics (Nivel 3) */}
              <div className="pt-2 border-t border-[#E1E7EC]">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between py-2 text-xs font-mono text-[#667085] hover:text-[#072B4A] transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#782980]">●</span>
                    <span>Métricas avanzadas</span>
                  </span>
                  {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {showAdvanced && (
                  <div className="mt-2 p-3.5 bg-[#F6F8FA] rounded-[6px] border border-[#E1E7EC] space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-[#E1E7EC]">
                      <span className="text-[#667085]">Índice de Perfusión (PI)</span>
                      <span className="font-mono font-bold text-[#072B4A]">{postprandial.basalPI.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E1E7EC]">
                      <span className="text-[#667085]">Variación PRV</span>
                      <span className="font-mono font-bold text-[#782980]">{postprandial.prv}%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E1E7EC]">
                      <span className="text-[#667085]">RMSSD / SDNN</span>
                      <span className="font-mono font-semibold text-[#172B3A]">{postprandial.rmssd} / {postprandial.sdnn} ms</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E1E7EC]">
                      <span className="text-[#667085]">PPI promedio</span>
                      <span className="font-mono font-semibold text-[#172B3A]">{postprandial.ppiAvg} ms</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#667085]">SpO₂ durante evento</span>
                      <span className="font-mono font-semibold text-[#172B3A]">97.8 %</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
