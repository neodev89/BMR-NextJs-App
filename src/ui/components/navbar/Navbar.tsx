'use client'

import "@/src/app/globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const hasDynamicUser = segments.length > 1;
    // output in dashboard: /[user]/dashboard 
    const replaceAccountPath = pathname.replace("/dashboard", "/account");
    const replacedYourData = pathname.replace("/dashboard", "/your-data");

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
                <Link href={'/'} className="links links-hover">
                    Home
                </Link>
                {hasDynamicUser && (
                    <>
                    <Link href={`${replaceAccountPath}`} className="links links-hover">
                        Account
                    </Link>
                    <Link href={`${replacedYourData}`} className="links links-hover">
                        I tuoi Valori
                    </Link>
                    </>
                )}
            </div>
            <div className="user"></div>
        </div>
    )
}