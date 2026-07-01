import { Metadata } from "next";
import HomeComponent from "./HomeComponent";


const dominio = process.env.NEXT_PUBLIC_DOMAIN ?? "http://localhost:3000";


const schemaHome = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${dominio}/#home`,
      "url": `${dominio}/`,
      "name": "BMR Calculator — Calcolo BMR e TDEE",
      "description":
        "Calcolatore BMR e TDEE accurato basato su formule scientifiche come Mifflin-St Jeor, Harris-Benedict e Katch-McArdle.",
      "inLanguage": ["en", "it"],
      "isPartOf": {
        "@id": `${dominio}/#website`
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": `${dominio}/`
        }
      ]
    }
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL(dominio),

  title: "BMR Calculator — Calcola BMR e TDEE",
  description:
    "Calcola il tuo Metabolismo Basale (BMR) e il TDEE con formule scientifiche come Mifflin-St Jeor, Harris-Benedict e Katch-McArdle.",

  openGraph: {
    title: "BMR Calculator — Calcolo BMR e TDEE",
    description:
      "Calcolatore BMR e TDEE accurato basato su formule scientifiche. Risultati immediati.",
    url: dominio,
    type: "website",
    images: [
      {
        url: `${dominio}/og-bmr-home.png`,
        width: 1200,
        height: 630,
        alt: "BMR Calculator OG Home Image"
      }
    ]
  },

  twitter: {
    card: "summary_large_image",
    title: "BMR Calculator — Calcolo BMR e TDEE",
    description:
      "Calcolatore BMR e TDEE accurato basato su formule scientifiche.",
    images: [`${dominio}/og-bmr-home.png`]
  }
};

export default async function Home() {

  return (
    <>
      <script dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaHome)
      }} />
      <HomeComponent />
    </>
  );
}
