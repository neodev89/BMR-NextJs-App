import bcrypt from "bcrypt";

interface compareProps {
    hash: string;
    pw: string;
}

export async function comparePasswords({
    hash, pw 
}: compareProps): Promise<boolean> {
    try {
        const compare = await bcrypt.compare(pw, hash);
        if (!compare) return false;
        return compare;
    } catch (error: Error | unknown) {
        console.log("Errore nel'autorizzazione dell'utente: ", error instanceof Error ? error.message : error);
        return false;
    }
}