import "@/src/app/globals.css";
import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
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
                <Link href={'#'} className="links links-hover">
                    Account
                </Link>
            </div>
            <div className="user"></div>
        </div>
    )
}