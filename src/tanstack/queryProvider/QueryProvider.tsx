"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

interface wrapperQueryProps {
    children: ReactNode;
}

export function WrapperQueryClientProvider({
    children
}: wrapperQueryProps) {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
};