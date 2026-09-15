import { useNavigate, useLocation } from 'react-router-dom';

interface NavItem {
  num: string;
  label: string;
  path: string;
}

const mainNav: NavItem[] = [
  { num: '01', label: 'Resumen', path: '/' },
  { num: '02', label: 'Pacientes', path: '/pacientes' },
  { num: '03', label: 'Alimentación', path: '/alimentacion' },
  { num: '04', label: 'Tendencias', path: '/tendencias' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[210px] bg-[#072B4A] flex flex-col justify-between z-30 select-none border-r border-[#051E34]">
      {/* Top: NutriSense Brand & Navigation */}
      <div>
        {/* Brand header */}
        <div className="px-5 pt-6 pb-5 border-b border-[#0E3D66]">
          <div className="text-lg font-bold tracking-tight leading-none">
            <span className="text-white">Nutri</span>
            <span className="text-[#9A4E9C]">Sense</span>
          </div>
          <div className="text-[11px] text-white/70 mt-1.5 font-sans leading-tight">
            Seguimiento nutricional inteligente
          </div>
        </div>

        {/* Primary Editorial Navigation */}
        <nav className="pt-4 space-y-1">
          {mainNav.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-between px-5 py-2.5 text-left text-xs font-medium transition-colors relative group ${
                  active
                    ? 'text-white font-semibold'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {/* Active indicator: fine lateral line in #782980 */}
                {active && (
                  <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#782980]" />
                )}

                <span className="flex items-center gap-3">
                  <span className={`font-mono text-[11px] ${active ? 'text-[#9A4E9C] font-semibold' : 'text-white/50'}`}>
                    {item.num}
                  </span>
                  <span>{item.label}</span>
                </span>
              </button>
            );
          })}

          <div className="my-3 mx-5 border-t border-[#0E3D66]" />

          {/* Configuración */}
          <button
            onClick={() => navigate('/configuracion')}
            className={`w-full flex items-center justify-between px-5 py-2.5 text-left text-xs font-medium transition-colors relative group ${
              isActive('/configuracion')
                ? 'text-white font-semibold'
                : 'text-white/70 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {isActive('/configuracion') && (
              <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#782980]" />
            )}
            <span className="flex items-center gap-3">
              <span className={`font-mono text-[11px] ${isActive('/configuracion') ? 'text-[#9A4E9C] font-semibold' : 'text-white/50'}`}>
                05
              </span>
              <span>Configuración</span>
            </span>
          </button>
        </nav>
      </div>

      {/* Bottom: Institutional Backing Zone (Discrete Clean White Surface) */}
      <div className="p-4 border-t border-[#0E3D66]">
        <div className="text-[9px] font-mono text-white/50 uppercase tracking-wider mb-2 text-center">
          Respaldo Institucional
        </div>

        {/* Small clean white surface so original full-color logos keep 100% natural contrast */}
        <div className="bg-white rounded-[6px] px-3 py-2.5 flex items-center justify-between gap-2 shadow-sm">
          <img
            src="/logos/embs-espol-horizontal.png"
            alt="IEEE EMBS ESPOL"
            className="h-7 w-auto max-w-[95px] object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logos/embs-espol-color.png';
            }}
          />
          <div className="h-5 w-px bg-[#E1E7EC]" />
          <img
            src="/logos/espol-logo.png"
            alt="ESPOL"
            className="h-5 w-auto max-w-[55px] object-contain"
          />
        </div>
      </div>
    </aside>
  );
}
