'use client'

import { ApiResponse } from "@/src/@types/ApiResponse";
import instance from "@/src/axios/instance";
import { useMutation } from "@tanstack/react-query";
import { Method } from "axios";

interface mutationProps<T> {
    url: string;
    body: T;
    pathSuccess?: string;
    pathErrorCredential?: string;
    pathError?: string;
    method?: Method;
    pathRegister?: string;
    isRegister?: boolean;
}

export interface ResponseApiClient<K> {
    status: number;
    res: ApiResponse<K>
}

export function useCustomMutation<T, K>(mutationKey: string[]) {
    const request = async ({ url, body }: mutationProps<T>) => {
        const res = await instance.post(
            url,
            body,
            {
                validateStatus: () => true,
            }
        );
        const result: ResponseApiClient<K> = { 
            status: res.status, 
            res: res.data
        };
        console.log("La struttura del client è: ", result);
        return result;
    };

    return useMutation({
        mutationKey,
        mutationFn: request,
    });
}
