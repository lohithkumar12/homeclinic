import Link from "next/link";
import { getClinic } from "@/lib/api";
import { doctors } from "@/lib/doctors";
import {
  DoctorGrid,
  DoctorModalProvider,
  HeroDoctorStack,
} from "@/components/DoctorsInteractive";
import QuickIntakeForm from "@/components/QuickIntakeForm";

export default async function HomePage() {
  let clinicName = process.env.NEXT_PUBLIC_CLINIC_NAME || "HomeClinic";
  let clinicPhone = "";
  try {
    const clinic = await getClinic();
    clinicName = clinic.name;
    clinicPhone = clinic.phone;
  } catch {
    // API may be offline during first paint
  }

  return (
    <DoctorModalProvider doctors={doctors}>
      <main className="home">
        <header className="topbar">
          <div className="container topbar-inner">
            <Link className="topbar-brand" href="/">
              <span className="logo-mark" aria-hidden>
                +
              </span>
              <span className="logo-text">{clinicName}</span>
            </Link>
            <nav className="topbar-nav">
              <a className="topbar-link" href="#doctors">
                Doctors
              </a>
              <a className="topbar-link" href="#consult-form">
                Consult
              </a>
              <a className="topbar-link" href="#how">
                How it works
              </a>
              {clinicPhone && clinicPhone !== "9XXXXXXXXX" && (
                <a className="topbar-link" href={`tel:${clinicPhone}`}>
                  Call
                </a>
              )}
              <a className="btn btn-primary btn-sm topbar-cta" href="#consult-form">
                Start Consultation
              </a>
            </nav>
          </div>
        </header>

        <section className="hero-stage">
          <div className="hero-stage-bg" aria-hidden />
          <div className="container hero-stage-grid">
            <div className="hero-stage-copy">
              <p className="hero-kicker">Registered doctors · Phone consultation</p>
              <h1 className="hero-brand">{clinicName}</h1>
              <p className="hero-support">
                Healthcare from the comfort of your home. Tell us your problem — a doctor from our
                clinic will guide the next step.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary btn-lg btn-glow" href="#consult-form">
                  Start Consultation
                </a>
                <a className="btn btn-light btn-lg" href="#doctors">
                  Meet our doctors
                </a>
              </div>
            </div>

            <HeroDoctorStack />
          </div>
        </section>

        <section className="section doctors-section" id="doctors">
          <div className="container">
            <div className="section-head">
              <h2>Our doctors</h2>
              <p className="muted">Tap a doctor to see their full profile and specialties.</p>
            </div>
            <DoctorGrid />
          </div>
        </section>

        <section className="section intake-section" id="consult">
          <div className="container">
            <div className="section-head">
              <h2>Start consultation</h2>
              <p className="muted">Four quick details — a clinic doctor will call you back.</p>
            </div>
            <div className="alert alert-soft" style={{ marginBottom: "1rem" }}>
              If symptoms are severe (chest pain, difficulty breathing, heavy bleeding), call{" "}
              <a href="tel:108">
                <strong>108</strong>
              </a>{" "}
              immediately.
            </div>
            <QuickIntakeForm clinicName={clinicName} variant="home" />
          </div>
        </section>

        <section className="section how-section" id="how">
          <div className="container">
            <div className="section-head">
              <h2>How it works</h2>
              <p className="muted">From your phone to a doctor callback — in three steps.</p>
            </div>
            <div className="steps">
              <div className="step-card">
                <span className="step-num">1</span>
                <h3>Share your concern</h3>
                <p>Fill the short form above with name, phone, problem and symptoms.</p>
              </div>
              <div className="step-card">
                <span className="step-num">2</span>
                <h3>Clinic reviews</h3>
                <p>Our team reviews your request and prioritises if needed.</p>
              </div>
              <div className="step-card">
                <span className="step-num">3</span>
                <h3>Doctor calls you</h3>
                <p>A registered doctor contacts you for a phone consultation.</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="site-footer">
          <div className="container footer-inner">
            <div className="footer-brand-row">
              <span className="logo-mark" aria-hidden>
                +
              </span>
              <strong className="logo-text">{clinicName}</strong>
            </div>
            <p className="muted">Your local doctor, from your home.</p>
            <p className="footer-note muted">
              For severe or life-threatening symptoms, call <a href="tel:108">108</a> or go to the
              nearest hospital.
            </p>
            <Link className="footer-admin" href="/admin/login">
              Clinic staff login
            </Link>
          </div>
        </footer>
      </main>
    </DoctorModalProvider>
  );
}
