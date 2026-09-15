import { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
} from 'lucide-react';
import { MOCK_POSTPRANDIAL } from '../data/mockData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function Settings() {
  const [stepGoal, setStepGoal] = useState(8000);
  const [hrAlertThreshold, setHrAlertThreshold] = useState(105);
  const [autoConfirmMeals, setAutoConfirmMeals] = useState(false);
  const [showTechnical, setShowTechnical] = useState(false);
  const [showPPG, setShowPPG] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const ppgData = Array.from({ length: 100 }, (_, i) => ({
    i,
    raw: Math.sin(i * 0.35) * 0.4 + Math.sin(i * 0.7) * 0.15 + (Math.random() - 0.5) * 0.05,
  }));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white border border-[#E1E7EC] rounded-[8px] p-6 shadow-[0_1px_3px_rgba(7,43,74,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-[#E1E7EC]">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[#667085] uppercase">
              NutriSense / Configuración
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#072B4A] mt-0.5">
              Parámetros del sistema
            </h1>
            <p className="text-xs text-[#667085] mt-0.5 font-sans">
              Umbrales fisiológicos, protocolos de seguimiento y herramientas de exportación
            </p>
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#072B4A] text-white text-xs font-mono font-medium rounded-[4px] hover:bg-[#004E75] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            {saved ? (
              <>
                <CheckCircle2 size={13} className="text-[#168567]" />
                <span>Guardado</span>
              </>
            ) : (
              <span>Guardar cambios</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Parameters Block */}
      <div className="bg-white border border-[#E1E7EC] rounded-[8px] p-6 shadow-[0_1px_3px_rgba(7,43,74,0.04)] space-y-6">
        <div>
          <h2 className="text-xs font-mono font-bold tracking-wider text-[#072B4A] uppercase pb-2 border-b border-[#E1E7EC]">
            01 · Parámetros de seguimiento nutricional
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div>
              <label className="block text-xs font-mono text-[#667085] mb-1">
                Meta diaria de actividad (pasos)
              </label>
              <input
                type="number"
                value={stepGoal}
                onChange={(e) => setStepGoal(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono border border-[#E1E7EC] rounded-[4px] bg-[#F6F8FA] focus:bg-white focus:outline-none focus:border-[#072B4A]"
              />
              <p className="text-[11px] text-[#667085] mt-1">
                Valor de referencia para el cálculo de cumplimiento del paciente.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#667085] mb-1">
                Umbral de elevación postprandial para alertas (bpm)
              </label>
              <input
                type="number"
                value={hrAlertThreshold}
                onChange={(e) => setHrAlertThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono border border-[#E1E7EC] rounded-[4px] bg-[#F6F8FA] focus:bg-white focus:outline-none focus:border-[#072B4A]"
              />
              <p className="text-[11px] text-[#667085] mt-1">
                Avisa al nutricionista si la respuesta de frecuencia cardíaca supera este valor.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoConfirmMeals}
                onChange={(e) => setAutoConfirmMeals(e.target.checked)}
                className="mt-0.5 rounded border-[#E1E7EC] text-[#072B4A] focus:ring-0"
              />
              <div>
                <div className="text-xs font-semibold text-[#072B4A]">
                  Confirmación automática de ingestas de alta confianza (&gt;90%)
                </div>
                <div className="text-[11px] text-[#667085] mt-0.5">
                  Confirmar automáticamente si coinciden acelerometría de muñeca y respuesta cronotrópica clara.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Section 2: Clinical Data Export */}
        <div className="pt-4 border-t border-[#E1E7EC]">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-2 border-b border-[#E1E7EC] mb-4">
            <div>
              <h2 className="text-xs font-mono font-bold tracking-wider text-[#072B4A] uppercase">
                02 · Exportación de registros
              </h2>
              <p className="text-[11px] text-[#667085] font-sans mt-0.5">
                Series temporales de frecuencia cardíaca, acelerometría y comidas registradas
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Exportando registro clínico a CSV...')}
                className="px-3 py-1.5 border border-[#E1E7EC] rounded-[4px] text-xs font-mono text-[#072B4A] hover:bg-[#F6F8FA] transition-colors flex items-center gap-1.5"
              >
                <Download size={13} />
                <span>CSV clínico</span>
              </button>
              <button
                onClick={() => alert('Generando reporte clínico en PDF...')}
                className="px-3 py-1.5 bg-[#072B4A] text-white rounded-[4px] text-xs font-mono hover:bg-[#004E75] transition-colors flex items-center gap-1.5"
              >
                <Download size={13} />
                <span>Reporte PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Technical Diagnostics & Internal Signals (Level 3 - Collapsible) */}
        <div className="pt-4 border-t border-[#E1E7EC]">
          <button
            onClick={() => setShowTechnical(!showTechnical)}
            className="w-full flex items-center justify-between py-1 text-xs font-mono text-[#667085] hover:text-[#072B4A] transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="text-[#782980]">●</span>
              <span className="font-semibold text-[#072B4A]">
                Diagnóstico del sistema y variables internas (Nivel 3)
              </span>
            </span>
            {showTechnical ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {showTechnical && (
            <div className="mt-3 p-4 bg-[#F6F8FA] rounded-[6px] border border-[#E1E7EC] space-y-3">
              <div className="text-[11px] font-sans text-[#667085] leading-relaxed">
                Variables fisiológicas de investigación preservadas internamente para calibración algorítmica y validación del prototipo wearable.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 bg-white rounded-[4px] border border-[#E1E7EC]">
                  <div className="text-[10px] text-[#667085] uppercase">Índice Perfusión (PI)</div>
                  <div className="text-base font-bold text-[#072B4A] mt-0.5">3.1 %</div>
                </div>

                <div className="p-3 bg-white rounded-[4px] border border-[#E1E7EC]">
                  <div className="text-[10px] text-[#667085] uppercase">RMSSD / SDNN</div>
                  <div className="text-base font-bold text-[#782980] mt-0.5">
                    {MOCK_POSTPRANDIAL.rmssd} / {MOCK_POSTPRANDIAL.sdnn} ms
                  </div>
                </div>

                <div className="p-3 bg-white rounded-[4px] border border-[#E1E7EC]">
                  <div className="text-[10px] text-[#667085] uppercase">PPI Promedio</div>
                  <div className="text-base font-bold text-[#072B4A] mt-0.5">
                    {MOCK_POSTPRANDIAL.ppiAvg} ms
                  </div>
                </div>
              </div>

              {/* Raw PPG Signal Preview */}
              <div className="pt-1">
                <button
                  onClick={() => setShowPPG(!showPPG)}
                  className="text-xs font-mono text-[#782980] hover:underline"
                >
                  {showPPG ? '[-] Ocultar oscilograma PPG' : '[+] Visualizar oscilograma PPG crudo (50 Hz)'}
                </button>

                {showPPG && (
                  <div className="mt-2.5 p-3 bg-white rounded-[4px] border border-[#E1E7EC]">
                    <div className="text-[10px] font-mono text-[#667085] mb-2">
                      Canal PPG Infrarrojo/Rojo · Sensor MAX30101 normalizado
                    </div>
                    <ResponsiveContainer width="100%" height={120}>
                      <LineChart data={ppgData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF1" vertical={false} />
                        <XAxis dataKey="i" hide />
                        <YAxis domain={[-1, 1]} hide />
                        <Tooltip content={({ active, payload }) => active && payload?.[0] ? (
                          <div className="bg-white border border-[#E1E7EC] rounded p-1 text-[10px] font-mono">
                            {Number(payload[0].value).toFixed(3)}
                          </div>
                        ) : null} />
                        <Line type="monotone" dataKey="raw" stroke="#782980" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
