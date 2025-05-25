import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import type {TrafficWithoutIdType} from "../types/types.ts";

type CreateTrafficFormProps = {
    open: boolean;
    onClose: () => void;
    onSave: (data: TrafficWithoutIdType) => void;
    initialData: TrafficWithoutIdType;
}

export default function CreateTrafficForm({ open, onClose, onSave }: CreateTrafficFormProps) {
    const [date, setDate] = useState<Date | null>(null);
    const [visits, setVisits] = useState<number>(0);

    const handleSave = () => {
        if (!date || visits < 0) return;
        onSave({ date: date.toISOString().split("T")[0], visits });
        onClose();
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>{"Add New Entry"}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <DatePicker
                        label="Date"
                        value={date}
                        onChange={(newDate) => setDate(newDate)}
                    />
                    <TextField
                        label="Visits"
                        type="number"
                        value={visits}
                        onChange={(e) => setVisits(Number(e.target.value))}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Add</Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}
