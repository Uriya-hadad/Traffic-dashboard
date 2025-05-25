import {TableCell, IconButton} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type {TrafficType} from "../types/types.ts";

type TrafficDateProps = {
    traffic: TrafficType;
    onEdit: ({date, visits, id}: TrafficType) => void;
    onDelete: ({date, visits, id}: TrafficType) => void;
}

export const TrafficDate = ({traffic, onEdit, onDelete}: TrafficDateProps) => {
    return (
        <>
            <TableCell>{traffic.date}</TableCell>
            <TableCell align="center">{traffic.visits}</TableCell>
            <TableCell align="right">
                <IconButton onClick={() => onEdit(traffic)} color="primary">
                    <EditIcon/>
                </IconButton>
                <IconButton onClick={() => onDelete(traffic)} color="error">
                    <DeleteIcon/>
                </IconButton>
            </TableCell>
        </>
    );
};
