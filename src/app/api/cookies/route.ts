import jwt from "jsonwebtoken";

import { ApiResponse } from "@/src/@types/ApiResponse";
import { cookies } from "next/headers";
import { db } from "@/src/db";
import { registeredApp } from "@/src/db/schema/registered";
import { eq } from "drizzle-orm";
import { responseObjApi } from "@/src/middleware/responseObjApi";
import { userBmr } from "@/src/db/schema/userBmr";
import { statisticUserApp } from "@/src/db/schema/statisticUser";

export async function GET() {
    try {
        const firmToken = process.env.FIRM_TOKEN!;
        const cookieStore = await cookies();
        const userCookie = cookieStore.get("login-cookies")?.value;

        if (!userCookie) {
            return responseObjApi<null>({
                success: false,
                message: "Il cookie non esiste!",
                data: null,
                status: 404,
            });
        }

        try {
            const verified = jwt.verify(userCookie, firmToken) as jwt.JwtPayload;
            console.log("token validato: ", verified);
            return responseObjApi<jwt.JwtPayload>({
                success: true,
                message: "Il cookie è stato verificato",
                data: verified,
                status: 200,
            });

        } catch (err: Error | unknown) {
            return responseObjApi<Error | unknown>({
                success: false,
                message: "Token non valido o scaduto",
                data: err instanceof Error ? err.message : err,
                status: 401,
            });
        }
    } catch (error: Error | unknown) {
        const mxs = error instanceof Error ? error.message : error;

        return responseObjApi<null>({
            success: false,
            message: JSON.stringify(mxs, null, 2),
            data: null,
            status: 500
        });
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
            .where(eq(registeredApp.user_name, userName));

        const userValDb = await db
            .select()
            .from(userBmr)
            .where(eq(userBmr.user_name, userName));

        const statisticUserValue = await db
            .select()
            .from(statisticUserApp)
            .where(eq(statisticUserApp.email, userName))

        if (userDb.length === 0 && userValDb.length === 0 && statisticUserValue.length === 0) {
            return responseObjApi<undefined>({
                success: false,
                message: "Nessun token associato nella lista utenti",
                data: undefined,
                status: 404,
            });
        }

        const newToken = jwt.sign(
            { email: userDb[0].user_name },
            firmToken,
            {
                expiresIn: 60 * 60 * 24 * 10,
            }
        );
        console.log("Il token generato è: ", newToken);

        const newCookies = cookieStore.set(
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

        const cookiesValue = newCookies.get("login-cookies")?.value;
        if (!cookiesValue) {
            responseObjApi({
                success: false,
                message: "Token non aggiunto al cookie",
                data: null,
                status: 505,
            });
        }
        console.log("Il token inserito nei cookies è: ", cookiesValue)

        await db
            .update(registeredApp)
            .set({
                ...registeredApp,
                token: cookiesValue,
            })
            .where(eq(registeredApp.user_name, userName));

        await db
            .update(userBmr)
            .set({
                ...userBmr,
                token_user: cookiesValue,
            })
            .where(eq(userBmr.user_name, userName));

        await db
            .update(statisticUserApp)
            .set({
                ...statisticUserApp,
                token: cookiesValue,
            })
            .where(eq(statisticUserApp.email, userName));

        return responseObjApi<string>({
            success: true,
            message: "Token nuovo validato e aggiornato in entrambe le tabelle!",
            data: cookiesValue!,
            status: 200,
        });

    } catch (error: Error | unknown) {
        const mxs = error instanceof Error ? error.message : error;

        return responseObjApi<null>({
            success: false,
            message: JSON.stringify(mxs),
            data: null,
            status: 500
        });
    }
};

export async function DELETE() {
    try {
        const cookieStore = await cookies();
        const userCookie = cookieStore.get("login-cookies")?.value;

        if (!userCookie) {
            return responseObjApi<undefined>({
                success: false,
                message: "Token non presente",
                data: undefined,
                status: 404,
            });
        }

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