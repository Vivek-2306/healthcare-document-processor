import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Box,
} from '@mui/material';
import { PlayArrow, Stop } from '@mui/icons-material';
import { useToast } from '../../hooks/useToast';

interface ProcessDocumentButtonProps {
  documentId: string;
  documentStatus: string;
  onProcess: (documentId: string) => Promise<void>;
  disabled?: boolean;
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const ProcessDocumentButton: React.FC<ProcessDocumentButtonProps> = ({
  documentId,
  documentStatus,
  onProcess,
  disabled = false,
  variant = 'contained',
  size = 'medium',
  fullWidth = false,
}) => {
  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { showToast } = useToast();

  const isProcessing = documentStatus === 'processing';
  const isProcessed = documentStatus === 'processed';

  const handleClick = () => {
    if (isProcessing) {
      showToast('Document is already being processed', 'info');
      return;
    }
    if (isProcessed) {
      setOpen(true);
    } else {
      handleProcess();
    }
  };

  const handleProcess = async () => {
    setOpen(false);
    setProcessing(true);
    try {
      await onProcess(documentId);
      showToast('Document processing started successfully', 'success');
    } catch (error: any) {
      showToast(
        error?.response?.data?.detail || 'Failed to start processing',
        'error'
      );
    } finally {
      setProcessing(false);
    }
  };

  const buttonText = isProcessing
    ? 'Processing...'
    : isProcessed
      ? 'Reprocess Document'
      : 'Process Document';

  return (
    <>
      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        startIcon={
          processing ? (
            <CircularProgress size={16} color="inherit" />
          ) : isProcessing ? (
            <Stop />
          ) : (
            <PlayArrow />
          )
        }
        onClick={handleClick}
        disabled={disabled || processing || isProcessing}
      >
        {buttonText}
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Reprocess Document?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This document has already been processed. Do you want to process it
            again? This will overwrite the existing processed data.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleProcess} variant="contained" color="primary">
            Reprocess
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProcessDocumentButton;
