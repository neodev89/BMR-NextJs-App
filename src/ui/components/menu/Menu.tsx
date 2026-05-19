'use client'

import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


interface menuItemsProps {
    items: Array<"Sedentario" | "Leggermente attivo" | "Moderatamente attivo" | "Molto attivo" | "Atleta">;
    setValue: React.Dispatch<React.SetStateAction<"Sedentario" | "Leggermente attivo" | "Moderatamente attivo" | "Molto attivo" | "Atleta">>;
    value: string;
}

export default function BasicMenu({ items, value, setValue }: menuItemsProps) {
    const id = React.useId();
    const buttonId = `${id}-button`;
    const menuId = `${id}-menu`;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, item: "Sedentario" | "Leggermente attivo" | "Moderatamente attivo" | "Molto attivo" | "Atleta") => {
        e.preventDefault();
        setValue(item)
        setAnchorEl(null);
    };
    const handleCloseEmpty = () => {
        setAnchorEl(null);
    };

    return (
        <div className="flex flex-col w-1/2 h-auto">
            <Button
                id={buttonId}
                aria-controls={open ? menuId : undefined}
                aria-haspopup="true"
                aria-expanded={open}
                sx={{
                    color: "white",
                    backgroundColor: "#7f22fe",
                    fontWeight: 600,
                }}
                onClick={handleClick}
            >
                Stile di vita
            </Button>
            <Menu
                id={menuId}
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseEmpty}
                slotProps={{
                    list: {
                        'aria-labelledby': buttonId,
                        sx: {
                            backgroundColor: 'black',
                            color: 'white',
                        }
                    },
                }}
            >
                {
                    items.length > 0 ?
                        (
                            <>
                                {
                                    items.map((el, idx) => (
                                        <MenuItem key={idx} onClick={(e) => handleClose(e, el)}>{el}</MenuItem>
                                    ))
                                }
                            </>
                        ) :
                        (
                            <MenuItem onClick={handleCloseEmpty}>empty</MenuItem>
                        )
                }
            </Menu>
        </div>
    );
}
