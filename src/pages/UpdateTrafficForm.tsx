import { useState, useEffect } from "react";
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
import type {TrafficType} from "../types/types.ts";

type UpdateTrafficFormProps = {
    open: boolean;
    onClose: () => void;
    onSave: (data: TrafficType) => void;
    initialData: TrafficType;
}

export default function UpdateTrafficForm({ open, onClose, onSave, initialData }: UpdateTrafficFormProps) {
    const [date, setDate] = useState<Date | null>(null);
    const [visits, setVisits] = useState<number>(0);

    // const { id } = useParams();
    useEffect(() => {
        if (initialData) {
            setDate(new Date(initialData.date));
            setVisits(initialData.visits);
        }
    }, [initialData]);

    const handleSave = () => {
        if (!date || visits < 0) return;
        onSave({ date: date.toISOString().split("T")[0], visits, id: initialData.id });
        onClose();
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>{"Edit Entry"}</DialogTitle>
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
                    <Button onClick={handleSave} variant="contained">{"Update"}</Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}
