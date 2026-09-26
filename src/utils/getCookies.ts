import jwt from "jsonwebtoken";

export const getCookies = async () => {
    const asyncGetCook = async () => {
        const res = await fetch(
            "/api/cookies",
            {
                headers: {
                    "Content-Type": "application/json"
                },
                cache: "default",
            },
        );
        if (!res.ok) return null;
        const result = await res.json();
        return result;
    };
    const aGC = await asyncGetCook();
    if (!aGC) return null;
    const cookie = aGC as jwt.JwtPayload;
    return cookie; 
}