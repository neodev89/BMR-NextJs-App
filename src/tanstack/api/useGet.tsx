'use client'

import instance from "@/src/axios/instance";
import { ApiResponse } from "@/src/@types/ApiResponse";
import { NetworkMode, useQuery } from "@tanstack/react-query";
import { z, ZodType } from "zod";
export interface QueryConfig {
    key: string[];
    url: string;
    body?: unknown;
    enabled?: boolean;
    staleTime?: number;
    retry?: number;
    networkMode?: NetworkMode;
    gcTime?: number;
    description?: string;
}

export function useGet<T>({
    key,
    url,
    body,
    enabled = true,
    staleTime = 1000 * 60 * 5, // 5 minuti
    retry = 1,
    networkMode = "online",
    gcTime = 1000 * 60 * 10, // 10 minuti
}: QueryConfig) {

    return useQuery<ApiResponse<T>>({
        queryKey: key,
        queryFn: async () => {
            const res = await instance.get<ApiResponse<T>>(url, {
                params: body ?? {}
            });
            return res.data;
        },
        enabled,
        staleTime,
        retry,
        networkMode,
        gcTime,

        meta: {
            description: "GET request with full control",
        },
    });
};


export interface QueryConfig<TSchema extends ZodType = ZodType> {
    key: string[];
    url: string;
    body?: unknown;
    enabled?: boolean;
    staleTime?: number;
    retry?: number;
    networkMode?: NetworkMode;
    gcTime?: number;
    description?: string;
    schema?: TSchema; // 👈 1. Aggiunto lo schema Zod opzionale
}

export function useGetParsedZod<TSchema extends ZodType = ZodType>({
    key,
    url,
    body,
    enabled = true,
    staleTime = 1000 * 60 * 5, // 5 minuti
    retry = 1,
    networkMode = "online",
    gcTime = 1000 * 60 * 10, // 10 minuti
    schema, // 👈 2. Estraiamo lo schema
}: QueryConfig<TSchema>) {

    // Se passiamo lo schema, usiamo z.infer per ricavare il tipo T dei dati
    type TData = z.infer<TSchema>;

    return useQuery<ApiResponse<TData>>({
        queryKey: key,
        queryFn: async () => {
            const res = await instance.get<ApiResponse<TData>>(url, {
                params: body ?? {}
            });

            console.log("Che tipo di response ottengo? ", res);
            // 👈 3. Validazione con Zod: se viene fornito uno schema, eseguiamo il parsing
            if (schema) {
                // Se ApiResponse ha una struttura tipo { success, message, data },
                // puoi validare solo il payload 'data' oppure l'intera risposta
                const validatedData = await schema.parseAsync(res.data.data);
                
                if (!validatedData) return res.data;
                return {
                    ...res.data,
                    data: validatedData
                }
            } else {
                return res.data;
            }
        },
        enabled,
        staleTime,
        retry,
        networkMode,
        gcTime,

        meta: {
            description: "GET request with full control",
        },
    });
};
