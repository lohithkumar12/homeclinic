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
  const [step, setStep] = useState(1);

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
      const e = err as {
        status?: number;
        detail?: { code?: string; reasons?: string[]; message?: string };
        message?: string;
      };
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

  const goNext = () => {
    if (step === 1 && (!form.name.trim() || !form.age || !form.phone.trim())) {
      setError("Please fill name, age, and phone to continue.");
      return;
    }
    if (step === 2 && (!form.complaint.trim() || !form.duration.trim())) {
      setError("Please describe your problem and how long you’ve had it.");
      return;
    }
    setError(null);
    setStep((s) => Math.min(3, s + 1));
  };

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

      <div className="stack consult-wrap">
        <div className="consult-intro">
          <p className="trust-pill">Doctor will call you</p>
          <h1>Start consultation</h1>
          <p className="muted">Share a few details. A registered doctor from our clinic will contact you.</p>
        </div>

        <div className="stepper" aria-label="Form progress">
          <button type="button" className={step >= 1 ? "stepper-item active" : "stepper-item"} onClick={() => setStep(1)}>
            <span>1</span> About you
          </button>
          <button type="button" className={step >= 2 ? "stepper-item active" : "stepper-item"} onClick={() => setStep(2)}>
            <span>2</span> Your concern
          </button>
          <button type="button" className={step >= 3 ? "stepper-item active" : "stepper-item"} onClick={() => setStep(3)}>
            <span>3</span> Review
          </button>
        </div>

        <div className="alert alert-soft">
          If you have severe symptoms such as chest pain, difficulty breathing, heavy bleeding, or
          sudden weakness, call <a href="tel:108"><strong>108</strong></a> or go to the nearest hospital
          right away.
        </div>

        <form className="panel stack form-interactive" onSubmit={onSubmit}>
          {step === 1 && (
            <div className="form-step">
              <h2>About you</h2>
              <div className="form-grid two">
                <label>
                  Full name *
                  <input required value={form.name} onChange={set("name")} placeholder="Your full name" />
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
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <h2>Your health concern</h2>
              <label>
                Main problem *
                <textarea
                  required
                  value={form.complaint}
                  onChange={set("complaint")}
                  placeholder="Describe what you’re feeling in your own words"
                />
              </label>
              <div className="form-grid two">
                <label>
                  How long have you had it? *
                  <input required value={form.duration} onChange={set("duration")} placeholder="e.g. 2 days" />
                </label>
                <label>
                  Preferred call time
                  <input
                    value={form.preferred_time}
                    onChange={set("preferred_time")}
                    placeholder="e.g. Today evening"
                  />
                </label>
              </div>
              <label>
                Symptoms
                <textarea value={form.symptoms} onChange={set("symptoms")} placeholder="Fever, body pain, …" />
              </label>
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <h2>History & reports</h2>
              <div className="form-grid two">
                <label>
                  Existing medications
                  <textarea value={form.medications} onChange={set("medications")} placeholder="Optional" />
                </label>
                <label>
                  Allergies
                  <textarea value={form.allergies} onChange={set("allergies")} placeholder="Optional" />
                </label>
              </div>
              <label>
                Previous medical conditions
                <textarea
                  value={form.previous_conditions}
                  onChange={set("previous_conditions")}
                  placeholder="Optional"
                />
              </label>
              <label className="file-label">
                Upload reports / prescription / photos
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
                <span className="file-hint">
                  {files?.length ? `${files.length} file(s) selected` : "JPG, PNG, WEBP or PDF — optional"}
                </span>
              </label>
              <label className="checkbox">
                <input type="checkbox" checked={form.consent} onChange={set("consent")} />
                <span>
                  I confirm my information is accurate. I consent to {clinicName} collecting my health
                  and contact details so our doctors can review this request and call me for a phone
                  consultation.
                </span>
              </label>
            </div>
          )}

          {error && <div className="alert alert-urgent">{error}</div>}

          <div className="form-nav">
            {step > 1 && (
              <button className="btn btn-secondary" type="button" onClick={() => setStep((s) => s - 1)}>
                Back
              </button>
            )}
            {step < 3 ? (
              <button className="btn btn-primary btn-glow" type="button" onClick={goNext}>
                Continue
              </button>
            ) : (
              <button className="btn btn-primary btn-glow" type="submit" disabled={loading}>
                {loading ? "Submitting…" : "Submit to clinic"}
              </button>
            )}
          </div>
        </form>
      </div>

      {showEmergency && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <h2>Please seek immediate care</h2>
            <p>
              Based on what you entered, your symptoms may need urgent hospital attention.
              {reasonText ? ` Noted: ${reasonText}.` : ""}
            </p>
            <p>
              Call <strong>108</strong> or go to the nearest hospital now. Do not wait for a phone
              consultation.
            </p>
            <p className="muted">
              You can still submit so our clinic follows up afterward. We will treat it as urgent.
            </p>
            <div className="actions">
              <a className="btn btn-danger" href="tel:108">
                Call 108 now
              </a>
              <button
                className="btn btn-secondary"
                type="button"
                disabled={loading}
                onClick={() => doSubmit(true)}
              >
                Still submit as urgent
              </button>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => {
                  setShowEmergency(false);
                  setLoading(false);
                }}
              >
                Go back
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
