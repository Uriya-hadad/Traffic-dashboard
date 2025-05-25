import {  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import type {TrafficType} from "../types/types.ts";

type DeleteTrafficFormProps = {
    entry: TrafficType;
    open: boolean;
    onDelete: (entry: TrafficType) => void;
    onClose: () => void;
}

export default function DeleteTrafficForm({ open, onClose, entry, onDelete }: DeleteTrafficFormProps) {


    const handleConfirm = () => {
        onDelete(entry);
        onClose();
    };

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete the entry?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleConfirm} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
