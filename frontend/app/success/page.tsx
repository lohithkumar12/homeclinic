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

      <div className="panel stack" style={{ maxWidth: 640, margin: "2rem auto" }}>
        <h1>Your request has been received</h1>
        <p className="muted">Consultation ID</p>
        <p className="success-id">{id}</p>
        {urgent && (
          <div className="alert alert-urgent">
            Marked urgent. Please seek emergency care if symptoms are severe. Our clinic will also try
            to contact you.
          </div>
        )}
        <p>Our clinic team will contact you shortly for a phone consultation.</p>
        <p>
          <strong>Clinic:</strong> {phone}
          <br />
          <strong>Available:</strong> {hours}
        </p>
        <div className="alert alert-warn">
          For emergencies, contact your nearest emergency service immediately (108 / 112). This
          confirmation is not medical advice and not an emergency response.
        </div>
        <div className="actions">
          <Link className="btn btn-primary" href="/">
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
