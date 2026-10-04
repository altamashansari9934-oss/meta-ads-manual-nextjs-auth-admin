import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meta AdDiagnosis",
  description: "Meta Ads creative testing, diagnosis, audience strategy and data interpretation Notes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
