import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials";
import { getUserFromDb } from "./src/utils/getUserFromDb";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                try {
                    console.log("CREDENTIALS:", credentials);

                    const result = await getUserFromDb({
                        email: credentials.email,
                        password: credentials.password
                    });

                    if (!result.success) {
                        console.log("Il processo non è andato a buon fine perché: ", result.message);
                        return null;
                    };
                    if (!result.data) {
                        console.log("L'utente non è stato correttamente recuperato dal DB perché: ", result.message);
                        return null;
                    };

                    return result.data;
                } catch (error) {
                    console.log("CREDENTIALS:", credentials);
                    console.log("Errore credenziali: ", error);
                    return null;
                }
            }
        })
    ],
});