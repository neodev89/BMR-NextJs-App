import DashboardComponent from "./DashboardComponent";
import { Metadata } from "next";

const dominio = process.env.NEXT_PUBLIC_DOMAIN ?? "https://localhost:3000";
export async function generateMetadata(): Promise<Metadata> {

    return {
        title: "Calcolo BMR — Dashboard BMR Calculator",
        description:
            "Calcola il tuo Metabolismo Basale (BMR) e il TDEE con formule scientifiche come Mifflin-St Jeor, Harris-Benedict e Katch-McArdle. Dashboard con risultati personalizzati.",

        alternates: {
            canonical: `${dominio}/dashboard`
        },

        openGraph: {
            title: "Calcolo BMR — Dashboard BMR Calculator",
            description:
                "Dashboard per il calcolo del BMR e del TDEE basato su formule scientifiche. Risultati immediati e personalizzati.",
            url: `${dominio}/dashboard`,
            type: "website",
            images: [
                {
                    url: `${dominio}/og-bmr-dashboard.png`,
                    width: 1200,
                    height: 630,
                    alt: "BMR Calculator Dashboard OG Image"
                }
            ]
        },

        twitter: {
            card: "summary_large_image",
            title: "Calcolo BMR — Dashboard BMR Calculator",
            description:
                "Dashboard per il calcolo del BMR e del TDEE basato su formule scientifiche.",
            images: [`${dominio}/og-bmr-dashboard.png`]
        }
    };
};

const schemaDashboard = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebPage",
            "@id": `${dominio}/dashboard/`,
            "url": `${dominio}/dashboard`,
            "name": "Calcolo BMR — Dashboard",
            "description":
                "Dashboard per il calcolo del Metabolismo Basale (BMR) e del TDEE con formule scientifiche.",
            "inLanguage": ["en", "it"],
            "isPartOf": {
                "@id": `${dominio}/`
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
                "@type": "CalculateAction",
                "name": "Calcola BMR",
                "target": `${dominio}/dashboard`
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
                }
            ]
        }
    ]
};

export default async function Dashboard() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify(schemaDashboard)
            }} />
            <DashboardComponent />
        </>
    )
}