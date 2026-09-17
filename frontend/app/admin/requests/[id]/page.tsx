"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RequestDetail, getRequest, getToken, updateRequest } from "@/lib/api";

export default function RequestDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const [data, setData] = useState<RequestDetail | null>(null);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [scheduleNote, setScheduleNote] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const req = await getRequest(id);
      setData(req);
      setStatus(req.status);
      setPriority(req.priority);
      setScheduleNote(req.scheduled_at_note || "");
    } catch {
      setError("Could not load request");
    }
  };

  useEffect(() => {
    if (!getToken()) {
      router.replace("/admin/login");
      return;
    }
    if (!Number.isFinite(id)) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateRequest(id, {
        status,
        priority,
        scheduled_at_note: scheduleNote,
        note: note.trim() || undefined,
      });
      setData(updated);
      setNote("");
    } catch {
      setError("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (!data) {
    return (
      <main className="container page">
        <p className="muted">{error || "Loading…"}</p>
      </main>
    );
  }

  const p = data.patient;

  return (
    <main className="container page">
      <header className="site-header">
        <Link className="brand" href="/admin">
          ← Requests
        </Link>
        <a className="btn btn-primary" href={`tel:${p.phone}`}>
          Call patient
        </a>
      </header>

      <div className="stack" style={{ maxWidth: 860, margin: "0 auto" }}>
        <div>
          <p className="muted">{data.public_id}</p>
          <h1>
            {p.name}{" "}
            {data.red_flag && <span className="badge badge-urgent">Urgent</span>}
          </h1>
          <p className="muted">
            Age {p.age} · {p.gender.replaceAll("_", " ")} · {p.phone}
            {p.location ? ` · ${p.location}` : ""}
          </p>
        </div>

        {data.red_flag && (
          <div className="alert alert-urgent">
            Red-flag reasons: {data.red_flag_reasons.join(", ") || "flagged symptoms"}
          </div>
        )}

        <div className="panel stack">
          <h2>Complaint</h2>
          <p>{data.complaint}</p>
          <p className="muted">Duration: {data.duration}</p>
          {data.symptoms && (
            <>
              <h2>Symptoms</h2>
              <p>{data.symptoms}</p>
            </>
          )}
          {(data.medications || data.allergies || data.previous_conditions) && (
            <div className="form-grid two">
              <div>
                <h2>Medications</h2>
                <p>{data.medications || "—"}</p>
              </div>
              <div>
                <h2>Allergies</h2>
                <p>{data.allergies || "—"}</p>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <h2>Previous conditions</h2>
                <p>{data.previous_conditions || "—"}</p>
              </div>
            </div>
          )}
          {data.preferred_time && <p className="muted">Preferred time: {data.preferred_time}</p>}
        </div>

        <div className="panel stack">
          <h2>Uploaded documents</h2>
          {data.attachments.length === 0 ? (
            <p className="muted">No files uploaded.</p>
          ) : (
            <ul>
              {data.attachments.map((a) => (
                <li key={a.id}>
                  <a href={a.url} target="_blank" rel="noreferrer">
                    {a.original_filename}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel stack">
          <h2>Clinic actions</h2>
          <div className="form-grid two">
            <label>
              Status
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="new">New</option>
                <option value="contact_pending">Contact pending</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="closed">Closed</option>
              </select>
            </label>
            <label>
              Priority
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>
            </label>
          </div>
          <label>
            Schedule note (date/time)
            <input
              value={scheduleNote}
              onChange={(e) => setScheduleNote(e.target.value)}
              placeholder="e.g. 18 Sep 6:30 PM phone call"
            />
          </label>
          <label>
            Add clinical / staff note
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Call summary, advice given…" />
          </label>
          {error && <div className="alert alert-urgent">{error}</div>}
          <button className="btn btn-primary" type="button" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save updates"}
          </button>
        </div>

        <div className="panel stack">
          <h2>Notes</h2>
          {data.notes.length === 0 ? (
            <p className="muted">No notes yet.</p>
          ) : (
            data.notes.map((n) => (
              <div key={n.id}>
                <p>{n.body}</p>
                <p className="muted">{new Date(n.created_at).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
