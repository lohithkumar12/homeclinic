"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { checkTriage, submitIntake } from "@/lib/api";

type FormState = {
  name: string;
  age: string;
  gender: string;
  phone: string;
  location: string;
  complaint: string;
  duration: string;
  symptoms: string;
  medications: string;
  allergies: string;
  previous_conditions: string;
  preferred_time: string;
  consent: boolean;
};

const initial: FormState = {
  name: "",
  age: "",
  gender: "male",
  phone: "",
  location: "",
  complaint: "",
  duration: "",
  symptoms: "",
  medications: "",
  allergies: "",
  previous_conditions: "",
  preferred_time: "",
  consent: false,
};

export default function ConsultPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initial);
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [reasons, setReasons] = useState<string[]>([]);

  const clinicName = process.env.NEXT_PUBLIC_CLINIC_NAME || "HomeClinic";

  const set =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
    };

  const buildFormData = (acknowledgeEmergency: boolean) => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === "consent") fd.append("consent", form.consent ? "true" : "false");
      else fd.append(k, String(v));
    });
    fd.append("acknowledge_emergency", acknowledgeEmergency ? "true" : "false");
    if (files) {
      Array.from(files).forEach((f) => fd.append("files", f));
    }
    return fd;
  };

  const doSubmit = async (acknowledgeEmergency: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const result = await submitIntake(buildFormData(acknowledgeEmergency));
      const params = new URLSearchParams({
        id: result.public_id,
        phone: result.clinic.phone,
        hours: result.clinic.hours,
        urgent: result.red_flag ? "1" : "0",
      });
      router.push(`/success?${params.toString()}`);
    } catch (err: unknown) {
      const e = err as { status?: number; detail?: { code?: string; reasons?: string[]; message?: string }; message?: string };
      if (e.status === 409 && e.detail?.code === "RED_FLAG") {
        setReasons(e.detail.reasons || []);
        setShowEmergency(true);
      } else {
        setError(e.detail?.message || e.message || "Could not submit request");
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.consent) {
      setError("Please accept the consent terms to continue.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const triage = await checkTriage(form.complaint, form.symptoms);
      if (triage.red_flag) {
        setReasons(triage.reasons);
        setShowEmergency(true);
        setLoading(false);
        return;
      }
      await doSubmit(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  const reasonText = useMemo(() => reasons.join(", "), [reasons]);

  return (
    <main className="container page">
      <header className="site-header">
        <Link className="brand" href="/">
          {clinicName}
        </Link>
        <Link className="nav-link" href="/">
          Back home
        </Link>
      </header>

      <div className="stack" style={{ maxWidth: 760, margin: "0 auto" }}>
        <div>
          <h1>Start consultation</h1>
          <p className="muted">Phone consultation request — a clinic doctor will contact you.</p>
        </div>

        <div className="alert alert-warn">
          Not for emergencies. If you have severe symptoms such as chest pain, difficulty breathing,
          uncontrolled bleeding, sudden weakness, or loss of consciousness, call local emergency
          services immediately (e.g. 108 / 112) or go to the nearest emergency department. {clinicName}{" "}
          is not an emergency service.
        </div>

        <form className="panel stack" onSubmit={onSubmit}>
          <div className="form-grid two">
            <label>
              Full name *
              <input required value={form.name} onChange={set("name")} />
            </label>
            <label>
              Age *
              <input required type="number" min={0} max={120} value={form.age} onChange={set("age")} />
            </label>
            <label>
              Gender *
              <select value={form.gender} onChange={set("gender")}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </label>
            <label>
              Phone *
              <input required value={form.phone} onChange={set("phone")} placeholder="10-digit mobile" />
            </label>
          </div>

          <label>
            Location
            <input value={form.location} onChange={set("location")} placeholder="City / area" />
          </label>

          <label>
            Main problem *
            <textarea required value={form.complaint} onChange={set("complaint")} placeholder="Describe your problem" />
          </label>

          <div className="form-grid two">
            <label>
              How long have you had it? *
              <input required value={form.duration} onChange={set("duration")} placeholder="e.g. 2 days" />
            </label>
            <label>
              Preferred consultation time
              <input value={form.preferred_time} onChange={set("preferred_time")} placeholder="e.g. Today evening" />
            </label>
          </div>

          <label>
            Symptoms
            <textarea value={form.symptoms} onChange={set("symptoms")} placeholder="Fever, body pain, ..." />
          </label>

          <div className="form-grid two">
            <label>
              Existing medications
              <textarea value={form.medications} onChange={set("medications")} />
            </label>
            <label>
              Allergies
              <textarea value={form.allergies} onChange={set("allergies")} />
            </label>
          </div>

          <label>
            Previous medical conditions
            <textarea value={form.previous_conditions} onChange={set("previous_conditions")} />
          </label>

          <label>
            Upload reports / prescription / photos (optional)
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
          </label>

          <label className="checkbox">
            <input type="checkbox" checked={form.consent} onChange={set("consent")} />
            <span>
              I confirm my information is accurate. I consent to {clinicName} collecting my health and
              contact details to review this request and contact me. I understand this is not an
              emergency service. I consent to a phone consultation if offered.
            </span>
          </label>

          {error && <div className="alert alert-urgent">{error}</div>}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Submitting…" : "Submit request"}
          </button>
        </form>
      </div>

      {showEmergency && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <h2>Possible emergency — seek immediate care</h2>
            <p>
              Based on what you entered, your symptoms may require urgent medical attention.
              {reasonText ? ` Flagged: ${reasonText}.` : ""}
            </p>
            <p>
              Please contact emergency services or go to the nearest emergency department now. Do not
              wait for an online or phone consultation.
            </p>
            <p className="muted">
              If you still want our clinic team to follow up afterward, you may submit your request.
              We will treat it as urgent — this does not replace emergency care.
            </p>
            <div className="actions">
              <a className="btn btn-danger" href="tel:108">
                Call emergency services (108)
              </a>
              <button
                className="btn btn-secondary"
                type="button"
                disabled={loading}
                onClick={() => doSubmit(true)}
              >
                I understand — still submit as urgent
              </button>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => {
                  setShowEmergency(false);
                  setLoading(false);
                }}
              >
                Cancel and exit
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
