import { ApiResponse } from "@/src/@types/ApiResponse";
import { db } from "@/src/db";
import { registeredApp } from "@/src/db/schema/registered";
import { loginSchema, loginSchemaType } from "@/src/zod/controlLogin";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
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

        try {
            cookieStore.set(
                "login-cookies",
                findUser[0].id,
                {
                    maxAge: 60 * 60 * 24,
                    httpOnly: true,
                    sameSite: "lax",
                }
            );

            const response: ApiResponse<loginSchemaType> = {
                success: true,
                message: "Il login è stato effettuato",
                data: findUser[0],
                status: 200,
            };
            return Response.json(
                response,
                { status: 200 },
            );
        } catch (err: Error | unknown) {
            const response: ApiResponse<Error | unknown> = {
                success: false,
                message: "Token non valido o scaduto! Ne devi generare un altro nuovo",
                data: err instanceof Error ? err.message : err,
                status: 401,
            }
            return Response.json({
                response,
            }, { status: 401 });
        }

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