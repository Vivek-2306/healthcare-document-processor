import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
} from '@mui/material';
import { Warning, CheckCircle, Error, Info } from '@mui/icons-material';

interface ConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    severity?: 'warning' | 'error' | 'info' | 'success';
    loading?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    open,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    severity = 'warning',
    loading = false,
}) => {
    const getIcon = () => {
        const iconProps = { sx: { fontSize: 48, mb: 2 } };
        switch (severity) {
            case 'error':
                return <Error color="error" {...iconProps} />;
            case 'warning':
                return <Warning color="warning" {...iconProps} />;
            case 'info':
                return <Info color="info" {...iconProps} />;
            case 'success':
                return <CheckCircle color="success" {...iconProps} />;
        }
    };

    const getConfirmColor = () => {
        switch (severity) {
            case 'error':
                return 'error';
            case 'warning':
                return 'warning';
            default:
                return 'primary';
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    minWidth: 400,
                },
            }}
        >
            <DialogTitle>
                <Box sx={{ textAlign: 'center', pt: 2 }}>
                    {getIcon()}
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {title}
                    </Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1" color="text.secondary" align="center">
                    {message}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
                <Button onClick={onClose} variant="outlined" disabled={loading}>
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color={getConfirmColor()}
                    disabled={loading}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;