import { useEffect, useState } from "react";
import { getPatient } from "../api";
import type { PatientDetail as PatientDetailType } from "../types";

interface Props {
  patientId: number;
  onBack: () => void;
}

function QualityBadge({ score }: { score: number | null }) {
  const s = score ?? 0;
  const cls = s >= 80 ? "badge-high" : s >= 50 ? "badge-mid" : "badge-low";
  return <span className={`badge ${cls}`}>{s}/100</span>;
}

export default function PatientDetail({ patientId, onBack }: Props) {
  const [patient, setPatient] = useState<PatientDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPatient(patientId)
      .then(setPatient)
      .catch(() => setError("Could not load patient."))
      .finally(() => setLoading(false));
  }, [patientId]);

  if (loading) return <p className="status-msg">Loading…</p>;
  if (error) return <p className="status-msg error">{error}</p>;
  if (!patient) return null;

  return (
    <section className="card">
      <button className="back-btn" onClick={onBack}>← Back to Search</button>
      <div className="patient-header">
        <h2>{patient.name}</h2>
        <div className="patient-meta">
          {patient.age && <span>Age: {patient.age}</span>}
          {patient.gender && <span>Gender: {patient.gender}</span>}
          <span>{patient.visits.length} visit{patient.visits.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {patient.visits.length === 0 ? (
        <p className="empty">No visits recorded yet.</p>
      ) : (
        <div className="visits">
          {patient.visits.map((v) => (
            <div className="visit-card" key={v.visit_id}>
              <div className="visit-row">
                <span className="visit-label">Symptom</span>
                <span>{v.symptom ?? "—"}</span>
              </div>
              <div className="visit-row">
                <span className="visit-label">Medication</span>
                <span>{v.medication ?? "—"}</span>
              </div>
              <div className="visit-row">
                <span className="visit-label">Dosage</span>
                <span>{v.dosage ?? "—"}</span>
              </div>
              <div className="visit-row">
                <span className="visit-label">Data Quality</span>
                <QualityBadge score={v.data_quality_score} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
