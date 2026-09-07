import { NetworkMode } from "@tanstack/react-query";
import { Method } from "axios";
import { ApiResponse } from "./ApiResponse";

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

interface ResponseApiClient<K> {
    status: number;
    res: ApiResponse<K>;
}

interface hookProps {
    mutationKey: string[];
    retry?: number;
    networkMode?: NetworkMode | undefined;
    gcTime?: number;
    description?: string;
}

export type {
    MutationProps,
    ResponseApiClient,
    hookProps
}