"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import type { Doctor } from "@/lib/doctors";

type Ctx = {
  doctors: Doctor[];
  openDoctor: (id: string) => void;
  closeDoctor: () => void;
  selected: Doctor | null;
};

const DoctorModalContext = createContext<Ctx | null>(null);

export function DoctorModalProvider({
  doctors,
  children,
}: {
  doctors: Doctor[];
  children: ReactNode;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(
    () => doctors.find((d) => d.id === selectedId) ?? null,
    [doctors, selectedId],
  );

  const openDoctor = useCallback((id: string) => setSelectedId(id), []);
  const closeDoctor = useCallback(() => setSelectedId(null), []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDoctor();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected, closeDoctor]);

  return (
    <DoctorModalContext.Provider value={{ doctors, openDoctor, closeDoctor, selected }}>
      {children}
      <DoctorDetailModal />
    </DoctorModalContext.Provider>
  );
}

function useDoctorModal() {
  const ctx = useContext(DoctorModalContext);
  if (!ctx) throw new Error("useDoctorModal must be used within DoctorModalProvider");
  return ctx;
}

export function DoctorAvatar({
  doctor,
  className = "",
}: {
  doctor: Doctor;
  className?: string;
}) {
  const gradId = `docGrad-${doctor.id}`;
  return (
    <div className={`doctor-avatar ${className}`}>
      {doctor.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={doctor.photo} alt={doctor.name} />
      ) : (
        <svg className="doctor-silhouette" viewBox="0 0 80 80" aria-hidden>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2bb884" />
              <stop offset="100%" stopColor="#0a4d37" />
            </linearGradient>
          </defs>
          <circle cx="40" cy="40" r="40" fill={`url(#${gradId})`} />
          <circle cx="40" cy="30" r="12" fill="rgba(255,255,255,0.92)" />
          <path d="M18 68c4-14 14-22 22-22s18 8 22 22" fill="rgba(255,255,255,0.92)" />
        </svg>
      )}
    </div>
  );
}

export function HeroDoctorStack() {
  const { doctors, openDoctor } = useDoctorModal();
  return (
    <div className="hero-stage-visual" aria-label="Our doctors">
      <div className="hero-photo-stack">
        {doctors.slice(0, 3).map((doc, i) => (
          <button
            key={doc.id}
            type="button"
            className={`hero-photo hero-photo-${i + 1}`}
            onClick={() => openDoctor(doc.id)}
            aria-label={`View ${doc.name}`}
          >
            <DoctorAvatar doctor={doc} />
            <span className="hero-photo-caption">{doc.name.replace(/^Dr\.\s*/, "").split(" ")[0]}</span>
          </button>
        ))}
      </div>
      <p className="hero-photo-hint">Tap a doctor to view their profile</p>
    </div>
  );
}

export function DoctorGrid() {
  const { doctors, openDoctor } = useDoctorModal();
  return (
    <div className="doctor-grid">
      {doctors.map((doc, i) => (
        <button
          key={doc.id}
          type="button"
          className="doctor-card doctor-card-btn"
          style={{ animationDelay: `${0.08 * (i + 1)}s` }}
          onClick={() => openDoctor(doc.id)}
        >
          <DoctorAvatar doctor={doc} className="doctor-photo" />
          <div className="doctor-card-body">
            <h3>{doc.name}</h3>
            <p className="doctor-title">
              {doc.title} · {doc.specialty}
            </p>
            <p className="doctor-meta">
              {doc.experienceYears}+ years · {doc.languages.slice(0, 2).join(", ")}
            </p>
            <span className="doctor-view-link">View profile →</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function DoctorDetailModal() {
  const { selected, closeDoctor } = useDoctorModal();
  if (!selected) return null;

  return (
    <div
      className="modal-backdrop doctor-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="doctor-modal-title"
      onClick={closeDoctor}
    >
      <div className="modal doctor-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="doctor-modal-close" onClick={closeDoctor} aria-label="Close">
          ×
        </button>
        <div className="doctor-modal-head">
          <DoctorAvatar doctor={selected} className="doctor-modal-avatar" />
          <div>
            <h2 id="doctor-modal-title">{selected.name}</h2>
            <p className="doctor-title">
              {selected.title} · {selected.specialty}
            </p>
            <p className="muted">{selected.experienceYears}+ years experience</p>
          </div>
        </div>

        <div className="doctor-modal-body stack">
          <section>
            <h3>About</h3>
            <p>{selected.about}</p>
          </section>
          <section>
            <h3>Education</h3>
            <p>{selected.education}</p>
          </section>
          {selected.registration && (
            <section>
              <h3>Registration</h3>
              <p>{selected.registration}</p>
            </section>
          )}
          <section>
            <h3>Languages</h3>
            <p>{selected.languages.join(" · ")}</p>
          </section>
          <section>
            <h3>Available for</h3>
            <ul className="doctor-chip-list">
              {selected.availableFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="actions">
          <Link className="btn btn-primary btn-glow" href="/consult" onClick={closeDoctor}>
            Start Consultation
          </Link>
          <button type="button" className="btn btn-secondary" onClick={closeDoctor}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
