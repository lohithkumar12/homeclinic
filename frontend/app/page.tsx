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
    <main>
      <div className="container">
        <header className="site-header">
          <Link className="brand" href="/">
            {clinicName}
          </Link>
          <nav className="nav-row">
            <a className="nav-link" href="#doctors">
              Our doctors
            </a>
            <Link className="nav-link" href="/admin/login">
              Clinic login
            </Link>
          </nav>
        </header>

        <section className="hero hero-home">
          <div className="hero-copy">
            <p className="trust-pill">Care from registered doctors</p>
            <h1>{clinicName}</h1>
            <p className="tagline">Healthcare from the comfort of your home</p>
            <p className="lead">Tell us your problem. A doctor from our clinic will guide the next step.</p>
            <div className="hero-actions">
              <Link className="btn btn-primary btn-glow" href="/consult">
                Start Consultation
              </Link>
              {clinicPhone && clinicPhone !== "9XXXXXXXXX" ? (
                <a className="btn btn-ghost" href={`tel:${clinicPhone}`}>
                  Call clinic
                </a>
              ) : (
                <a className="btn btn-ghost" href="#doctors">
                  Meet our doctors
                </a>
              )}
            </div>
            <ul className="trust-points">
              <li>Doctor-reviewed requests</li>
              <li>Phone consultation</li>
              <li>Clinic-led care</li>
            </ul>
          </div>
        </section>
      </div>

      <section className="section doctors-section" id="doctors">
        <div className="container">
          <div className="section-head">
            <h2>Trusted doctors behind your care</h2>
            <p className="muted">
              Every consultation is handled by a registered medical practitioner from our clinic
              network.
            </p>
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
                <h3>{doc.name}</h3>
                <p className="doctor-title">
                  {doc.title} · {doc.specialty}
                </p>
              </article>
            ))}
          </div>
          <div className="section-cta">
            <Link className="btn btn-primary btn-glow" href="/consult">
              Talk to our clinic
            </Link>
          </div>
        </div>
      </section>

      <section className="section how-section">
        <div className="container">
          <div className="section-head">
            <h2>How it works</h2>
            <p className="muted">Simple steps from your phone to a doctor callback.</p>
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
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <strong className="brand">{clinicName}</strong>
          <p className="muted">Your local doctor, from your home.</p>
          <p className="footer-note muted">
            For severe or life-threatening symptoms, call <a href="tel:108">108</a> or go to the
            nearest hospital.
          </p>
        </div>
      </footer>
    </main>
  );
}
