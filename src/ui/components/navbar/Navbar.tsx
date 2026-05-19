'use client'

import "@/src/app/globals.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const hasDynamicUser = segments.length > 1;
    console.log(pathname);
    // output in dashboard: /[user]/dashboard 
    const replaceAccountPath = pathname.replace("/dashboard", "/account");
    console.log("secondo account path: ", replaceAccountPath);

    return (
        <div className="navbar-link">
            <div className="logo">
                <Image
                    src={'/logo.svg'}
                    alt={'logo professionale Next.js Consultant'}
                    fill
                    unoptimized
                    loading={'eager'}
                />
            </div>
            <div className="link-menu">
                <Link href={'/'} className="links links-hover">
                    Home
                </Link>
                {hasDynamicUser && (
                    <Link href={`${replaceAccountPath}`} className="links links-hover">
                        Account
                    </Link>
                )}
            </div>
            <div className="user"></div>
        </div>
    )
}