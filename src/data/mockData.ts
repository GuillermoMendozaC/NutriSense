// ============================================================
// NutriSense — Mock Data (Simulated realistic data)
// All timestamps use ISO 8601 format
// ============================================================

import type {
  Patient,
  HRMeasurement,
  MealEvent,
  PostprandialResponse,
  ActivitySummary,
  SignalQuality,
  DeviceStatus,
  TrendData,
  PatientSummary,
} from '../types';

// ─────────────────────────────────────────────
// PATIENTS
// ─────────────────────────────────────────────
export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p001',
    name: 'Sophia Eras',
    age: 28,
    gender: 'F',
    email: 'sophia.eras@email.com',
    phone: '+593 99 123 4567',
    dietaryPlan: 'Control de peso y glucemia',
    lastSync: '2026-09-07T19:24:00-05:00',
    wearableConnected: true,
    deviceId: 'NS-BAND-001',
    dataQuality: 94,
    recordsToday: 1247,
    notes: 'Paciente con seguimiento de respuesta postprandial. Sin patologías crónicas documentadas.',
  },
  {
    id: 'p002',
    name: 'George Burgos',
    age: 35,
    gender: 'M',
    email: 'george.burgos@email.com',
    phone: '+593 99 234 5678',
    dietaryPlan: 'Dieta mediterránea - control lipídico',
    lastSync: '2026-09-07T18:52:00-05:00',
    wearableConnected: true,
    deviceId: 'NS-BAND-002',
    dataQuality: 89,
    recordsToday: 986,
    notes: 'Seguimiento activo. Meta de pasos: 10 000/día.',
  },
  {
    id: 'p003',
    name: 'Lizz Villegas',
    age: 42,
    gender: 'F',
    email: 'lizz.villegas@email.com',
    phone: '+593 99 345 6789',
    dietaryPlan: 'Reducción de carbohidratos simples',
    lastSync: '2026-09-07T17:30:00-05:00',
    wearableConnected: false,
    deviceId: 'NS-BAND-003',
    dataQuality: 71,
    recordsToday: 634,
    notes: 'Dispositivo desconectado desde las 17:30. Verificar estado de batería.',
  },
];

// ─────────────────────────────────────────────
// HEART RATE MEASUREMENTS (today, hourly detail)
// ─────────────────────────────────────────────
function genHRTimeline(): HRMeasurement[] {
  const data: HRMeasurement[] = [];
  const baseDate = '2026-09-07';
  const mealEvents = [
    { hour: 8, minute: 15, peak: 73, label: 'breakfast' },
    { hour: 13, minute: 42, peak: 82, label: 'lunch' },
    { hour: 17, minute: 20, peak: 70, label: 'snack' },
    { hour: 20, minute: 35, peak: 76, label: 'dinner' },
  ];

  for (let hour = 6; hour <= 21; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      const t = hour + minute / 60;
      let bpm = 64 + Math.sin(t * 0.4) * 4 + (Math.random() - 0.5) * 3;

      // Simulate meal responses
      for (const meal of mealEvents) {
        const mealT = meal.hour + meal.minute / 60;
        const diff = t - mealT;
        if (diff >= 0 && diff <= 0.5) {
          bpm += (meal.peak - 64) * Math.exp(-diff * 4);
        }
      }

      // Morning arousal
      if (hour < 8) bpm -= 4;
      if (hour >= 22) bpm -= 6;

      const activity: HRMeasurement['activity'] =
        bpm > 90 ? 'moderate' : bpm > 75 ? 'light' : 'rest';

      data.push({
        timestamp: `${baseDate}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00-05:00`,
        bpm: Math.round(Math.max(55, Math.min(100, bpm))),
        spo2: 96 + Math.round(Math.random() * 3),
        perfusionIndex: parseFloat((2.1 + Math.random() * 1.5).toFixed(2)),
        activity,
      });
    }
  }
  return data;
}

export const MOCK_HR_MEASUREMENTS: HRMeasurement[] = genHRTimeline();

// ─────────────────────────────────────────────
// MEAL EVENTS
// ─────────────────────────────────────────────
export const MOCK_MEAL_EVENTS: MealEvent[] = [
  {
    id: 'me001',
    patientId: 'p001',
    type: 'breakfast',
    timestamp: '2026-09-07T08:15:00-05:00',
    durationMinutes: 18,
    status: 'confirmed',
    deltaHR: 9,
    dataQuality: 96,
    notes: 'Desayuno ligero. Fruta y avena.',
  },
  {
    id: 'me002',
    patientId: 'p001',
    type: 'lunch',
    timestamp: '2026-09-07T13:42:00-05:00',
    durationMinutes: 24,
    status: 'confirmed',
    deltaHR: 18,
    dataQuality: 94,
    notes: 'Almuerzo principal. Respuesta FC notable.',
  },
  {
    id: 'me003',
    patientId: 'p001',
    type: 'snack',
    timestamp: '2026-09-07T17:20:00-05:00',
    durationMinutes: 8,
    status: 'pending',
    deltaHR: 6,
    dataQuality: 87,
    notes: 'Evento detectado automáticamente. Pendiente confirmación.',
  },
  {
    id: 'me004',
    patientId: 'p001',
    type: 'dinner',
    timestamp: '2026-09-07T20:35:00-05:00',
    durationMinutes: 21,
    status: 'confirmed',
    deltaHR: 12,
    dataQuality: 95,
  },
];

// ─────────────────────────────────────────────
// POSTPRANDIAL RESPONSE — last meal (lunch)
// ─────────────────────────────────────────────
function genPostprandialTimeline(): PostprandialResponse['timeline'] {
  const points = [];
  for (let min = -30; min <= 90; min += 5) {
    let hr = 64;
    let pi = 2.4;
    if (min >= 0 && min <= 40) {
      hr = 64 + (18 * Math.exp(-((min - 10) ** 2) / 300));
      pi = 2.4 + (0.7 * Math.exp(-((min - 15) ** 2) / 400));
    } else if (min > 40) {
      const decay = (min - 40) / 50;
      hr = 64 + Math.max(0, 6 * (1 - decay));
      pi = 2.4 + Math.max(0, 0.2 * (1 - decay));
    }
    points.push({
      minuteOffset: min,
      hr: Math.round(hr + (Math.random() - 0.5) * 2),
      pi: parseFloat((pi + (Math.random() - 0.5) * 0.1).toFixed(2)),
      activity: 'rest' as const,
    });
  }
  return points;
}

export const MOCK_POSTPRANDIAL: PostprandialResponse = {
  mealEventId: 'me002',
  patientId: 'p001',
  mealType: 'Almuerzo',
  startTime: '2026-09-07T13:42:00-05:00',
  endTime: '2026-09-07T14:06:00-05:00',
  basalHR: 64,
  maxHR: 82,
  deltaHR: 18,
  deltaHRPercent: 28,
  recoveryTimeMinutes: 42,
  basalPI: 2.4,
  postprandialPI: 3.1,
  deltaPI: 0.7,
  prv: -8,
  rmssd: 42.3,
  sdnn: 58.1,
  ppiAvg: 835,
  episodeQuality: 96,
  priorActivity: 'low',
  posteriorActivity: 'low',
  timeline: genPostprandialTimeline(),
};

// ─────────────────────────────────────────────
// ACTIVITY SUMMARY
// ─────────────────────────────────────────────
export const MOCK_ACTIVITY: ActivitySummary = {
  patientId: 'p001',
  date: '2026-09-07',
  totalSteps: 7421,
  stepGoal: 8000,
  activeMinutes: 64,
  sedentaryMinutes: 312,
  predominantLevel: 'light',
  hourlyBreakdown: [
    { hour: 6, level: 'rest', steps: 0, minutes: 60 },
    { hour: 7, level: 'light', steps: 850, minutes: 45 },
    { hour: 8, level: 'rest', steps: 120, minutes: 50 },
    { hour: 9, level: 'light', steps: 640, minutes: 35 },
    { hour: 10, level: 'rest', steps: 90, minutes: 55 },
    { hour: 11, level: 'light', steps: 710, minutes: 40 },
    { hour: 12, level: 'moderate', steps: 1200, minutes: 25 },
    { hour: 13, level: 'rest', steps: 80, minutes: 58 },
    { hour: 14, level: 'rest', steps: 60, minutes: 60 },
    { hour: 15, level: 'light', steps: 580, minutes: 38 },
    { hour: 16, level: 'light', steps: 490, minutes: 42 },
    { hour: 17, level: 'moderate', steps: 980, minutes: 30 },
    { hour: 18, level: 'light', steps: 440, minutes: 45 },
    { hour: 19, level: 'rest', steps: 110, minutes: 55 },
    { hour: 20, level: 'rest', steps: 71, minutes: 60 },
  ],
};

// ─────────────────────────────────────────────
// SIGNAL QUALITY
// ─────────────────────────────────────────────
export const MOCK_SIGNAL_QUALITY: SignalQuality = {
  patientId: 'p001',
  date: '2026-09-07',
  globalQuality: 94,
  ppgQuality: 92,
  imuQuality: 99,
  discardedByMotion: 7,
  timeWithoutContact: 3,
  hourlyQuality: Array.from({ length: 16 }, (_, i) => ({
    hour: 6 + i,
    quality: Math.round(88 + Math.random() * 10),
  })),
};

// ─────────────────────────────────────────────
// DEVICE STATUS
// ─────────────────────────────────────────────
export const MOCK_DEVICE_STATUS: DeviceStatus = {
  patientId: 'p001',
  deviceName: 'NutriSense Band',
  bleStatus: 'connected',
  batteryPercent: 78,
  lastSync: '2026-09-07T19:24:00-05:00',
  firmwareVersion: 'v0.1.0',
  sensors: {
    ppg: { model: 'MAX30101 + MAX32664', status: 'ok' },
    imu: { model: 'MPU6050', status: 'ok' },
    mcu: { model: 'ESP32-C3 (XIAO)', status: 'ok' },
  },
};

// ─────────────────────────────────────────────
// TREND DATA
// ─────────────────────────────────────────────
function genTrendPoints(days: number, base: number, variance: number) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date('2026-09-07');
    d.setDate(d.getDate() - (days - 1 - i));
    return {
      date: d.toISOString().slice(0, 10),
      value: Math.round((base + (Math.random() - 0.5) * variance) * 10) / 10,
    };
  });
}

export const MOCK_TRENDS_7D: TrendData = {
  patientId: 'p001',
  period: '7d',
  restingHR: genTrendPoints(7, 65, 4),
  avgHR: genTrendPoints(7, 72, 5),
  avgSpO2: genTrendPoints(7, 97.5, 1),
  dailySteps: genTrendPoints(7, 7200, 1500),
  activeMinutes: genTrendPoints(7, 60, 20),
  sedentaryMinutes: genTrendPoints(7, 320, 60),
  mealsPerDay: genTrendPoints(7, 3.8, 0.8),
  avgPostprandialDeltaHR: genTrendPoints(7, 13, 5),
};

export const MOCK_TRENDS_30D: TrendData = {
  patientId: 'p001',
  period: '30d',
  restingHR: genTrendPoints(30, 65.5, 5),
  avgHR: genTrendPoints(30, 72, 6),
  avgSpO2: genTrendPoints(30, 97.4, 1.2),
  dailySteps: genTrendPoints(30, 7000, 2000),
  activeMinutes: genTrendPoints(30, 58, 25),
  sedentaryMinutes: genTrendPoints(30, 330, 70),
  mealsPerDay: genTrendPoints(30, 3.7, 1),
  avgPostprandialDeltaHR: genTrendPoints(30, 13.5, 6),
};

export const MOCK_TRENDS_90D: TrendData = {
  patientId: 'p001',
  period: '90d',
  restingHR: genTrendPoints(90, 66, 6),
  avgHR: genTrendPoints(90, 72.5, 7),
  avgSpO2: genTrendPoints(90, 97.3, 1.5),
  dailySteps: genTrendPoints(90, 6800, 2200),
  activeMinutes: genTrendPoints(90, 56, 28),
  sedentaryMinutes: genTrendPoints(90, 340, 80),
  mealsPerDay: genTrendPoints(90, 3.6, 1.2),
  avgPostprandialDeltaHR: genTrendPoints(90, 14, 7),
};

// ─────────────────────────────────────────────
// PATIENT SUMMARY (Sophia Eras - p001)
// ─────────────────────────────────────────────
export const MOCK_PATIENT_SUMMARY: PatientSummary = {
  patient: MOCK_PATIENTS[0],
  currentHR: 72,
  restingHR: 64,
  hrTrendBpm: -3,
  currentSpO2: 98,
  dailySteps: 7421,
  stepGoal: 8000,
  activeMinutes: 64,
  sedentaryMinutes: 312,
  mealsDetected: 4,
  mealsConfirmed: 3,
  dataQuality: 94,
  measurements: MOCK_HR_MEASUREMENTS,
  mealEvents: MOCK_MEAL_EVENTS,
  lastPostprandial: MOCK_POSTPRANDIAL,
  activitySummary: MOCK_ACTIVITY,
  signalQuality: MOCK_SIGNAL_QUALITY,
  deviceStatus: MOCK_DEVICE_STATUS,
};
