'use client'
import dynamic from "next/dynamic"
import Link from "next/link";


const LazyGlobalWrapper = dynamic(() => import("@/src/ui/globalWrapper/GlobalWrapper"), {
    ssr: false,
});

export default function HomeComponent() {
    return (
        <LazyGlobalWrapper>
            <div className="relative flex flex-col h-auto-w-full">
                <div className="relative flex h-20 w-full">
                    <h1 className="title">LA TUA APP PER MONITORARE IL TUO BMR</h1>
                </div>
                <div className="relative flex flex-row h-72 w-full">
                    <p className="paragraph">
                        esegui il <Link href={'/login'}><u className="routes-hover">Login</u></Link> per utilizzare l&apos;App!
                    </p>
                </div>
            </div>
        </LazyGlobalWrapper>
    )
};