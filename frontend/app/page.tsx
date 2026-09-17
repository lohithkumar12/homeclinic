import Link from "next/link";
import { getClinic } from "@/lib/api";

export default async function HomePage() {
  let clinicName = process.env.NEXT_PUBLIC_CLINIC_NAME || "HomeClinic";
  try {
    const clinic = await getClinic();
    clinicName = clinic.name;
  } catch {
    // API may be offline during first paint; fall back to env name
  }

  return (
    <main className="container">
      <header className="site-header">
        <div className="brand">{clinicName}</div>
        <Link className="nav-link" href="/admin/login">
          Clinic login
        </Link>
      </header>

      <section className="hero">
        <p className="tagline">Healthcare from the comfort of your home</p>
        <h1>{clinicName}</h1>
        <p className="lead">Tell us your problem. We&apos;ll help you with the next step.</p>
        <div className="hero-actions">
          <Link className="btn btn-primary" href="/consult">
            Start Consultation
          </Link>
          <a className="btn btn-ghost" href="tel:108">
            Emergency? Call 108
          </a>
        </div>
        <p className="muted" style={{ maxWidth: "42ch", marginTop: "1rem" }}>
          For emergencies, call local emergency services — not this website. A registered doctor
          reviews your request; this is not an AI diagnosis service.
        </p>
      </section>
    </main>
  );
}
