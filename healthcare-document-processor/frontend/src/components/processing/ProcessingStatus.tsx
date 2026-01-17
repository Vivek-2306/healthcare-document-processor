import React from 'react';
import {
  Box,
  LinearProgress,
  Typography,
  Chip,
  Alert,
  Stack,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  HourglassEmpty,
  Refresh,
  PlayArrow,
} from '@mui/icons-material';
import { DocumentStatus } from '../../types/document.types';
import { ProcessingStatus as ProcessingStatusEnum } from '../../types/processing.types';

interface ProcessingStatusProps {
  status: DocumentStatus;
  error?: string;
  onRetry?: () => void;
  stages?: Array<{
    name: string;
    status: ProcessingStatusEnum;
    progress?: number;
    message?: string;
  }>;
  estimatedTimeRemaining?: number; // in seconds
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  status,
  error,
  onRetry,
  stages,
  estimatedTimeRemaining,
}) => {
  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.PROCESSED:
        return 'success';
      case DocumentStatus.PROCESSING:
        return 'info';
      case DocumentStatus.FAILED:
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.PROCESSED:
        return <CheckCircle />;
      case DocumentStatus.PROCESSING:
        return <HourglassEmpty />;
      case DocumentStatus.FAILED:
        return <Error />;
      default:
        return null;
    }
  };

  const formatTimeRemaining = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds} seconds`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getStatusIcon(status)}
              <Typography variant="h6">Processing Status</Typography>
            </Box>
            <Chip
              label={status.toUpperCase()}
              color={getStatusColor(status)}
              icon={getStatusIcon(status)}
            />
          </Box>

          {status === DocumentStatus.PROCESSING && (
            <>
              {estimatedTimeRemaining && (
                <Typography variant="body2" color="text.secondary">
                  Estimated time remaining: {formatTimeRemaining(estimatedTimeRemaining)}
                </Typography>
              )}
              <LinearProgress />
            </>
          )}

          {stages && stages.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Processing Stages:
              </Typography>
              <Stack spacing={1}>
                {stages.map((stage, index) => (
                  <Box key={index}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="body2">{stage.name}</Typography>
                      <Chip
                        label={stage.status}
                        size="small"
                        color={
                          stage.status === ProcessingStatusEnum.COMPLETED
                            ? 'success'
                            : stage.status === ProcessingStatusEnum.FAILED
                            ? 'error'
                            : 'default'
                        }
                      />
                    </Box>
                    {stage.progress !== undefined && (
                      <LinearProgress
                        variant="determinate"
                        value={stage.progress}
                        sx={{ mt: 0.5 }}
                      />
                    )}
                    {stage.message && (
                      <Typography variant="caption" color="text.secondary">
                        {stage.message}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {error && (
            <Alert severity="error" action={onRetry && <Button onClick={onRetry} size="small">Retry</Button>}>
              {error}
            </Alert>
          )}

          {status === DocumentStatus.FAILED && onRetry && (
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={onRetry}
              fullWidth
            >
              Retry Processing
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProcessingStatus;
