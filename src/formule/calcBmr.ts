interface funcProps {
    height: string;
    weight: string;
    age: string;
    selectActivity: "Sedentario" | "Leggermente attivo" | "Moderatamente attivo" | "Molto attivo" | "Atleta";
    gender: "M" | "F";
}

export default function calcBmr({
    height, weight, age, selectActivity, gender
}: funcProps): number {
    if (height === "" || weight === "" || age === "") {
        return 0;
    }

    const replaceH = height.trim().replace(",", ".");
    const replaceW = weight.trim().replace(",", ".");
    const replaceA = age.trim().replace(",", ".");

    const hNum = Number(replaceH);
    const wNum = Number(replaceW);
    const aNum = Number(replaceA);
    const firstParam = {
        first: 10,
        second: 6.25,
        thirty: 5,
        forth: gender === "M" ? +5 : -161,
    };

    const activityMap = {
        "Sedentario": 1.2,
        "Leggermente attivo": 1.375,
        "Moderatamente attivo": 1.55,
        "Molto attivo": 1.725,
        "Atleta": 1.9,
    } as const;

    const whatSelectActivity = activityMap[selectActivity];

    const calculated = ((firstParam.first * wNum) + (firstParam.second * hNum) - (firstParam.thirty * aNum) + (firstParam.forth)) * whatSelectActivity;
    console.log("la funzione è: ", {
        h: hNum,
        w: wNum,
        a: aNum,
        whatSelectActivity,
        gender,
    });
    return calculated;
}

/**La formula più accurata oggi disponibile per stimare il BMR (Basal Metabolic Rate) è la Mifflin–St Jeor (1990).
Ha un errore medio del ±5%, inferiore a Harris‑Benedict e alle formule precedenti, ed è quella usata nella ricerca clinica moderna.
 * Uomo:

BMR=10⋅peso (kg)+6.25⋅altezza (cm)−5⋅ età (anni)+5
Donna:

BMR=10⋅peso (kg)+6.25⋅altezza (cm)−5⋅età (anni)−161 

Il BMR da solo non basta: per ottenere il fabbisogno calorico reale devi moltiplicarlo per un fattore di attività.

I fattori di attività sono:

Sedentario → 1.2

Leggermente attivo → 1.375

Moderatamente attivo → 1.55

Molto attivo → 1.725

Atleta → 1.9
*/