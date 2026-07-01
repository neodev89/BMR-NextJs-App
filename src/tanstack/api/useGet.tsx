'use client'

import { ApiResponse } from "@/src/@types/ApiResponse";
import instance from "@/src/axios/instance"
import { NetworkMode, useQuery } from "@tanstack/react-query";

export interface QueryConfig {
    key: string[];
    url: string;
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
    enabled = true,
    staleTime = 1000 * 60 * 5, // 5 minuti
    retry = 1,
    networkMode = "online",
    gcTime = 1000 * 60 * 10, // 10 minuti
}: QueryConfig) {

    return useQuery<ApiResponse<T>>({
        queryKey: key,
        queryFn: async () => {
            const res = await instance.get<ApiResponse<T>>(url);
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
}
