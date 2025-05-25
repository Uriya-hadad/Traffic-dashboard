import {
    Alert,
    Snackbar,
} from '@mui/material';

export type SnackbarAlertProps = {
    open: boolean;
    onClose: () => void;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
}

export function SnackbarAlert({ open, onClose, message, severity }: SnackbarAlertProps) {
    return (
        <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
            <Alert onClose={onClose} variant="standard" severity={severity} sx={{ width: "100%" }}>
                {message}
            </Alert>
        </Snackbar>
    );
}
