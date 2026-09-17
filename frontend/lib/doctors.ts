/** Clinic doctor panel — replace photo paths when you have real images. */
export type Doctor = {
  id: string;
  name: string;
  title: string;
  specialty: string;
  /** Optional public path, e.g. /doctors/uncle.jpg */
  photo?: string;
  initials: string;
};

export const doctors: Doctor[] = [
  {
    id: "lead",
    name: "Dr. [Lead Doctor Name]",
    title: "MBBS",
    specialty: "General Medicine · Clinic Lead",
    initials: "LD",
  },
  {
    id: "d2",
    name: "Dr. [Panel Doctor]",
    title: "MBBS",
    specialty: "Family Care",
    initials: "PD",
  },
  {
    id: "d3",
    name: "Dr. [Panel Doctor]",
    title: "MBBS / MD",
    specialty: "Internal Medicine",
    initials: "MD",
  },
];
