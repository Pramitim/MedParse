import { useState } from "react";
import { submitNote } from "../api";

export default function NoteUpload() {
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    setStatus("loading");
    try {
      const res = await submitNote(note.trim());
      setMessage(`Queued — Job ID: ${res.job_id}`);
      setStatus("success");
      setNote("");
    } catch {
      setMessage("Failed to submit note. Is the API running?");
      setStatus("error");
    }
  }

  return (
    <section className="card">
      <h2>Submit Clinical Note</h2>
      <p className="subtitle">
        Paste a raw clinical note below. The system will extract patient data automatically.
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={`e.g. "John Doe, 45 y/o male, chest pain, prescribed 5mg Amlodipine"`}
          rows={6}
          disabled={status === "loading"}
        />
        <button type="submit" disabled={status === "loading" || !note.trim()}>
          {status === "loading" ? "Submitting…" : "Submit Note"}
        </button>
      </form>
      {message && (
        <p className={`status-msg ${status}`}>{message}</p>
      )}
    </section>
  );
}
