'use client'

import Image from "next/image";
import CloseIcon from '@mui/icons-material/Close';

import { Drawer, IconButton } from "@mui/material"
import { Dispatch, SetStateAction, useCallback } from "react";
import Link from "next/link";


interface drawerProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export const MobileNavbar = ({
    open, setOpen
}: drawerProps) => {

    const handleClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    return (
        <Drawer
            open={open}
            onClose={handleClose}
            sx={{
                width: "320px",
                border: "2px solid white",
                borderRadius: 4,
            }}
            slotProps={{
                paper: {
                    sx: {
                        backgroundColor: "black",
                        color: "white",
                    }
                }
            }}
        >
            <div className="navbar-link">
                <div className="relative flex flex-row justify-end h-5 w-full ">
                    <IconButton onClick={handleClose}>
                        <CloseIcon color="error" />
                    </IconButton>
                </div>
                <div className="logo">
                    <Image
                        src={'/logo.svg'}
                        alt={'logo professionale Next.js Consultant'}
                        fill
                        unoptimized
                        loading="eager"
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
        </Drawer>
    )
}