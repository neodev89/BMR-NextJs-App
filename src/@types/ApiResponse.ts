import jwt from "jsonwebtoken";

interface ApiResponse<T,> {
    success: boolean;
    message: string;
    data: T;
    status: number;
}

type tokenApiResponse = jwt.JwtPayload & {
    email: string;
}

export type { ApiResponse, tokenApiResponse };