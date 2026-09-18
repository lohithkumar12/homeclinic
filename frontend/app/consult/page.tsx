"use client";

import { ConsultPageForm } from "@/components/QuickIntakeForm";

export default function ConsultPage() {
  const clinicName = process.env.NEXT_PUBLIC_CLINIC_NAME || "HomeClinic";
  return <ConsultPageForm clinicName={clinicName} />;
}
