'use client'

import instance from "@/src/axios/instance";
import { ApiResponse } from "@/src/@types/ApiResponse";
import { NetworkMode, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { z, ZodType } from "zod";
export interface QueryConfigNoZod {
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
}: QueryConfigNoZod) {

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


// Aggiungiamo i parametri generici per far coincidere i tipi con quelli di useQuery
export interface QueryConfig<
    TSchema extends ZodType = ZodType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TQueryFnData = any,
    TError = Error,
    TData = TQueryFnData,
    TQueryKey extends readonly unknown[] = readonly unknown[]
> extends Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryKey' | 'queryFn' | 'enabled' | 'gcTime'
> {
    key: string[];
    url: string;
    body?: unknown;
    enabled?: boolean;
    gcTime?: number;
    description?: string;
    schema?: TSchema;
}
export function useGetParsedZod<TSchema extends ZodType>(config: QueryConfig<TSchema>) {

    // Se passiamo lo schema, usiamo z.infer per ricavare il tipo T dei dati
    type TData = z.infer<TSchema>;

    return useQuery<ApiResponse<TData>>({
        queryKey: config.key,
        queryFn: async () => {
            const res = await instance.get<ApiResponse<TData>>(config.url, {
                params: config.body ?? {}
            });

            console.log("Che tipo di response ottengo? ", res);
            // 👈 3. Validazione con Zod: se viene fornito uno schema, eseguiamo il parsing
            if (config.schema) {
                // Se ApiResponse ha una struttura tipo { success, message, data },
                // puoi validare solo il payload 'data' oppure l'intera risposta
                const validatedData = await config.schema.parseAsync(res.data.data);

                if (!validatedData) return res.data;
                return {
                    ...res.data,
                    data: validatedData
                }
            } else {
                return res.data;
            }
        },
        enabled: config.enabled,
        staleTime: config.staleTime,
        retry: config.retry,
        networkMode: config.networkMode,
        gcTime: config.gcTime,

        meta: {
            description: "GET request with full Zod control",
        },
    });
};
