import Link from "next/link";
import { getClinic } from "@/lib/api";
import { doctors } from "@/lib/doctors";

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
            <a className="topbar-link" href="#how">
              How it works
            </a>
            {clinicPhone && clinicPhone !== "9XXXXXXXXX" && (
              <a className="topbar-link" href={`tel:${clinicPhone}`}>
                Call
              </a>
            )}
            <Link className="btn btn-primary btn-sm topbar-cta" href="/consult">
              Start Consultation
            </Link>
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
              <Link className="btn btn-primary btn-lg btn-glow" href="/consult">
                Start Consultation
              </Link>
              <a className="btn btn-light btn-lg" href="#doctors">
                Meet our doctors
              </a>
            </div>
          </div>

          <div className="hero-stage-visual" aria-label="Our doctors">
            <div className="hero-photo-stack">
              {doctors.slice(0, 3).map((doc, i) => (
                <div key={doc.id} className={`hero-photo hero-photo-${i + 1}`}>
                  {doc.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={doc.photo} alt={doc.name} />
                  ) : (
                    <span>{doc.initials}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="hero-trust-card">
              <strong>Doctor-led care</strong>
              <p>Every request is reviewed by a registered medical practitioner.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section doctors-section" id="doctors">
        <div className="container">
          <div className="section-head">
            <h2>Our doctors</h2>
            <p className="muted">The clinic team patients speak with — real doctors, real care.</p>
          </div>
          <div className="doctor-grid">
            {doctors.map((doc, i) => (
              <article
                key={doc.id}
                className="doctor-card"
                style={{ animationDelay: `${0.08 * (i + 1)}s` }}
              >
                <div className="doctor-photo" aria-hidden>
                  {doc.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={doc.photo} alt="" />
                  ) : (
                    <span>{doc.initials}</span>
                  )}
                </div>
                <div>
                  <h3>{doc.name}</h3>
                  <p className="doctor-title">
                    {doc.title} · {doc.specialty}
                  </p>
                </div>
              </article>
            ))}
          </div>
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
              <p>Describe symptoms in a short form — takes a few minutes.</p>
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
          <div className="section-cta">
            <Link className="btn btn-primary btn-glow" href="/consult">
              Start Consultation
            </Link>
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
  );
}
