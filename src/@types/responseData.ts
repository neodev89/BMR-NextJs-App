import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

interface responseData<T,> {
    data: T,
    cookie: ResponseCookie | string | undefined;
}

export type { responseData };