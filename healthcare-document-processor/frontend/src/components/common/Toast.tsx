import React from 'react';
import { Snackbar, Alert, type AlertColor } from '@mui/material';
import { CheckCircle, Error, Warning, Info } from '@mui/icons-material';

interface ToastProps {
    open: boolean;
    message: string;
    severity?: AlertColor;
    onClose: () => void;
    autoHideDuration?: number;
}

const Toast: React.FC<ToastProps> = ({
    open,
    message,
    severity = 'info',
    onClose,
    autoHideDuration = 6000,
}) => {
    const getIcon = () => {
        switch (severity) {
            case 'success':
                return <CheckCircle />;
            case 'error':
                return <Error />;
            case 'warning':
                return <Warning />;
            default:
                return <Info />;
        }
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert
                onClose={onClose}
                severity={severity}
                icon={getIcon()}
                sx={{
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default Toast;