import { eq } from "drizzle-orm";
import { db } from "../db";
import { registeredApp } from "../db/schema/registered";
import { comparePasswords } from "./comparePasswords";


interface getUserProps {
    password: unknown;
    email: unknown;
}

interface responseGetUserFn {
    success: boolean;
    message: string;
    data: null | { id: string, email: string, name: string };
}

export async function getUserFromDb({
    password, email
}: getUserProps): Promise<responseGetUserFn> {
    try {
        if (typeof password === 'string' && typeof email === 'string') {
            const user = await db.select().from(registeredApp).where(eq(registeredApp.user_name, email));
            if (user.length === 0) return {
                success: false,
                message: "Not users in database",
                data: null,
            }
            const comparePw = await comparePasswords({ hash: user[0].password, pw: password });
            if (!comparePw) return {
                success: false,
                message: "Password not are the same",
                data: null,
            }
            const userDb = {
                id: user[0].id,
                email: user[0].user_name,
                name: user[0].name,
            };
            return {
                success: true,
                message: "The User is registered in database",
                data: userDb,
            }
        } else {
            const stringPw = String(password);
            const stringEmail = String(email);
            const user = await db.select().from(registeredApp).where(eq(registeredApp.user_name, stringEmail));
            if (user.length === 0) return {
                success: false,
                message: "Not users in database",
                data: null,
            }
            const comparePw = await comparePasswords({ hash: user[0].password, pw: stringPw });
            if (!comparePw) return {
                success: false,
                message: "Password not are the same",
                data: null,
            }
            const userDb = {
                id: user[0].id,
                email: user[0].user_name,
                name: user[0].name,
            };
            return {
                success: true,
                message: "The User is registered in database",
                data: userDb,
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred",
            data: null,
        };
    }
}