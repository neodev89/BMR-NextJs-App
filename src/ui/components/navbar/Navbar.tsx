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
    console.log("PATHNAME splittato: ", splittedPathname);
    // output: ["", "[user]", "route"]
    const replaceStatisticsPath = pathname.replace(`${splittedPathname[2]}`, "statistics");
    const replacedYourData = pathname.replace(`${splittedPathname[2]}`, "foods");
    const replacedTableStatistic = pathname.replace(`${splittedPathname[2]}`, "table");
    console.log(replacedTableStatistic);
    
    const escapeUser = useCustomDeleteMutation({
        mutationKey: ["escape-user"]
    });

    const token = useGet<{ email: string }>({
        key: ["disconnect-user"],
        url: "cookies",
    });

    const handleEsc = async () => {
        try {
            if (token.data) {
                const res = await escapeUser.mutateAsync({
                    url: "cookies",
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
                        <Link href={`${replaceStatisticsPath}`} className="links links-hover">
                            Statistiche
                        </Link>
                        <Link href={`${replacedYourData}`} className="links links-hover">
                            Pasti
                        </Link>
                        <Link href={`${replacedTableStatistic}`} className="links links-hover">
                            Tabella
                        </Link>
                    </>
                )}
            </div>
            <div className="user"></div>
        </div>
    )
}