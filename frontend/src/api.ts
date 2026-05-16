import type { NoteResponse, Patient, PatientDetail } from "./types";

const BASE = "http://localhost:8000";

export async function submitNote(note: string): Promise<NoteResponse> {
  const res = await fetch(`${BASE}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note }),
  });
  if (!res.ok) throw new Error("Failed to submit note");
  return res.json();
}

export async function listPatients(): Promise<Patient[]> {
  const res = await fetch(`${BASE}/patients`);
  if (!res.ok) throw new Error("Failed to fetch patients");
  return res.json();
}

export async function searchPatients(name: string): Promise<Patient[]> {
  const res = await fetch(`${BASE}/patients/search?name=${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error("Failed to search patients");
  return res.json();
}

export async function getPatient(patientId: number): Promise<PatientDetail> {
  const res = await fetch(`${BASE}/patients/${patientId}`);
  if (!res.ok) throw new Error("Patient not found");
  return res.json();
}
