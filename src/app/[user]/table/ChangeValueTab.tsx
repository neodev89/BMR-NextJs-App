'use client'

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { modalChangeValTabTypes } from "@/src/@types/modalChangeValTab";
import { Dialog, DialogActions, Button, DialogContent } from "@mui/material";

export default function ChangeValueTab(props: modalChangeValTabTypes) {

    return (
        <Dialog
            open={props.open}
            fullWidth
            sx={{
                height: "75%",
                borderRadius: 4,
                backgroundColor: "rgba(255, 255, 255, 0.7)"
            }}
        >
            <DialogActions>
                <Button 
                    variant="outlined" 
                    endIcon={<KeyboardArrowRightIcon />}
                >
                    Close
                </Button>
            </DialogActions>
            <DialogContent>
                
            </DialogContent>
        </Dialog>
    )
}