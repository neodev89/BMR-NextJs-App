import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { WrapperQueryClientProvider } from "../tanstack/queryProvider/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dominio = process.env.NEXT_PUBLIC_DOMAIN ?? "http://localhost:3000";


export const metadata: Metadata = {
  metadataBase: new URL(dominio),

  title: "BMR Calculator — Calcola Metabolismo Basale e TDEE",
  description:
    "Calcolatore BMR e TDEE accurato basato su formule scientifiche. Supporta Mifflin-St Jeor, Harris-Benedict e Katch-McArdle. Risultati immediati, UI chiara, nessun tracciamento.",

  robots: {
    index: true,
    follow: true
  },

  openGraph: {
    title: "BMR Calculator — Calcola Metabolismo Basale e TDEE",
    description:
      "Calcolatore BMR e TDEE accurato basato su formule scientifiche. Risultati immediati e UI ottimizzata.",
    url: dominio,
    type: "website",
    images: [
      {
        url: `${dominio}/og-bmr-png`,
        width: 1200,
        height: 630,
        alt: "BMR Calculator OG Image"
      }
    ]
  },

  twitter: {
    card: "summary_large_image",
    title: "BMR Calculator — Calcola Metabolismo Basale e TDEE",
    description:
      "Calcolatore BMR e TDEE accurato basato su formule scientifiche.",
    images: [`${dominio}/og-bmr-png`]
  }
};

const globalSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": dominio,
      "name": "BMR Calculator",
      "url": dominio,
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "description":
        "Calcolatore BMR e TDEE accurato basato su formule scientifiche.",
      "featureList": [
        "Calcolo BMR",
        "Calcolo TDEE",
        "Formula Mifflin-St Jeor",
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <WrapperQueryClientProvider>
          {children}
        </WrapperQueryClientProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify(globalSchema)
        }} />
      </body>
    </html>
  );
}
