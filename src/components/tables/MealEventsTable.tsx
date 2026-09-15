import type { MealEvent } from '../../types';
import { CheckCircle2, Clock, XCircle, ChevronRight } from 'lucide-react';

interface MealEventsTableProps {
  events: MealEvent[];
  onSelect?: (event: MealEvent) => void;
}

const typeLabels: Record<string, string> = {
  breakfast: 'Desayuno',
  lunch: 'Almuerzo',
  snack: 'Snack',
  dinner: 'Cena',
};

const typeIcons: Record<string, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  snack: '🍎',
  dinner: '🌙',
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function StatusChip({ status }: { status: MealEvent['status'] }) {
  if (status === 'confirmed')
    return (
      <span className="chip-success gap-1">
        <CheckCircle2 size={11} />
        Confirmado
      </span>
    );
  if (status === 'pending')
    return (
      <span className="chip-warning gap-1">
        <Clock size={11} />
        Pendiente
      </span>
    );
  return (
    <span className="chip-error gap-1">
      <XCircle size={11} />
      Descartado
    </span>
  );
}

function QualityBar({ value }: { value: number }) {
  const color = value >= 90 ? 'bg-success' : value >= 75 ? 'bg-warning' : 'bg-error';
  return (
    <div className="flex items-center gap-2">
      <div className="w-14 bg-border rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-text-secondary">{value}%</span>
    </div>
  );
}

export default function MealEventsTable({ events, onSelect }: MealEventsTableProps) {
  return (
    <div className="card">
      <div className="px-5 py-4 border-b border-border">
        <div className="section-title">Eventos de alimentación de hoy</div>
        <div className="section-subtitle mt-0.5">
          {events.filter((e) => e.status === 'confirmed').length} confirmados · {events.length} detectados
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-background">
              <th className="table-th">Tipo</th>
              <th className="table-th">Hora</th>
              <th className="table-th">Duración</th>
              <th className="table-th">Estado</th>
              <th className="table-th">ΔFC</th>
              <th className="table-th">Calidad</th>
              <th className="table-th w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {events.map((event) => (
              <tr
                key={event.id}
                className="hover:bg-background cursor-pointer transition-colors"
                onClick={() => onSelect?.(event)}
              >
                <td className="table-td">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{typeIcons[event.type]}</span>
                    <span className="font-medium">{typeLabels[event.type]}</span>
                  </div>
                </td>
                <td className="table-td font-mono text-sm">{formatTime(event.timestamp)}</td>
                <td className="table-td text-text-secondary">{event.durationMinutes} min</td>
                <td className="table-td">
                  <StatusChip status={event.status} />
                </td>
                <td className="table-td">
                  <span
                    className={`font-semibold ${
                      event.deltaHR > 15
                        ? 'text-primary-purple'
                        : event.deltaHR > 8
                        ? 'text-primary-blue'
                        : 'text-text-primary'
                    }`}
                  >
                    +{event.deltaHR} bpm
                  </span>
                </td>
                <td className="table-td">
                  <QualityBar value={event.dataQuality} />
                </td>
                <td className="table-td">
                  <ChevronRight size={15} className="text-text-secondary" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
