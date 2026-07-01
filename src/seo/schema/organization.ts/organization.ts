interface generateSchemaDashboardProps {
  dominio: string | URL;
  name: string;
}

export const generateSchemaDashboard = async (props: generateSchemaDashboardProps) => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${props.dominio}/${props.name}/dashboard/#page`,
        "url": `${props.dominio}/${props.name}/dashboard`,
        "name": "Calcolo BMR — Dashboard",
        "description":
          "Dashboard per il calcolo del Metabolismo Basale (BMR) e del TDEE con formule scientifiche.",
        "inLanguage": ["en", "it"],
        "isPartOf": {
          "@id": `${props.dominio}/`
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
          "target": `${props.dominio}/${props.name}/dashboard`
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": `${props.dominio}/`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Dashboard",
            "item": `${props.dominio}/${props.name}/dashboard`
          }
        ]
      }
    ]
  }
}
