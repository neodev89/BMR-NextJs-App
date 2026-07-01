import bcrypt from "bcrypt";

export async function saltAndHashPassword(password: unknown): Promise<string> {
    if (typeof password === 'string') {
        const hashed = await bcrypt.hash(password, 10);
        return hashed;
    } else {
        const stringPw = String(password);
        const hashed = await bcrypt.hash(stringPw, 10);
        return hashed;
    }
};