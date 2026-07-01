import { ApiResponse } from "../@types/ApiResponse";

export const responseObjApi = async <T extends object | unknown>({
    success = false,
    message = '',
    data,
    status
}: ApiResponse<T>) => {
    return Response.json(
        {
            success,
            message,
            data,
            status
        } satisfies ApiResponse<T>,
        { status, },
    );
};