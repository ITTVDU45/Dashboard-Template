import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "C - KI-Services Dashboard",
  description: "Verwalten Sie Ihre KI-Services, API-Keys und Integrationen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
