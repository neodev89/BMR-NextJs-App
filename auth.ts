import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials";
import { saltAndHashPassword } from "./src/utils/saltAndHashPassword";
import { getUserFromDb } from "./src/utils/getUserFromDb";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                let user = null;
                const pwHash = await saltAndHashPassword(credentials.password);

                // logic to verify if the user exists
                user = await getUserFromDb({ 
                    password: credentials.password, 
                    pwHash 
                })

                if (!user.success) {
                    // No user found, so this is their first attempt to login
                    // Optionally, this is also the place you could do a user registration
                    throw new Error("Invalid credentials.")
                }

                // return user object with their profile data
                return user.data;
            }
        })
    ],
});