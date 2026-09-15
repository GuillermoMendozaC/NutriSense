import { useEffect, useState } from 'react';
import PatientOverview from '../components/PatientOverview';
import PhysiologicalDay from '../components/charts/PhysiologicalDay';
import MealTimeline from '../components/MealTimeline';
import WeeklySummaryEditorial from '../components/WeeklySummaryEditorial';
import MealDetailDrawer from '../components/MealDetailDrawer';
import { getPatientSummary } from '../services/api';
import type { PatientSummary, MealEvent, Period } from '../types';

export default function Dashboard() {
  const [summary, setSummary] = useState<PatientSummary | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<MealEvent | null>(null);
  const [period, setPeriod] = useState<Period>('today');

  useEffect(() => {
    getPatientSummary('p001').then(setSummary);
  }, []);

  if (!summary) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="font-mono text-xs text-ink-secondary flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-embs animate-pulse" />
          <span>CARGANDO ANÁLISIS FISIOLÓGICO...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Hero Data Area & Editorial Header */}
      <PatientOverview
        summary={summary}
        period={period}
        onPeriodChange={setPeriod}
      />

      {/* 2. Signature Visualization: Physiological Day */}
      <PhysiologicalDay
        measurements={summary.measurements}
        mealEvents={summary.mealEvents}
        activitySummary={summary.activitySummary}
      />

      {/* 3. Bottom Grid: Today's Feeding Events + Weekly Longitudinal Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <MealTimeline
            meals={summary.mealEvents}
            onSelectMeal={setSelectedMeal}
          />
        </div>
        <div className="lg:col-span-5">
          <WeeklySummaryEditorial />
        </div>
      </div>

      {/* 4. Slide-over Meal Detail Drawer */}
      <MealDetailDrawer
        meal={selectedMeal}
        postprandial={summary.lastPostprandial}
        onClose={() => setSelectedMeal(null)}
      />
    </div>
  );
}
