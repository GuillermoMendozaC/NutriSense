import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#F6F8FA] text-[#172B3A] font-sans antialiased">
      <Sidebar />
      <main className="pl-[210px] min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-6 md:px-8 md:py-7">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
