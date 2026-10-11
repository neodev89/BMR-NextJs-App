'use client'

import "@/src/app/globals.css";
import Link from "next/link";
import { useCustomDeleteMutation } from "@/src/tanstack/api/useDelete";
import { useGet } from "@/src/tanstack/api/useGet";
import { usePathname, useRouter } from "next/navigation";

export const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const hasDynamicUser = segments.length > 1;
    // output in dashboard: /[user]/dashboard 
    // console.log("PATHNAME: ", pathname); // /[user]/route
    const splittedPathname = pathname.split("/");
    // console.log("PATHNAME splittato: ", splittedPathname);
    // output: ["", "[user]", "route"]
    const replaceAccountPath = pathname.replace(`${splittedPathname[2]}`, "/account");
    const replacedYourData = pathname.replace(`${splittedPathname[2]}`, "/your-data");

    const escapeUser = useCustomDeleteMutation({
        mutationKey: ["escape-user"]
    });

    const token = useGet<{ email: string }>({
        key: ["disconnect-user"],
        url: "/api/cookies",
    });

    const handleEsc = async () => {
        try {
            if (token.data) {
                const res = await escapeUser.mutateAsync({
                    url: "/api/cookies",
                    body: {},
                });
                if (res.status === 200) {
                    router.push("/")
                } else {
                    return;
                }
            } else return;
        } catch (error) {
            console.log("Errore nella chiamata: ", error)
        }
    }

    return (
        <div className="navbar-link">
            {/* <div className="logo">
                <Image
                    src={'/logo.svg'}
                    alt={'logo professionale Next.js Consultant'}
                    fill
                    unoptimized
                    loading={'eager'}
                />
            </div> */}
            <div className="link-menu">
                {
                    splittedPathname.length <= 2 ? (
                        <Link href={"/"} className="links links-hover">
                            Home
                        </Link>
                    ) : (
                        <button onClick={handleEsc} className="links links-hover">
                            Esci
                        </button>
                    )
                }
                {hasDynamicUser && (
                    <>
                        <Link href={`${replaceAccountPath}`} className="links links-hover">
                            Account
                        </Link>
                        <Link href={`${replacedYourData}`} className="links links-hover">
                            Pasti
                        </Link>
                    </>
                )}
            </div>
            <div className="user"></div>
        </div>
    )
}