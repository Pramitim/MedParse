export interface Patient {
  patient_id: number;
  name: string;
  age: number | null;
  gender: string | null;
}

export interface Visit {
  visit_id: number;
  symptom: string | null;
  medication: string | null;
  dosage: string | null;
  data_quality_score: number | null;
}

export interface PatientDetail extends Patient {
  visits: Visit[];
}

export interface NoteResponse {
  message: string;
  job_id: string;
  status: string;
}
