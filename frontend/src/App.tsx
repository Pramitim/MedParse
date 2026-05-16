import { useState } from "react";
import NoteUpload from "./components/NoteUpload";
import PatientSearch from "./components/PatientSearch";
import PatientDetail from "./components/PatientDetail";
import "./App.css";

type Tab = "upload" | "patients";

function App() {
  const [tab, setTab] = useState<Tab>("upload");
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);

  function handleSelectPatient(id: number) {
    setSelectedPatient(id);
  }

  function handleBack() {
    setSelectedPatient(null);
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <h1>MedParse</h1>
          <p>Clinical note extraction and patient history</p>
        </div>
      </header>

      <nav className="tab-nav">
        <button
          className={tab === "upload" ? "tab active" : "tab"}
          onClick={() => { setTab("upload"); setSelectedPatient(null); }}
        >
          Submit Note
        </button>
        <button
          className={tab === "patients" ? "tab active" : "tab"}
          onClick={() => { setTab("patients"); setSelectedPatient(null); }}
        >
          Patient Records
        </button>
      </nav>

      <main className="main-content">
        {tab === "upload" && <NoteUpload />}
        {tab === "patients" && selectedPatient === null && (
          <PatientSearch onSelect={handleSelectPatient} />
        )}
        {tab === "patients" && selectedPatient !== null && (
          <PatientDetail patientId={selectedPatient} onBack={handleBack} />
        )}
      </main>
    </div>
  );
}

export default App;
