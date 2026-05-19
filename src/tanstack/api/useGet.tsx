'use client'

import instance from "@/src/axios/instance"
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/src/@types/ApiResponse";

interface MutationConfig {
    key: string[];
    url: string;
    enabled: boolean;
}

export function useGet<T>({ key, url, enabled = false }: MutationConfig) {
    return useQuery<ApiResponse<T>>({
        queryKey: key,
        queryFn: async () => {
            const res = await instance.get<ApiResponse<T>>(url);
            return res.data
        },
        enabled,
    })
};
