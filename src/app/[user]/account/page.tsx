import { Metadata } from "next";
import AccountComponent from "./AccountComponent";

const dominio = process.env.NEXT_PUBLIC_DOMAIN ?? "https://localhost:3000";

export const metadata: Metadata = {
    title: "Risultati BMR — BMR Calculator",
    description: "Visualizza i risultati dei tuoi calcoli BMR e TDEE basati su formule scientifiche come Mifflin-St Jeor, Harris-Benedict e Katch-McArdle.",
    alternates: {
        canonical: `${dominio}/account`
    },
    robots: {
        index: true,
        follow: true
    }
};

const schemaAccount = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebPage",
            "@id": `${dominio}/account/#page`,
            "url": `${dominio}/account`,
            "name": "Risultati BMR — BMR Calculator",
            "description":
                "Pagina dei risultati BMR e TDEE basati su formule scientifiche come Mifflin-St Jeor, Harris-Benedict e Katch-McArdle.",
            "inLanguage": ["en", "it"],
            "isPartOf": {
                "@id": `${dominio}/#website`
            },
            "about": [
                "Basal Metabolic Rate",
                "Total Daily Energy Expenditure",
                "Mifflin-St Jeor",
                "Harris-Benedict",
                "Katch-McArdle",
                "Calcolo metabolismo basale"
            ],
            "potentialAction": {
                "@type": "ViewAction",
                "name": "Visualizza risultati BMR",
                "target": `${dominio}/account`
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
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Dashboard",
                    "item": `${dominio}/dashboard`
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "Risultati",
                    "item": `${dominio}/account`
                }
            ]
        }
    ]
};

export default async function Account() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify(schemaAccount)
            }} />
            <AccountComponent />
        </>
    )
}