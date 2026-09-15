// ============================================================
// NutriSense — API Service Layer
// Currently uses mock data. Replace with REST calls when ready.
//
// Future API endpoints:
//   GET  /api/patients
//   GET  /api/patients/:id/summary
//   GET  /api/patients/:id/measurements
//   GET  /api/patients/:id/meals
//   GET  /api/meals/:id/response
//   GET  /api/patients/:id/activity
//   GET  /api/patients/:id/signal-quality
//   GET  /api/patients/:id/device-status
//   POST /api/measurements
//   POST /api/meal-events
//   POST /api/device-status
// ============================================================

import type {
  Patient,
  PatientSummary,
  HRMeasurement,
  MealEvent,
  PostprandialResponse,
  ActivitySummary,
  SignalQuality,
  DeviceStatus,
  TrendData,
} from '../types';

import {
  MOCK_PATIENTS,
  MOCK_PATIENT_SUMMARY,
  MOCK_HR_MEASUREMENTS,
  MOCK_MEAL_EVENTS,
  MOCK_POSTPRANDIAL,
  MOCK_ACTIVITY,
  MOCK_SIGNAL_QUALITY,
  MOCK_DEVICE_STATUS,
  MOCK_TRENDS_7D,
  MOCK_TRENDS_30D,
  MOCK_TRENDS_90D,
} from '../data/mockData';

// Simulated network delay (remove when connecting to real API)
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─────────────────────────────────────────────
// Patients
// ─────────────────────────────────────────────
export async function getPatients(): Promise<Patient[]> {
  await delay(200);
  // TODO: return await fetch('/api/patients').then(r => r.json());
  return MOCK_PATIENTS;
}

export async function getPatient(patientId: string): Promise<Patient | null> {
  await delay(100);
  // TODO: return await fetch(`/api/patients/${patientId}`).then(r => r.json());
  return MOCK_PATIENTS.find((p) => p.id === patientId) ?? null;
}

// ─────────────────────────────────────────────
// Patient Summary (dashboard overview)
// ─────────────────────────────────────────────
export async function getPatientSummary(_patientId: string): Promise<PatientSummary> {
  await delay(250);
  // TODO: return await fetch(`/api/patients/${patientId}/summary`).then(r => r.json());
  return MOCK_PATIENT_SUMMARY;
}

// ─────────────────────────────────────────────
// Measurements (heart rate time series)
// ─────────────────────────────────────────────
export async function getMeasurements(_patientId: string): Promise<HRMeasurement[]> {
  await delay(150);
  // TODO: return await fetch(`/api/patients/${patientId}/measurements`).then(r => r.json());
  return MOCK_HR_MEASUREMENTS;
}

// ─────────────────────────────────────────────
// Meal Events
// ─────────────────────────────────────────────
export async function getMealEvents(_patientId: string): Promise<MealEvent[]> {
  await delay(150);
  // TODO: return await fetch(`/api/patients/${patientId}/meals`).then(r => r.json());
  return MOCK_MEAL_EVENTS;
}

// ─────────────────────────────────────────────
// Postprandial Response
// ─────────────────────────────────────────────
export async function getPostprandialResponse(_eventId: string): Promise<PostprandialResponse> {
  await delay(200);
  // TODO: return await fetch(`/api/meals/${eventId}/response`).then(r => r.json());
  return MOCK_POSTPRANDIAL;
}

// ─────────────────────────────────────────────
// Activity Summary
// ─────────────────────────────────────────────
export async function getActivitySummary(_patientId: string): Promise<ActivitySummary> {
  await delay(150);
  // TODO: return await fetch(`/api/patients/${patientId}/activity`).then(r => r.json());
  return MOCK_ACTIVITY;
}

// ─────────────────────────────────────────────
// Signal Quality
// ─────────────────────────────────────────────
export async function getSignalQuality(_patientId: string): Promise<SignalQuality> {
  await delay(150);
  // TODO: return await fetch(`/api/patients/${patientId}/signal-quality`).then(r => r.json());
  return MOCK_SIGNAL_QUALITY;
}

// ─────────────────────────────────────────────
// Device Status
// ─────────────────────────────────────────────
export async function getDeviceStatus(_patientId: string): Promise<DeviceStatus> {
  await delay(100);
  // TODO: return await fetch(`/api/patients/${patientId}/device-status`).then(r => r.json());
  return MOCK_DEVICE_STATUS;
}

// ─────────────────────────────────────────────
// Trend Data
// ─────────────────────────────────────────────
export async function getTrendData(
  _patientId: string,
  period: '7d' | '30d' | '90d'
): Promise<TrendData> {
  await delay(200);
  // TODO: return await fetch(`/api/patients/${patientId}/trends?period=${period}`).then(r => r.json());
  if (period === '30d') return MOCK_TRENDS_30D;
  if (period === '90d') return MOCK_TRENDS_90D;
  return MOCK_TRENDS_7D;
}
