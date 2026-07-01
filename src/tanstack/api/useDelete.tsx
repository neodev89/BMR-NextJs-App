'use client'

import { ApiResponse } from "@/src/@types/ApiResponse";
import instance from "@/src/axios/instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Method } from "axios";
import { hookProps } from "./useTotalMutation";

interface mutationProps<T> {
    url: string;
    body: T;
    invalidateKeys?: string[];
    pathSuccess?: string;
    pathErrorCredential?: string;
    pathError?: string;
    method?: Method;
    pathRegister?: string;
    isRegister?: boolean;
}

interface ResponseApiClient<K> {
    status: number;
    res: ApiResponse<{ data: K }>
}

export function useCustomDeleteMutation<T, K>({ mutationKey, ...other }: hookProps) {
    const queryClient = useQueryClient();

    const request = async ({ url, body }: mutationProps<T>) => {
        const res = await instance.delete(
            url,
            {
                data: body
            },
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
        // 🔥 CONFIGURAZIONE AVANZATA
        retry: other.retry || 1,
        networkMode: other.networkMode || 'online',
        gcTime: other.gcTime || 1000 * 60 * 5, // 5 minuti
        meta: {
            description: other.description || "Custom mutation with full control",
        },
        // 🔥 SUCCESS HANDLER
        onSuccess: (data, variables) => {
            console.log("Mutation success:", data);

            // invalidazione query
            if (variables.invalidateKeys) {
                variables.invalidateKeys.forEach((key) => {
                    queryClient.invalidateQueries({ 
                        queryKey: [key],
                        refetchType: "all",
                        type: "active"
                    });
                });
            }

            // redirect success
            if (variables.pathSuccess) {
                window.location.href = variables.pathSuccess;
            }
        },
        // 🔥 ERROR HANDLER
        onError: (error, variables) => {
            console.error("Mutation error:", error);

            if (variables.pathErrorCredential) {
                window.location.href = variables.pathErrorCredential;
            } else if (variables.pathError) {
                window.location.href = variables.pathError;
            }
        },

        // 🔥 ALWAYS
        onSettled: () => {
            console.log("Mutation settled");
        },
    });
};