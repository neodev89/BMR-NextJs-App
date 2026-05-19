'use client'

import MenuIcon from '@mui/icons-material/Menu';

import { useListenWidth } from "@/src/hooks/useListenWidth";
import { ReactNode, useState } from "react";
import { Navbar } from "../components/navbar/Navbar";
import { MobileNavbar } from "../components/navbar/MobileNavbar";
import { IconButton } from '@mui/material';

export default function GlobalWrapper({
    children
}: {
    children: ReactNode;
}) {
    const listenWidth = useListenWidth();
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div className="wrapper">
            <div className="navbar">
                {
                    listenWidth > 768 ?
                        (
                            <Navbar />
                        ) :
                        (
                            <div className="relative flex flex-col h-full w-auto min-w-10">
                                <IconButton onClick={() => setOpen(true)}>
                                    <MenuIcon color='primary' />
                                </IconButton>
                                <MobileNavbar open={open} setOpen={setOpen} />
                            </div>
                        )
                }
            </div>
            <div className="children">
                {children}
            </div>
            <div className="footer">
                Footer
            </div>
        </div>
    )
}