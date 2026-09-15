import { RefreshCw, WifiOff, Bell } from 'lucide-react';

interface TopbarProps {
  sidebarCollapsed: boolean;
}

export default function Topbar({ sidebarCollapsed }: TopbarProps) {
  const isConnected = true; // From mock: wearable is connected
  const lastSync = 'Hace 2 min';

  return (
    <header
      className={`
        fixed top-0 right-0 h-14 bg-white border-b border-border z-20
        flex items-center justify-between px-5
        transition-all duration-300
        ${sidebarCollapsed ? 'left-[68px]' : 'left-[240px]'}
      `}
    >
      {/* Left: sync status */}
      <div className="flex items-center gap-2 text-xs">
        {isConnected ? (
          <>
            <span className="w-2 h-2 rounded-full bg-success animate-pulse flex-shrink-0" />
            <span className="text-success font-medium">Datos actualizados</span>
            <span className="text-text-secondary">·</span>
            <div className="flex items-center gap-1 text-text-secondary">
              <RefreshCw size={11} />
              <span>{lastSync}</span>
            </div>
          </>
        ) : (
          <>
            <WifiOff size={13} className="text-warning" />
            <span className="text-warning font-medium">Sin datos recientes</span>
          </>
        )}
      </div>

      {/* Right: actions + avatar */}
      <div className="flex items-center gap-3">
        <button className="relative p-1.5 rounded-lg text-text-secondary hover:bg-background transition-colors">
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary-purple" />
        </button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-border">
          <div className="text-right">
            <div className="text-xs font-semibold text-text-primary">Dr. Andres M.</div>
            <div className="text-[10px] text-text-secondary">Nutricionista</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-blue flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            AM
          </div>
        </div>
      </div>
    </header>
  );
}
