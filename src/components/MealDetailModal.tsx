import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { MealEvent, PostprandialResponse } from '../types';
import PostprandialChart from './charts/PostprandialChart';

interface MealDetailModalProps {
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

const typeEmojis: Record<string, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  snack: '🍎',
  dinner: '🌙',
};

function formatTimeRange(start: string, durationMin: number): string {
  const s = new Date(start);
  const e = new Date(s.getTime() + durationMin * 60000);
  const fmt = (d: Date) =>
    `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return `${fmt(s)} – ${fmt(e)}`;
}

const actLabel = { low: 'Baja', moderate: 'Moderada', high: 'Alta' };

export default function MealDetailModal({ meal, postprandial, onClose }: MealDetailModalProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const isOpen = meal !== null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/25 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Slide-over panel */}
      <div
        className={`
          fixed top-0 right-0 bottom-0 w-[420px] bg-white z-50
          shadow-xl flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {meal && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{typeEmojis[meal.type]}</span>
                <div>
                  <div className="font-bold text-text-primary text-base">
                    {typeLabels[meal.type]}
                  </div>
                  <div className="text-xs text-text-secondary mt-0.5">
                    {formatTimeRange(meal.timestamp, meal.durationMinutes)} · {meal.durationMinutes} min
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-text-secondary hover:bg-background transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
              {/* Status & quality */}
              <div className="flex items-center gap-2">
                {meal.status === 'confirmed' ? (
                  <span className="chip-success text-xs">✓ Confirmada</span>
                ) : meal.status === 'pending' ? (
                  <span className="chip-warning text-xs">⏳ Pendiente</span>
                ) : (
                  <span className="chip-neutral text-xs">Descartada</span>
                )}
                <span className="text-xs text-text-secondary">
                  Calidad de señal: <strong className="text-success">{meal.dataQuality}%</strong>
                </span>
              </div>

              {/* FC response metrics */}
              <div>
                <div className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">
                  Respuesta fisiológica
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: 'FC basal', value: `${postprandial.basalHR} bpm`, highlight: false },
                    { label: 'FC pico', value: `${postprandial.maxHR} bpm`, highlight: true },
                    { label: 'ΔFC', value: `+${postprandial.deltaHR} bpm`, highlight: true },
                    { label: 'Cambio relativo', value: `+${postprandial.deltaHRPercent}%`, highlight: false },
                    { label: 'Recuperación', value: `${postprandial.recoveryTimeMinutes} min`, highlight: false },
                    { label: 'Actividad previa', value: actLabel[postprandial.priorActivity], highlight: false },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`rounded-lg p-3 ${item.highlight ? 'bg-purple-bg' : 'bg-background'}`}
                    >
                      <div className="text-[11px] text-text-secondary mb-0.5">{item.label}</div>
                      <div
                        className={`text-sm font-bold ${
                          item.highlight ? 'text-primary-purple' : 'text-text-primary'
                        }`}
                      >
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Postprandial chart */}
              <div>
                <div className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">
                  Evolución temporal (−30 min · Ingesta · +90 min)
                </div>
                <PostprandialChart data={postprandial} />
              </div>

              {/* Notes */}
              {meal.notes && (
                <div className="bg-background rounded-lg p-3">
                  <div className="text-xs text-text-secondary leading-relaxed">{meal.notes}</div>
                </div>
              )}

              {/* Advanced metrics (collapsible) */}
              <div className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowAdvanced((v) => !v)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-text-secondary hover:bg-background transition-colors"
                >
                  <span>Métricas avanzadas</span>
                  {showAdvanced ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>

                {showAdvanced && (
                  <div className="px-4 pb-4 border-t border-border space-y-2 pt-3">
                    <div className="text-xs text-text-secondary mb-2 bg-blue-bg rounded p-2">
                      Variables de investigación — No constituyen diagnóstico.
                    </div>
                    {[
                      { label: 'Índice de Perfusión (PI)', value: `${postprandial.basalPI}% → ${postprandial.postprandialPI}%` },
                      { label: 'ΔPI', value: `+${postprandial.deltaPI}%` },
                      { label: 'PRV (Δ)', value: `${postprandial.prv}%` },
                      { label: 'RMSSD', value: `${postprandial.rmssd} ms` },
                      { label: 'SDNN', value: `${postprandial.sdnn} ms` },
                      { label: 'PPI promedio', value: `${postprandial.ppiAvg} ms` },
                    ].map((m) => (
                      <div key={m.label} className="flex justify-between text-xs py-1.5 border-b border-border last:border-0">
                        <span className="text-text-secondary">{m.label}</span>
                        <span className="font-medium text-text-primary font-mono">{m.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
