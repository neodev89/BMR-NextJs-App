'use client'
import dynamic from "next/dynamic"
import Image from "next/image";
import Link from "next/link";


const LazyGlobalWrapper = dynamic(() => import("@/src/ui/globalWrapper/GlobalWrapper"), {
    ssr: false,
});

export default function HomeComponent() {
    return (
        <LazyGlobalWrapper>
            <div className="home">
                <div className="box_img">
                    <div className="relative flex flex-row h-80 w-2/5 border border-violet-600 object-cover object-center rounded-2xl">
                        <Image
                            src={'/sfondo-home.svg'}
                            alt={"immagine di presentazione dell'app per il calcolo del BMR"}
                            fill
                            preload
                            unoptimized
                            className="h-full w-72"
                        />
                    </div>
                </div>
                <div className="box_title">
                    <h1 className="title">LA TUA APP PER MONITORARE IL TUO BMR E IL TUO TDEE</h1>
                </div>
                <div className="relative flex flex-row h-1/2 w-full justify-center items-center">
                    <div className="relative flex flex-row">
                        <p className="paragraph">
                            Esegui il <Link href={'/login'}><u className="routes-hover">Login</u></Link> per utilizzare l&apos;App!
                        </p>
                    </div>
                </div>
            </div>
        </LazyGlobalWrapper>
    )
};