"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RequestListItem, clearToken, getToken, listRequests } from "@/lib/api";

function formatStatus(s: string) {
  return s.replaceAll("_", " ");
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [rows, setRows] = useState<RequestListItem[]>([]);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listRequests({
        status: status || undefined,
        priority: priority || undefined,
        q: q || undefined,
      });
      setRows(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getToken()) {
      router.replace("/admin/login");
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="container page">
      <header className="site-header">
        <div className="brand">HomeClinic Admin</div>
        <div className="actions" style={{ marginTop: 0 }}>
          <button className="btn btn-ghost" type="button" onClick={load}>
            Refresh
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => {
              clearToken();
              router.push("/admin/login");
            }}
          >
            Log out
          </button>
        </div>
      </header>

      <div className="stack">
        <div>
          <h1>New patients</h1>
          <p className="muted">Review intake requests, call patients, update status.</p>
        </div>

        <div className="panel">
          <div className="form-grid two" style={{ marginBottom: "1rem" }}>
            <label>
              Status
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All</option>
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
                <option value="">All</option>
                <option value="urgent">Urgent</option>
                <option value="normal">Normal</option>
              </select>
            </label>
            <label>
              Search
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Name, phone, ID, complaint"
              />
            </label>
            <div style={{ display: "flex", alignItems: "end" }}>
              <button className="btn btn-primary" type="button" onClick={load}>
                Apply filters
              </button>
            </div>
          </div>

          {error && <div className="alert alert-urgent">{error}</div>}
          {loading ? (
            <p className="muted">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="muted">No requests yet.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Problem</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <Link href={`/admin/requests/${r.id}`}>
                          <strong>{r.patient_name}</strong>
                          <div className="muted">{r.public_id}</div>
                          <div className="muted">{r.phone}</div>
                        </Link>
                      </td>
                      <td>{r.complaint.slice(0, 80)}{r.complaint.length > 80 ? "…" : ""}</td>
                      <td>
                        <span className={`badge ${r.priority === "urgent" ? "badge-urgent" : "badge-normal"}`}>
                          {r.red_flag ? "Urgent" : r.priority}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-status">{formatStatus(r.status)}</span>
                      </td>
                      <td className="muted">{new Date(r.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
