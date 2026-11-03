import axios from "axios";

export const downloadUserCsv = async (email: string) => {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_URL_API_PY || "http://127.0.0.1:8002";

        const response = await axios.get(`${baseUrl}/api/export-statistic-for-user/csv`, {
            params: { email },
            responseType: 'blob', // FONDAMENTALE: dice ad axios di trattare la risposta come un file binario
        });

        // Creiamo un URL temporaneo nel browser per il Blob ricevuto
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv;charset=utf-8;' }));
        const link = document.createElement('a');
        link.href = url;

        // Nome del file che verrà scaricato
        link.setAttribute('download', `statistiche_${email.replace('@', '_')}.csv`);

        document.body.appendChild(link);
        link.click();

        // Pulizia finale della memoria
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Errore durante il download del CSV:", error);
        alert("Impossibile scaricare il file CSV.");
    }
};