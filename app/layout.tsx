import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CivicBank Internet Banking Platform",
  description: "Secure Internet Banking and Investment Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}