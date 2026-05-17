import jwt from "jsonwebtoken";

import { ApiResponse } from "@/src/@types/ApiResponse";
import { cookies } from "next/headers";
import { db } from "@/src/db";
import { registeredApp } from "@/src/db/schema/registered";
import { eq } from "drizzle-orm";
import { loginSchema } from "@/src/zod/controlLogin";

export async function GET() {
    try {
        const firmToken = process.env.FIRM_TOKEN!;
        const cookieStore = await cookies();
        const userCookie = cookieStore.get("login-cookies")?.value;

        if (!userCookie) {
            const response: ApiResponse<null> = {
                success: false,
                message: "Il cookie non esiste!",
                data: null,
                status: 404,
            };
            return Response.json(
                response,
                { status: 404 },
            );
        }

        try {
            const verified = jwt.verify(userCookie, firmToken) as jwt.JwtPayload;

            return Response.json({
                success: true,
                message: "Il cookie è stato verificato",
                data: verified,
                status: 200,
            }, { status: 200 });

        } catch (err: Error | unknown) {
            const response: ApiResponse<Error | unknown> = {
                success: false,
                message: "Token non valido o scaduto",
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
}

export async function PUT(req: Request) {
    try {
        const firmToken = process.env.FIRM_TOKEN!;
        const cookieStore = await cookies();
        const userName = await req.json() as string;
        const userDb = await db
            .select()
            .from(registeredApp)
            .where(eq(registeredApp.userName, userName));

        if (userDb.length === 0) {
            const response: ApiResponse<undefined> = {
                success: false,
                message: "Nessun token associato nella lista utenti",
                data: undefined,
                status: 404,
            };
            console.log(response);
            return Response.json(
                response,
                { status: 404 },
            );
        }

        const newToken = jwt.sign(
            { email: userDb[0].userName },
            firmToken,
            {
                expiresIn: 60 * 60 * 24,
            }
        );

        cookieStore.set(
            "login-cookies",
            newToken,
            {
                maxAge: 60 * 60 * 24,
                httpOnly: true,
                path: "/",
                expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
                sameSite: "lax",
            }
        );

        await db
            .update(registeredApp)
            .set({ id: newToken })
            .where(eq(registeredApp.userName, userName));

        const response: ApiResponse<string> = {
            success: true,
            message: "Token nuovo validato",
            data: newToken,
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

export async function DELETE() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete("login-cookies");
        const response: ApiResponse<undefined> = {
            success: true,
            message: "Token eliminato",
            data: undefined,
            status: 200,
        };
        return Response.json(
            response,
            { status: 200 },
        );
    } catch (error: Error | unknown) {
        const response: ApiResponse<unknown> = {
            success: false,
            message: "errore nella chiamata",
            data: error instanceof Error ? error.message : error,
            status: 500,
        };
        return Response.json(
            response,
            { status: 500 },
        );
    }
};