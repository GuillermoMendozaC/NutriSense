// ============================================================
// NutriSense — Type Definitions
// ============================================================

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  email: string;
  phone: string;
  dietaryPlan: string;
  lastSync: string; // ISO timestamp
  wearableConnected: boolean;
  deviceId: string;
  dataQuality: number; // 0-100
  recordsToday: number;
  notes?: string;
}

export interface HRMeasurement {
  timestamp: string;
  bpm: number;
  spo2: number;
  perfusionIndex: number;
  activity: 'rest' | 'light' | 'moderate' | 'intense';
}

export interface ActivitySample {
  hour: number;
  level: 'rest' | 'light' | 'moderate' | 'intense';
  steps: number;
  minutes: number;
}

export interface ActivitySummary {
  patientId: string;
  date: string;
  totalSteps: number;
  stepGoal: number;
  activeMinutes: number;
  sedentaryMinutes: number;
  predominantLevel: 'rest' | 'light' | 'moderate' | 'intense';
  hourlyBreakdown: ActivitySample[];
}

export interface MealEvent {
  id: string;
  patientId: string;
  type: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  timestamp: string; // ISO - start time
  durationMinutes: number;
  status: 'confirmed' | 'pending' | 'discarded';
  deltaHR: number; // bpm change vs basal
  dataQuality: number; // 0-100
  notes?: string;
}

export interface PostprandialResponse {
  mealEventId: string;
  patientId: string;
  mealType: string;
  startTime: string;
  endTime: string;
  basalHR: number;
  maxHR: number;
  deltaHR: number;
  deltaHRPercent: number;
  recoveryTimeMinutes: number;
  basalPI: number;
  postprandialPI: number;
  deltaPI: number;
  prv: number; // PRV delta %
  rmssd: number;
  sdnn: number;
  ppiAvg: number;
  episodeQuality: number;
  priorActivity: 'low' | 'moderate' | 'high';
  posteriorActivity: 'low' | 'moderate' | 'high';
  timeline: PostprandialTimepoint[];
}

export interface PostprandialTimepoint {
  minuteOffset: number; // -30 to +90
  hr: number;
  pi: number;
  activity: 'rest' | 'light' | 'moderate' | 'intense';
}

export interface SignalQuality {
  patientId: string;
  date: string;
  globalQuality: number;
  ppgQuality: number;
  imuQuality: number;
  discardedByMotion: number;
  timeWithoutContact: number;
  hourlyQuality: { hour: number; quality: number }[];
}

export interface DeviceStatus {
  patientId: string;
  deviceName: string;
  bleStatus: 'connected' | 'disconnected' | 'pairing';
  batteryPercent: number;
  lastSync: string;
  firmwareVersion: string;
  sensors: {
    ppg: { model: string; status: 'ok' | 'error' | 'warning' };
    imu: { model: string; status: 'ok' | 'error' | 'warning' };
    mcu: { model: string; status: 'ok' | 'error' | 'warning' };
  };
}

export interface TrendPoint {
  date: string;
  value: number;
}

export interface TrendData {
  patientId: string;
  period: '7d' | '30d' | '90d';
  restingHR: TrendPoint[];
  avgHR: TrendPoint[];
  avgSpO2: TrendPoint[];
  dailySteps: TrendPoint[];
  activeMinutes: TrendPoint[];
  sedentaryMinutes: TrendPoint[];
  mealsPerDay: TrendPoint[];
  avgPostprandialDeltaHR: TrendPoint[];
}

export interface PatientSummary {
  patient: Patient;
  currentHR: number;
  restingHR: number;
  hrTrendBpm: number;
  currentSpO2: number;
  dailySteps: number;
  stepGoal: number;
  activeMinutes: number;
  sedentaryMinutes: number;
  mealsDetected: number;
  mealsConfirmed: number;
  dataQuality: number;
  measurements: HRMeasurement[];
  mealEvents: MealEvent[];
  lastPostprandial: PostprandialResponse;
  activitySummary: ActivitySummary;
  signalQuality: SignalQuality;
  deviceStatus: DeviceStatus;
}

export type Period = 'today' | '7d' | '30d' | 'custom';
export type NavPage =
  | 'dashboard'
  | 'patients'
  | 'meals'
  | 'postprandial'
  | 'activity'
  | 'trends'
  | 'signal-quality'
  | 'device'
  | 'settings';
