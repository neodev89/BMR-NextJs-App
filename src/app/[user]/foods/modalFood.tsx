'use client'

import CloseIcon from '@mui/icons-material/Close';
import React, { Dispatch, SetStateAction } from "react";
import { Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle, IconButton, Slide, Typography } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { Form, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { newFoodSchema, newFoodType } from '@/src/zod/newFoodSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ControlledInput } from '@/src/ui/components/custom-input/customControlledInput';

interface modalFoodProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}


const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<unknown>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ModalFood(props: modalFoodProps) {
    const handleClose = () => {
        props.setOpen(false);
    };

    const initialState: newFoodType = {
        nome: "",
        calorie_100g: 0,
        unita: "",
    };

    const { control, handleSubmit } = useForm<newFoodType>({
        defaultValues: initialState,
        resolver: zodResolver(newFoodSchema),
    });

    const onSubmit: SubmitHandler<newFoodType> = async (data) => {
        console.log("Invio dati nuovi pasti");
        return data;
    };

    const onError: SubmitErrorHandler<newFoodType> = (errors) =>
        console.log(errors)

    return (
        <Dialog
            open={props.open}
            fullScreen
            slots={{
                transition: Transition,
            }}
        >
            <DialogTitle>
                <div className="flex flex-row justify-between w-full h-28 bg-white">
                    <IconButton onClick={handleClose}>
                        <CloseIcon color="error" />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Typography variant="h3">Aggiungi altri cibi che assumi ricordando di inserire il &quot;nome&quot;, le &quot;calorie&quot; per cento grammi e l&apos;unità di misura espressa in grammi</Typography>
                </DialogContentText>
                <Box className="flex flex-row h-full w-full justify-start items-center">
                    <Form
                        action=""
                        control={control}
                        method='post'
                        onSuccess={() => {
                            handleClose();
                        }}
                        className="form_row"
                    >
                        <ControlledInput
                            control={control}
                            name={"nome"}
                            type={"text"}
                            values={undefined}
                        />
                        <ControlledInput
                            control={control}
                            name={"calorie_100g"}
                            type={"number"}
                            values={undefined}
                        />
                        <ControlledInput
                            control={control}
                            name={"unita"}
                            type={"text"}
                            values={undefined}
                        />
                        <button type="submit" onSubmit={handleSubmit(onSubmit)}
                            className="links links-hover"
                        >
                            Invia
                        </button>
                    </Form>
                </Box>
            </DialogContent>
        </Dialog>
    )
}