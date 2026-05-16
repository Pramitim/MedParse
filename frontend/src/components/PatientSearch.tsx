import { useEffect, useState } from "react";
import { listPatients, searchPatients } from "../api";
import type { Patient } from "../types";

interface Props {
  onSelect: (patientId: number) => void;
}

export default function PatientSearch({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listPatients()
      .then(setPatients)
      .catch(() => setError("Could not load patients."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    setError("");
    if (!val.trim()) {
      setLoading(true);
      listPatients()
        .then(setPatients)
        .catch(() => setError("Could not load patients."))
        .finally(() => setLoading(false));
      return;
    }
    try {
      const results = await searchPatients(val.trim());
      setPatients(results);
    } catch {
      setError("Search failed.");
    }
  }

  return (
    <section className="card">
      <h2>Patient Records</h2>
      <input
        type="search"
        placeholder="Search by name…"
        value={query}
        onChange={handleSearch}
        className="search-input"
      />

      {loading && <p className="status-msg">Loading…</p>}
      {error && <p className="status-msg error">{error}</p>}

      {!loading && !error && patients.length === 0 && (
        <p className="empty">No patients found.</p>
      )}

      <ul className="patient-list">
        {patients.map((p) => (
          <li key={p.patient_id} className="patient-item" onClick={() => onSelect(p.patient_id)}>
            <div className="patient-name">{p.name}</div>
            <div className="patient-meta-small">
              {p.age && <span>Age {p.age}</span>}
              {p.gender && <span>{p.gender}</span>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
