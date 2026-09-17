import Link from "next/link";

type Props = {
  searchParams: Promise<{ id?: string; phone?: string; hours?: string; urgent?: string }>;
};

export default async function SuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const id = params.id || "—";
  const phone = params.phone || "9XXXXXXXXX";
  const hours = params.hours || "9 AM – 8 PM";
  const urgent = params.urgent === "1";
  const clinicName = process.env.NEXT_PUBLIC_CLINIC_NAME || "HomeClinic";

  return (
    <main className="container page">
      <header className="site-header">
        <Link className="brand" href="/">
          {clinicName}
        </Link>
      </header>

      <div className="panel stack success-panel">
        <p className="trust-pill">Request received</p>
        <h1>A doctor from our clinic will contact you</h1>
        <p className="muted">Consultation ID</p>
        <p className="success-id">{id}</p>
        {urgent && (
          <div className="alert alert-urgent">
            Marked urgent. If symptoms are severe, call 108 or go to the nearest hospital. Our clinic
            will also try to reach you soon.
          </div>
        )}
        <p>Our clinic team will call you shortly for a phone consultation.</p>
        <div className="success-meta">
          <div>
            <span className="muted">Clinic</span>
            <strong>{phone}</strong>
          </div>
          <div>
            <span className="muted">Available</span>
            <strong>{hours}</strong>
          </div>
        </div>
        <div className="actions">
          <Link className="btn btn-primary btn-glow" href="/">
            Back to home
          </Link>
          <a className="btn btn-secondary" href={`tel:${phone}`}>
            Call clinic
          </a>
        </div>
      </div>
    </main>
  );
}
