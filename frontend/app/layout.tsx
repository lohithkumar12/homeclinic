import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HomeClinic — Healthcare from home",
  description: "Tell us your problem. We'll help you with the next step.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
