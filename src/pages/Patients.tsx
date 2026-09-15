import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getPatients } from '../services/api';
import type { Patient } from '../types';

function formatRelativeTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000 / 60;
  if (diff < 60) return `Hace ${Math.round(diff)} min`;
  if (diff < 1440) return `Hace ${Math.round(diff / 60)} h`;
  return `Hace ${Math.round(diff / 1440)} días`;
}

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getPatients().then(setPatients);
  }, []);

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.dietaryPlan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white border border-[#E1E7EC] rounded-[8px] p-6 shadow-[0_1px_3px_rgba(7,43,74,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-[#E1E7EC]">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[#667085] uppercase">
              NutriSense / Pacientes
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#072B4A] mt-0.5">
              Directorio de pacientes
            </h1>
            <p className="text-xs text-[#667085] mt-0.5 font-sans">
              Seguimiento nutricional y monitorización wearable continua
            </p>
          </div>

          <div className="text-right font-mono text-xs text-[#667085]">
            Activos: <strong className="text-[#072B4A] font-semibold">{patients.length} pacientes</strong>
          </div>
        </div>

        {/* Search bar */}
        <div className="pt-3">
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]" />
            <input
              type="text"
              placeholder="Buscar por nombre, identificador o plan nutricional..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs font-sans bg-[#F6F8FA] border border-[#E1E7EC] rounded-[6px] focus:bg-white focus:outline-none focus:border-[#072B4A] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white border border-[#E1E7EC] rounded-[8px] shadow-[0_1px_3px_rgba(7,43,74,0.04)] divide-y divide-[#E1E7EC] overflow-hidden">
        {filtered.map((patient) => {
          const isCurrent = patient.id === 'p001';
          const mealsToday = patient.id === 'p001' ? 4 : patient.id === 'p002' ? 3 : 2;

          return (
            <div
              key={patient.id}
              onClick={() => navigate('/')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
              className="p-5 hover:bg-[#F6F8FA] transition-colors cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                {/* Name & ID */}
                <div className="flex items-baseline gap-2.5">
                  <span className="text-base font-semibold text-[#072B4A] group-hover:text-[#004E75] transition-colors">
                    {patient.name}
                  </span>
                  <span className="font-mono text-xs text-[#667085]">
                    {patient.id.toUpperCase()}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-medium text-[#782980] bg-[#FAF5FA] px-1.5 py-0.5 rounded border border-[#782980]/20">
                      Actual
                    </span>
                  )}
                </div>

                {/* Last Sync */}
                <div className="font-mono text-xs text-[#667085]">
                  Último registro: <strong className="text-[#072B4A] font-medium">{formatRelativeTime(patient.lastSync)}</strong>
                </div>
              </div>

              {/* Subline metrics */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-2.5 pt-2 border-t border-[#E1E7EC]/60 text-xs font-sans">
                <div className="text-[#667085] text-xs">
                  {patient.dietaryPlan} · {patient.age} años
                </div>

                <div className="flex items-center gap-6 font-mono text-xs">
                  <div>
                    <span className="text-[#667085]">Ingestas hoy: </span>
                    <strong className="text-[#782980] font-semibold">{mealsToday}</strong>
                  </div>

                  <div>
                    <span className="text-[#667085]">Datos válidos: </span>
                    <strong className="text-[#168567] font-semibold">{patient.dataQuality}%</strong>
                  </div>

                  <span className="text-[#667085] group-hover:text-[#072B4A] transition-colors">
                    →
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-8 text-center text-xs font-mono text-[#667085]">
            No se encontraron pacientes con el criterio: &quot;{search}&quot;
          </div>
        )}
      </div>
    </div>
  );
}
