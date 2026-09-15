import { useEffect, useState } from 'react';
import { getTrendData } from '../services/api';
import type { TrendData } from '../types';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

type PeriodOpt = '7d' | '30d' | '90d';

const periodOpts: { label: string; value: PeriodOpt }[] = [
  { label: '7 días', value: '7d' },
  { label: '30 días', value: '30d' },
  { label: '90 días', value: '90d' },
];

export default function Trends() {
  const [period, setPeriod] = useState<PeriodOpt>('30d');
  const [trends, setTrends] = useState<TrendData | null>(null);

  useEffect(() => {
    getTrendData('p001', period).then(setTrends);
  }, [period]);

  if (!trends) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="font-mono text-xs text-[#667085]">
          Cargando tendencias longitudinales...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white border border-[#E1E7EC] rounded-[8px] p-6 shadow-[0_1px_3px_rgba(7,43,74,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-[#E1E7EC]">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[#667085] uppercase">
              NutriSense / Tendencias
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#072B4A] mt-0.5">
              Evolución fisiológica longitudinal
            </h1>
            <p className="text-xs text-[#667085] mt-0.5 font-sans">
              Sophia Eras · Respuesta autonómica, balance motor y nutrición a medio plazo
            </p>
          </div>

          {/* Period Switcher */}
          <div className="flex items-center border border-[#E1E7EC] rounded-[6px] p-0.5 bg-[#F6F8FA]">
            {periodOpts.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPeriod(opt.value)}
                className={`px-3 py-1 text-xs font-mono transition-all rounded-[4px] ${
                  period === opt.value
                    ? 'bg-[#072B4A] text-white font-medium'
                    : 'text-[#667085] hover:text-[#072B4A]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
          <div>
            <div className="text-[10px] font-mono text-[#667085] uppercase">FC en reposo</div>
            <div className="text-2xl font-bold text-[#072B4A] font-mono mt-0.5">
              67 → 64 <span className="text-xs font-normal text-[#667085]">bpm</span>
            </div>
            <div className="text-[11px] font-mono text-[#168567] mt-0.5">
              ↓ 3 bpm (Favorable)
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono text-[#667085] uppercase">Actividad diaria</div>
            <div className="text-2xl font-bold text-[#072B4A] font-mono mt-0.5">
              +14 %
            </div>
            <div className="text-[11px] font-mono text-[#0076A8] mt-0.5">
              7 840 pasos promedio
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono text-[#667085] uppercase">Sedentarismo</div>
            <div className="text-2xl font-bold text-[#072B4A] font-mono mt-0.5">
              −8 %
            </div>
            <div className="text-[11px] font-mono text-[#168567] mt-0.5">
              5 h 12 min promedio
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono text-[#667085] uppercase">Ingestas registradas</div>
            <div className="text-2xl font-bold text-[#782980] font-mono mt-0.5">
              23 comidas
            </div>
            <div className="text-[11px] font-mono text-[#782980] mt-0.5">
              ΔFC media: +12 bpm
            </div>
          </div>
        </div>
      </div>

      {/* Longitudinal Tracks */}
      <div className="bg-white border border-[#E1E7EC] rounded-[8px] p-6 shadow-[0_1px_3px_rgba(7,43,74,0.04)] space-y-6">
        {/* Track 1: Frecuencia Cardíaca en Reposo */}
        <div>
          <div className="flex items-baseline justify-between pb-2 border-b border-[#E1E7EC] mb-3">
            <div>
              <span className="font-mono text-xs font-bold text-[#072B4A] uppercase tracking-wider">
                01 · Frecuencia cardíaca en reposo (FC basal)
              </span>
              <p className="text-[11px] text-[#667085] font-sans mt-0.5">
                Indicador directo de recuperación autonómica y demanda circulatoria basal
              </p>
            </div>
            <span className="font-mono text-xs font-semibold text-[#168567]">
              Tendencia favorable (67 → 64 bpm)
            </span>
          </div>

          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={trends.restingHR} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF1" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#667085', fontFamily: '"IBM Plex Mono"' }} tickLine={false} axisLine={{ stroke: '#E1E7EC' }} />
              <YAxis domain={[60, 72]} tick={{ fontSize: 10, fill: '#667085', fontFamily: '"IBM Plex Mono"' }} tickLine={false} axisLine={false} width={36} unit=" bpm" />
              <Tooltip content={({ active, payload }) => active && payload?.[0] ? (
                <div className="bg-white border border-[#E1E7EC] rounded-[6px] p-2 text-xs font-mono shadow-sm">
                  {payload[0].payload?.date}: <strong className="text-[#072B4A]">{payload[0].value} bpm</strong>
                </div>
              ) : null} />
              <Area type="monotone" dataKey="value" stroke="#004E75" strokeWidth={2} fill="#004E75" fillOpacity={0.04} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Track 2: Actividad Diaria */}
        <div className="pt-4 border-t border-[#E1E7EC]">
          <div className="flex items-baseline justify-between pb-2 border-b border-[#E1E7EC] mb-3">
            <div>
              <span className="font-mono text-xs font-bold text-[#072B4A] uppercase tracking-wider">
                02 · Actividad diaria (pasos)
              </span>
              <p className="text-[11px] text-[#667085] font-sans mt-0.5">
                Volumen motor diario medido mediante IMU MPU6050
              </p>
            </div>
            <span className="font-mono text-xs font-semibold text-[#0076A8]">
              +14% vs período anterior
            </span>
          </div>

          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={trends.dailySteps} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF1" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#667085', fontFamily: '"IBM Plex Mono"' }} tickLine={false} axisLine={{ stroke: '#E1E7EC' }} />
              <YAxis tick={{ fontSize: 10, fill: '#667085', fontFamily: '"IBM Plex Mono"' }} tickLine={false} axisLine={false} width={42} />
              <Tooltip content={({ active, payload }) => active && payload?.[0] ? (
                <div className="bg-white border border-[#E1E7EC] rounded-[6px] p-2 text-xs font-mono shadow-sm">
                  {payload[0].payload?.date}: <strong className="text-[#072B4A]">{Number(payload[0].value ?? 0).toLocaleString()} pasos</strong>
                </div>
              ) : null} />
              <Bar dataKey="value" fill="#8CBCCB" maxBarSize={16} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Track 3 & 4: Ingestas / Día y Respuesta Postprandial */}
        <div className="pt-4 border-t border-[#E1E7EC] grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-baseline justify-between pb-2 border-b border-[#E1E7EC] mb-3">
              <span className="font-mono text-xs font-bold text-[#072B4A] uppercase tracking-wider">
                03 · Ingestas por día
              </span>
              <span className="font-mono text-xs text-[#667085]">~3.3 comidas/día</span>
            </div>

            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={trends.mealsPerDay} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF1" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#667085', fontFamily: '"IBM Plex Mono"' }} tickLine={false} axisLine={{ stroke: '#E1E7EC' }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 10, fill: '#667085', fontFamily: '"IBM Plex Mono"' }} tickLine={false} axisLine={false} width={24} />
                <Bar dataKey="value" fill="#782980" maxBarSize={14} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <div className="flex items-baseline justify-between pb-2 border-b border-[#E1E7EC] mb-3">
              <span className="font-mono text-xs font-bold text-[#782980] uppercase tracking-wider">
                04 · Elevación postprandial media (ΔFC)
              </span>
              <span className="font-mono text-xs text-[#782980] font-semibold">Media: +12 bpm</span>
            </div>

            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={trends.avgPostprandialDeltaHR} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF1" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#667085', fontFamily: '"IBM Plex Mono"' }} tickLine={false} axisLine={{ stroke: '#E1E7EC' }} />
                <YAxis domain={[5, 25]} tick={{ fontSize: 10, fill: '#667085', fontFamily: '"IBM Plex Mono"' }} tickLine={false} axisLine={false} width={32} unit=" bpm" />
                <Area type="monotone" dataKey="value" stroke="#782980" strokeWidth={2} fill="#782980" fillOpacity={0.05} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
