import YourData from "./YourData";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function UserData() {
    const token = (await cookies()).get("login-cookies")?.value;

    if (!token) redirect("/")
    return (
        <>
            <YourData />
        </>
    )
}