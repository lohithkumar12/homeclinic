"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { checkTriage, submitIntake } from "@/lib/api";

type FormState = {
  name: string;
  phone: string;
  complaint: string;
  symptoms: string;
  consent: boolean;
};

const initial: FormState = {
  name: "",
  phone: "",
  complaint: "",
  symptoms: "",
  consent: false,
};

export default function ConsultPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [reasons, setReasons] = useState<string[]>([]);

  const clinicName = process.env.NEXT_PUBLIC_CLINIC_NAME || "HomeClinic";

  const set =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
    };

  const buildFormData = (acknowledgeEmergency: boolean) => {
    const fd = new FormData();
    fd.append("name", form.name.trim());
    fd.append("phone", form.phone.trim());
    fd.append("complaint", form.complaint.trim());
    fd.append("symptoms", form.symptoms.trim());
    fd.append("consent", form.consent ? "true" : "false");
    fd.append("acknowledge_emergency", acknowledgeEmergency ? "true" : "false");
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
    if (!form.name.trim() || !form.phone.trim() || !form.complaint.trim()) {
      setError("Please fill name, phone, and your problem.");
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
    <main>
      <header className="topbar">
        <div className="container topbar-inner">
          <Link className="topbar-brand" href="/">
            <span className="logo-mark" aria-hidden>
              +
            </span>
            <span className="logo-text">{clinicName}</span>
          </Link>
          <Link className="topbar-link" href="/">
            Back home
          </Link>
        </div>
      </header>

      <div className="container page">
        <div className="stack consult-wrap">
          <div className="consult-intro">
            <p className="trust-pill">Takes under a minute</p>
            <h1>Start consultation</h1>
            <p className="muted">Just four details — a clinic doctor will call you back.</p>
          </div>

          <div className="alert alert-soft">
            If you have severe symptoms such as chest pain, difficulty breathing, heavy bleeding, or
            sudden weakness, call <a href="tel:108"><strong>108</strong></a> or go to the nearest
            hospital right away.
          </div>

          <form className="panel stack form-interactive" onSubmit={onSubmit}>
            <label>
              Name *
              <input required value={form.name} onChange={set("name")} placeholder="Your full name" autoComplete="name" />
            </label>

            <label>
              Phone number *
              <input
                required
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                placeholder="10-digit mobile"
                autoComplete="tel"
              />
            </label>

            <label>
              Problem *
              <textarea
                required
                value={form.complaint}
                onChange={set("complaint")}
                placeholder="What is the main problem?"
              />
            </label>

            <label>
              Symptoms
              <textarea
                value={form.symptoms}
                onChange={set("symptoms")}
                placeholder="e.g. fever, body pain, headache"
              />
            </label>

            <label className="checkbox">
              <input type="checkbox" checked={form.consent} onChange={set("consent")} />
              <span>
                I confirm my information is accurate. I consent to {clinicName} contacting me for a
                phone consultation about this request.
              </span>
            </label>

            {error && <div className="alert alert-urgent">{error}</div>}

            <button className="btn btn-primary btn-glow" type="submit" disabled={loading}>
              {loading ? "Submitting…" : "Submit to clinic"}
            </button>
          </form>
        </div>
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
