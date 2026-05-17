'use client'

import { ApiResponse } from "@/src/@types/ApiResponse";
import instance from "@/src/axios/instance";
import { useMutation } from "@tanstack/react-query";

interface mutationProps {
    url: string;
}

interface ResponseApiClient<K> {
    status: number;
    res: ApiResponse<{ data: K }>
}

export function useCustomDeleteMutation<K>(mutationKey: string[]) {
    const request = async ({ url }: mutationProps) => {
        const res = await instance.delete(url);
        const result: ResponseApiClient<K> = { 
            status: res.status, 
            res: res.data.response
        };
        return result;
    };

    return useMutation({
        mutationKey,
        mutationFn: request,
    });
};