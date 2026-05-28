'use client'

import instance from "@/src/axios/instance";
import { ApiResponse } from "@/src/@types/ApiResponse";
import { NetworkMode, useMutation, useQueryClient } from "@tanstack/react-query";
import { Method } from "axios";

interface MutationProps<T> {
    url: string;
    retry?: number;
    body?: T;
    method?: Method;
    invalidateKeys?: string[];
    pathSuccess?: string;
    pathErrorCredential?: string;
    pathError?: string;
}

export interface ResponseApiClient<K> {
    status: number;
    res: ApiResponse<K>;
}

export interface hookProps {
    mutationKey: string[];
    retry?: number;
    networkMode?: NetworkMode | undefined;
    gcTime?: number;
    description?: string;
}

export function useTotalCustomMutation<T, K>({ mutationKey, ...other }: hookProps) {
    const queryClient = useQueryClient();

    const request = async ({ url, body, method = "POST" }: MutationProps<T>) => {
        const res = await instance.request({
            url,
            method,
            data: body,
            validateStatus: () => true,
        });

        const result: ResponseApiClient<K> = {
            status: res.status,
            res: res.data,
        } satisfies ResponseApiClient<K>;

        console.log("Client response:", result);
        return result;
    };

    return useMutation<ResponseApiClient<K>, Error, MutationProps<T>>({
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
                    queryClient.invalidateQueries({ queryKey: [key] });
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
}
