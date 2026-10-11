"use client"

import GlobalWrapper from "@/src/ui/globalWrapper/GlobalWrapper"
import { useState } from "react";
import ModalFood from "./modalFood";


export default function YourData() {
    const [openModal, setOpenModal] = useState<boolean>(false);
    return (
        <GlobalWrapper>
            <div className="dashboard">
                <div className="relative flex flex-row h-full w-full justify-evenly items-center">
                    <div className="cards gradient-border">
                        <div className="subcards">
                            <div className="title_cards">
                                <p>
                                    Pasti assunti
                                </p>
                            </div>
                            <div className="body_cards2">
                                <div className="relative flex flex-col items-center w-full h-full border">
                                    <button className="links links-hover" type="button" onClick={() => setOpenModal(true)}>
                                        Aggiungi pasti
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalFood open={openModal} setOpen={setOpenModal} />
        </GlobalWrapper>
    )
}