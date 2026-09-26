'use client';

import instance from "@/src/axios/instance";
import { useMutation } from "@tanstack/react-query";

interface PdfMutationProps<T> {
    url: string;
    body: T;
}

const apiUrlPy = process.env.URL_API_PY ?? "http://127.0.0.1:8002";

export function usePostBlob<T>(mutationKey: string[]) {
    const request = async ({ url, body }: PdfMutationProps<T>) => {
        const res = await instance.post(`${apiUrlPy}/api/${url}`, body, {
            responseType: "blob", // 👈 fondamentale
            validateStatus: () => true,
        });

        return res.data; // 👈 è un Blob, non JSON
    };

    return useMutation({
        mutationKey,
        mutationFn: request,
    });
}
