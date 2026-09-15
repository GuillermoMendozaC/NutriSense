import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Alimentacion from './pages/Alimentacion';
import Trends from './pages/Trends';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Main simplified routes */}
          <Route index element={<Dashboard />} />
          <Route path="pacientes" element={<Patients />} />
          <Route path="alimentacion" element={<Alimentacion />} />
          <Route path="tendencias" element={<Trends />} />
          <Route path="configuracion" element={<Settings />} />

          {/* Legacy redirects */}
          <Route path="ingestas" element={<Navigate to="/alimentacion" replace />} />
          <Route path="postprandial" element={<Navigate to="/alimentacion" replace />} />
          <Route path="actividad" element={<Navigate to="/" replace />} />
          <Route path="calidad" element={<Navigate to="/" replace />} />
          <Route path="dispositivo" element={<Navigate to="/configuracion" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
