import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { registeredApp } from "../db/schema/registered";
import { User } from "next-auth";


interface getUserProps {
    password: unknown;
    pwHash: string;
}

interface responseGetUserFn {
    success: boolean;
    message: string;
    data: null | User;
}

export async function getUserFromDb({
    password, pwHash
}: getUserProps): Promise<responseGetUserFn> {
    try {
        if (typeof password === 'string') {
            const comparePw = await bcrypt.compare(password, pwHash);
            if (!comparePw) return {
                success: false,
                message: "Password not are the same",
                data: null,
            }
            const user = await db.select().from(registeredApp).where(eq(registeredApp.password, password));
            if (user.length === 0) return {
                success: false,
                message: "Not users in database",
                data: null,
            }
            const userDb: User = {
                id: user[0].id,
                email: user[0].userName,
                name: user[0].name,
            }
            return {
                success: true,
                message: "The User is registered in database",
                data: userDb,
            }
        } else {
            const stringPw = String(password);
            const comparePw = await bcrypt.compare(stringPw, pwHash);
            if (!comparePw) return {
                success: false,
                message: "Password not are the same",
                data: null,
            }
            const user = await db.select().from(registeredApp).where(eq(registeredApp.password, stringPw));
            if (user.length === 0) return {
                success: false,
                message: "Not users in database",
                data: null,
            }
            const userDb: User = {
                id: user[0].id,
                email: user[0].userName,
                name: user[0].name,
            }
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