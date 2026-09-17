/** Clinic doctor panel — add real photos under frontend/public/doctors/ */

export type Doctor = {
  id: string;
  name: string;
  title: string;
  specialty: string;
  /** Public path, e.g. /doctors/ravi.jpg */
  photo?: string;
  initials: string;
  experienceYears: number;
  languages: string[];
  about: string;
  education: string;
  registration?: string;
  availableFor: string[];
};

export const doctors: Doctor[] = [
  {
    id: "lead",
    name: "Dr. Ravi Kumar",
    title: "MBBS",
    specialty: "General Medicine",
    initials: "RK",
    experienceYears: 18,
    languages: ["English", "Hindi", "Telugu"],
    about:
      "Clinic lead physician. Reviews patient intake requests and provides phone consultations for common illnesses, follow-ups, and guidance on next steps.",
    education: "MBBS — Registered Medical Practitioner",
    registration: "Update with State Medical Council / NMC number",
    availableFor: ["Phone consultation", "Clinic lead review", "Follow-up advice"],
  },
  {
    id: "d2",
    name: "Dr. Priya Sharma",
    title: "MBBS, DGO",
    specialty: "Family Care",
    initials: "PS",
    experienceYears: 12,
    languages: ["English", "Hindi"],
    about:
      "Supports family health concerns, women's health guidance, and day-to-day medical advice through scheduled phone consultations with the clinic.",
    education: "MBBS, DGO",
    availableFor: ["Phone consultation", "Family health", "Women's health guidance"],
  },
  {
    id: "d3",
    name: "Dr. Suresh Reddy",
    title: "MBBS, MD",
    specialty: "Internal Medicine",
    initials: "SR",
    experienceYears: 15,
    languages: ["English", "Telugu", "Hindi"],
    about:
      "Internal medicine specialist on the clinic panel. Helps with chronic conditions, medication review, and when an in-person or home visit may be needed.",
    education: "MBBS, MD (Internal Medicine)",
    availableFor: ["Phone consultation", "Chronic care advice", "Escalation guidance"],
  },
];
