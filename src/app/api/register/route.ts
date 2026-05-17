import jwt from "jsonwebtoken";

import { ApiResponse } from "@/src/@types/ApiResponse";
import { db } from "@/src/db";
import { insertRegisteredAppType, registeredApp } from "@/src/db/schema/registered";
import { loginSchema, loginSchemaType } from "@/src/zod/controlLogin";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { responseData } from "@/src/@types/responseData";

export async function POST(req: Request) {
    try {
        const firmToken = process.env.FIRM_TOKEN!;
        const cookieStore = await cookies();
        const body = await req.json();
        const bodyParsed = await loginSchema.parseAsync(body);

        if (!bodyParsed) return Response.json({
            success: false,
            message: "I dati non corrispondono al tipo previsto per effettuare il login",
            data: JSON.stringify(bodyParsed),
            status: 404,
        }, { status: 404 });

        const findUser = await db
            .select()
            .from(registeredApp)
            .where(eq(registeredApp.userName, bodyParsed.userName))
            ;

        if (findUser[0]) {
            const response: ApiResponse<null> = {
                success: false,
                message: "l'utente esiste, non deve registrarsi",
                data: null,
                status: 404
            };
            return Response.json(
                response,
                { status: 400 },
            );
        }

        const token = jwt.sign(
            { email: bodyParsed.userName },
            firmToken,
            {
                expiresIn: 60 * 60 * 24,
            }
        );

        const cookie = cookieStore.set(
            "login-cookies",
            token,
            {
                maxAge: 60 * 60 * 24,
                httpOnly: true,
                path: "/",
                expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
                sameSite: "lax",
            }
        );

        const completeUser: insertRegisteredAppType = {
            id: token,
            createdAt: new Date(),
            ...bodyParsed,
        }

        await db
            .insert(registeredApp)
            .values(completeUser)

        const response: ApiResponse<responseData<loginSchemaType>> = {
            success: true,
            message: "La registrazione è stata effettuata",
            data: { data: bodyParsed, cookie: cookie.get("login-cookies") },
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
            message: JSON.stringify(mxs),
            data: null,
            status: 500
        };

        return Response.json(
            response,
            { status: 500 }
        );
    }
};