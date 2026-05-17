'use client'

import instance from "@/src/axios/instance";
import { ApiResponse } from "@/src/@types/ApiResponse";
import { useMutation } from "@tanstack/react-query";


interface mutationProps<T> {
    url: string;
    body: T;
}

interface ResponseApiClient<K> {
    status: number;
    res: ApiResponse<{ data: K }>
}

export function useCustomPutMutation<T, K>(mutationKey: string[]) {
    const request = async ({ url, body }: mutationProps<T>) => {
        const res = await instance.put(
            url,
            body,
            {
                validateStatus: () => true,
            }
        );
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
}
