import jwt from "jsonwebtoken";
import { ApiResponse } from "@/src/@types/ApiResponse";
import { db } from "@/src/db";
import { registeredApp, selectRegisteredAppType } from "@/src/db/schema/registered";
import { loginSchema } from "@/src/zod/controlLogin";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const firmToken = process.env.FIRM_TOKEN!;
        const cookieStore = await cookies();
        const body = await req.json();
        const bodyParsed = await loginSchema.parseAsync(body);

        if (!bodyParsed) {
            const response: ApiResponse<null> = {
                success: false,
                message: "I dati non corrispondono al tipo previsto per effettuare il login",
                data: null,
                status: 404,
            }
            return Response.json({
                response,
            }, { status: 404 });
        }
        const findUser = await db
            .select()
            .from(registeredApp)
            .where(eq(registeredApp.userName, bodyParsed.userName))
            ;

        console.log("la lista di utenti trovati è: ", findUser);

        if (!findUser[0]) {
            const response: ApiResponse<null> = {
                success: false,
                message: "L'utente non risulta registrato",
                data: null,
                status: 404,
            }
            return Response.json({
                response,
            }, { status: 404 });
        }

        const token = findUser[0].id; // JWT salvato in fase di register

        try {
            jwt.verify(token, firmToken);
            // token ancora valido → lo riusi
            console.log("Il token è ancora attivo")
        } catch {
            // token scaduto → ne generi uno nuovo
            console.log("Token scaduto");
            const response: ApiResponse<undefined> = {
                success: false,
                message: "Token scaduto! Andrà rigenerato",
                data: undefined,
                status: 401,
            };
            return Response.json(
                response,
                { status: 401 },
            );
        }

        cookieStore.set("login-cookies", token, {
            maxAge: 60 * 60 * 24,
            httpOnly: true,
            sameSite: "lax",
            path: "/",
        });

        const response: ApiResponse<{ user: selectRegisteredAppType, tkn: string | jwt.JwtPayload }> = {
            success: true,
            message: "Trovato l'utente e il token",
            data: { user: findUser[0], tkn: token },
            status: 200,
        };
        return Response.json(
            response,
            { status: 200 },
        );
    } catch (error: Error | unknown) {
        const mxs = error instanceof Error ? error.message : error;
        const response: ApiResponse<null> = {
            success: false,
            message: JSON.stringify(mxs, null, 2),
            data: null,
            status: 500
        };

        return Response.json(
            response,
            { status: 500 }
        );
    }
};