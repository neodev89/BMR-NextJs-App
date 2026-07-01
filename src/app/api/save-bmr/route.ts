export const dynamic = "force-dynamic";

import jwt from "jsonwebtoken";
import { ApiResponse } from "@/src/@types/ApiResponse";
import { db } from "@/src/db";
import { registeredApp } from "@/src/db/schema/registered";
import { userBmr } from "@/src/db/schema/userBmr";
import { bmrSchema, userBmrDbType } from "@/src/zod/userBmrSchema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { responseObjApi } from "@/src/middleware/responseObjApi";


async function getNextBmrId() {
    const last = await db
        .select()
        .from(userBmr)
        ;

    return last.length + 1;
}


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsedBody = await bmrSchema.parseAsync(body);
        if (!parsedBody) {
            const response: ApiResponse<null> = {
                success: false,
                message: "Il corpo della richiesta non ha il tipo corretto",
                data: null,
                status: 500,
            };
            return Response.json(
                response,
                { status: 500 },
            );
        }

        const cookieStore = await cookies();
        const userToken = cookieStore.get("login-cookies")?.value;
        if (!userToken) {
            const response: ApiResponse<undefined> = {
                success: false,
                message: "Token non valido o scaduto",
                data: undefined,
                status: 401,
            };
            return Response.json(
                response,
                { status: 401 },
            );
        }

        const user = await db
            .select()
            .from(registeredApp)
            .where(eq(registeredApp.token, userToken))
            .limit(1);
        console.log("Utente attivo: ", user[0]);

        if (user.length === 0) {
            const response: ApiResponse<null> = {
                success: false,
                message: "Utente non trovato",
                data: null,
                status: 404
            };

            return Response.json(
                response,
                { status: 404 }
            );
        }

        const { id, userName } = user[0];

        const userBmrReq: userBmrDbType = {
            id: await getNextBmrId(),
            createdAt: new Date().toISOString(),
            userName,
            ...parsedBody,
            tokenUser: id,
        }

        await db
            .insert(userBmr)
            .values(userBmrReq)
            .returning();

        const response: ApiResponse<userBmrDbType> = {
            success: true,
            message: "Risultato BMR aggiunto",
            data: userBmrReq,
            status: 200,
        };
        return Response.json(
            response,
            { status: 200 },
        );

    } catch (error: Error | unknown) {
        const response: ApiResponse<null> = {
            success: false,
            message: error instanceof Error ? error.message : "Errore nella chiamata API",
            data: null,
            status: 500,
        };
        return Response.json(
            response,
            { status: 500 },
        );
    }
};

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const parsedBody = await bmrSchema.parseAsync(body);

        if (!parsedBody) {
            const response: ApiResponse<null> = {
                success: false,
                message: "il corpo della richiesta non rispetta il tipo richiesto",
                data: null,
                status: 500,
            };
            return Response.json(
                response,
                { status: 500 },
            );
        }

        const cookieStore = await cookies();
        const userToken = cookieStore.get("login-cookies")?.value;
        if (!userToken) {
            const response: ApiResponse<undefined> = {
                success: false,
                message: "Token non valido o scaduto",
                data: undefined,
                status: 401,
            };
            return Response.json(
                response,
                { status: 401 },
            );
        }

        const user = await db
            .select()
            .from(registeredApp)
            .where(eq(registeredApp.id, userToken))
            .limit(1);

        if (user.length === 0) {
            const response: ApiResponse<null> = {
                success: false,
                message: "L'utente non si è mai registrato",
                data: null,
                status: 404,
            };
            return Response.json(
                response,
                { status: 404 },
            );
        }

        const userBmrToDb = await db
            .select()
            .from(userBmr)
            .where(eq(userBmr.tokenUser, userToken))
            .limit(1);

        if (userBmrToDb.length === 0) {
            const response: ApiResponse<null> = {
                success: false,
                message: "L'utente non ha mai aggiunto risultati BMR",
                data: null,
                status: 404,
            };
            return Response.json(
                response,
                { status: 404 },
            );
        }

        await db
            .update(userBmr)
            .set(parsedBody)
            .returning();

    } catch (error: Error | unknown) {
        const response: ApiResponse<unknown> = {
            success: false,
            message: "Errore nella chiamata API",
            data: error instanceof Error ? error.message : error,
            status: 500,
        };
        return Response.json(
            response,
            { status: 500 },
        );
    }
};

export async function GET() {
    try {
        const firmToken = process.env.FIRM_TOKEN!;
        const cookieStore = await cookies();
        const token = cookieStore.get("login-cookies")?.value;
        if (!token) {
            const response: ApiResponse<undefined> = {
                success: false,
                message: "Nessun token presente",
                data: undefined,
                status: 404,
            };
            return Response.json(
                response,
                { status: 404 },
            );
        }

        let decoded: string | jwt.JwtPayload;

        try {
            decoded = jwt.verify(token, firmToken) as jwt.JwtPayload;
        } catch (err: Error | unknown) {
            const response: ApiResponse<unknown> = {
                success: false,
                message: "Token non valido o scaduto",
                data: err instanceof Error ? err.message : err,
                status: 401,
            };
            return Response.json(response, { status: 401 });
        }
        const mail = decoded.email;

        const user = await db
            .select()
            .from(userBmr)
            .where(eq(userBmr.userName, mail));

        if (user.length === 0) {
            const response: ApiResponse<[]> = {
                success: false,
                message: "Lista BMR vuota",
                data: [],
                status: 203,
            };
            return Response.json(
                response,
                { status: 203 },
            );
        }

        const response: ApiResponse<userBmrDbType[]> = {
            success: true,
            message: "I risultati sono stati trovati",
            data: user,
            status: 200,
        };
        return Response.json(
            response,
            { status: 200 },
        );

    } catch (error: Error | unknown) {
        const response: ApiResponse<unknown> = {
            success: false,
            message: "Errore nella chiamata API",
            data: error instanceof Error ? error.message : error,
            status: 500,
        };
        return Response.json(
            response,
            { status: 500 },
        );
    }
};

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const parsedBody = parseInt(body);
        const firmToken = process.env.FIRM_TOKEN!;
        const cookieStore = await cookies();
        const token = cookieStore.get("login-cookies")?.value;
        if (!token) {

            return responseObjApi<undefined>({
                success: false,
                message: "Nessun token presente",
                data: undefined,
                status: 404,
            });
        }

        let decoded: string | jwt.JwtPayload;

        try {
            decoded = jwt.verify(token, firmToken) as jwt.JwtPayload;
        } catch (err: Error | unknown) {

            return responseObjApi({
                success: false,
                message: "Token non valido o scaduto",
                data: err instanceof Error ? err.message : err,
                status: 401,
            });
        }
        const mail = decoded.email;

        const user = await db
            .select()
            .from(userBmr)
            .where(eq(userBmr.userName, mail));

        if (user.length === 0) {
            
            return responseObjApi<null>({
                success: false,
                message: "Lista BMR vuota",
                data: null,
                status: 404,
            });
        }

        const selectedBmrResult = await db
            .query
            .userBmr
            .findFirst({
                where: eq(userBmr.id, parsedBody),
            });

        if (!selectedBmrResult) {
            return responseObjApi<null>({
                success: false,
                message: "Nessun BMR salvato questo ID",
                data: null,
                status: 404,
            });
        }

        const deletedRecord = await db
            .delete(userBmr)
            .where(eq(userBmr.id, parsedBody))
            .returning();

        return responseObjApi<userBmrDbType[]>({
            success: true,
            message: "Ultimo record eliminato",
            data: deletedRecord,
            status: 200,
        });

    } catch (error: Error | unknown) {
        return responseObjApi<unknown>({
            success: false,
            message: "Errore nella chiamata alla API",
            data: error instanceof Error ? error.message : error,
            status: 500,
        })
    }
}