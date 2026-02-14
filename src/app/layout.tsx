import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import "@/styles/globals.css"
import { ThemeProvider } from "@/components/theme/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Landingpage Pipeline Admin",
  description: "Admin Dashboard fuer Companies, Projects, Templates und Workflows",
  metadataBase: new URL("http://localhost:3000")
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="dark" storageKey="dashboard-theme">
          <Link href="#main-content" className="skip-link">
            Zum Inhalt springen
          </Link>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
